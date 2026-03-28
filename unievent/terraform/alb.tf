# Security group for the ALB
resource "aws_security_group" "alb_sg" {
  name        = "unievent-alb-sg"
  description = "Allow inbound HTTP/HTTPS traffic"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "unievent-alb-sg"
  }
}

# The actual load balancer
resource "aws_lb" "app" {
  name               = "unievent-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb_sg.id]
  subnets            = [aws_subnet.public[0].id, aws_subnet.public[1].id]
  
  tags = {
    Name = "unievent-alb"
  }
}

# Target group for backends (port 8080 because Node.js runs on 8080)
resource "aws_lb_target_group" "app_tg" {
  name     = "unievent-tg"
  port     = 8080
  protocol = "HTTP"
  vpc_id   = aws_vpc.main.id

  health_check {
    path                = "/api/events" # Health check endpoint
    healthy_threshold   = 2
    unhealthy_threshold = 10
    timeout             = 5
    interval            = 15
    matcher             = "200-399"
  }
}

# Listener from port 80 standard to our target group
resource "aws_lb_listener" "front_end" {
  load_balancer_arn = aws_lb.app.arn
  port              = "80"
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.app_tg.arn
  }
}

output "alb_dns_name" {
  description = "Public URL to access the UniEvent application"
  value       = aws_lb.app.dns_name
}
