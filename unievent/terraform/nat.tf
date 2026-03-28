# Security Group for the NAT instance
resource "aws_security_group" "nat_sg" {
  name        = "unievent-nat-sg"
  description = "Allow inbound traffic from private subnets"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = [aws_vpc.main.cidr_block]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "unievent-nat-sg"
  }
}

# We reuse the AL2023 AMI from ec2.tf instead of the deprecated legacy NAT AMI
resource "aws_instance" "nat" {
  ami                         = data.aws_ami.al2023.id
  instance_type               = "t3.micro" # Free tier for newer AWS accounts
  subnet_id                   = aws_subnet.public[0].id
  vpc_security_group_ids      = [aws_security_group.nat_sg.id]
  source_dest_check           = false # CRITICAL for a NAT instance

  user_data = <<-EOF
              #!/bin/bash
              echo "net.ipv4.ip_forward=1" >> /etc/sysctl.conf
              sysctl -p
              dnf install -y iptables
              iptables -t nat -A POSTROUTING -o enX0 -j MASQUERADE || iptables -t nat -A POSTROUTING -s ${aws_vpc.main.cidr_block} -j MASQUERADE
              EOF

  tags = {
    Name = "unievent-nat-instance"
  }
}

# Route internal private subnets Internet traffic through the NAT instance
resource "aws_route_table" "private" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block           = "0.0.0.0/0"
    network_interface_id = aws_instance.nat.primary_network_interface_id
  }

  tags = {
    Name = "unievent-private-rt"
  }
}

resource "aws_route_table_association" "private" {
  count          = 2
  subnet_id      = aws_subnet.private[count.index].id
  route_table_id = aws_route_table.private.id
}
