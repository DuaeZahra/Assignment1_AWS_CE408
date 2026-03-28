# Security Group for EC2
resource "aws_security_group" "ec2_sg" {
  name        = "unievent-ec2-sg"
  description = "Allow inbound from ALB and NAT"
  vpc_id      = aws_vpc.main.id

  # Only ALB can hit EC2 on 8080
  ingress {
    from_port       = 8080
    to_port         = 8080
    protocol        = "tcp"
    security_groups = [aws_security_group.alb_sg.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"] # This gets routed through NAT in the route table
  }

  tags = {
    Name = "unievent-ec2-sg"
  }
}

# Find the latest Amazon Linux 2023 AMI
data "aws_ami" "al2023" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["al2023-ami-2023.*-x86_64"]
  }
}

# Launch Template for ASG
resource "aws_launch_template" "app_lt" {
  name_prefix   = "unievent-app-"
  image_id      = data.aws_ami.al2023.id
  instance_type = "t3.micro"

  iam_instance_profile {
    name = aws_iam_instance_profile.ec2_profile.name
  }

  vpc_security_group_ids = [aws_security_group.ec2_sg.id]

  # User Data script that configures the app and starts it
  user_data = base64encode(<<-EOF
    #!/bin/bash
    set -ex
    
    # Update and install dependencies
    yum update -y
    curl -fsSL https://rpm.nodesource.com/setup_20.x | bash -
    yum install -y nodejs unzip aws-cli

    # Wait for the NAT instance to initialize its routing (since we boot them at the same time)
    # Ping google 3 times, if fails, sleep and retry up to 10
    ATTEMPT=0
    while ! ping -c 1 8.8.8.8 >/dev/null 2>&1; do
      ATTEMPT=$((ATTEMPT + 1))
      if [ $ATTEMPT -gt 15 ]; break; fi
      sleep 10
    done

    # Setup app directory
    mkdir -p /app
    cd /app

    # Download source from S3 Deploy Bucket
    aws s3 cp s3://${aws_s3_bucket.deploy.id}/app.zip .
    unzip app.zip -d .
    
    # Write .env file
    cat <<EOT > .env
    PORT=8080
    S3_BUCKET_NAME=${aws_s3_bucket.images.id}
    AWS_REGION=us-east-1
    # Ticketmaster API Key is hardcoded as fallback but can be injected here
    EOT

    # Install PM2 and dependencies
    npm install -g pm2
    npm install

    # Start the backend server
    pm2 start backend/server.js --name unievent-backend
    pm2 save
    pm2 startup
  EOF
  )

  tag_specifications {
    resource_type = "instance"
    tags = {
      Name = "unievent-app-server"
    }
  }
}

# Auto Scaling Group in the private subnets
resource "aws_autoscaling_group" "app_asg" {
  name                = "unievent-asg"
  vpc_zone_identifier = aws_subnet.private[*].id
  target_group_arns   = [aws_lb_target_group.app_tg.arn]
  health_check_type   = "ELB"
  health_check_grace_period = 300

  min_size         = 2
  max_size         = 3
  desired_capacity = 2

  launch_template {
    id      = aws_launch_template.app_lt.id
    version = "$Latest"
  }
  
  # Trigger instance refresh if launch template changes
  instance_refresh {
    strategy = "Rolling"
  }

  depends_on = [
    aws_instance.nat,
    aws_s3_object.app_zip
  ]
}
