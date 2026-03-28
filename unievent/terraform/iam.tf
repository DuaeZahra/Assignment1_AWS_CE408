# Images Bucket
resource "aws_s3_bucket" "images" {
  bucket = "unievent-images-${random_string.suffix.result}"
}

resource "aws_s3_bucket_public_access_block" "images_public" {
  bucket                  = aws_s3_bucket.images.id
  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_policy" "images_policy" {
  bucket = aws_s3_bucket.images.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "PublicReadGetObject"
        Effect    = "Allow"
        Principal = "*"
        Action    = "s3:GetObject"
        Resource  = "${aws_s3_bucket.images.arn}/*"
      }
    ]
  })
  
  depends_on = [aws_s3_bucket_public_access_block.images_public]
}

# Deploy Bucket (for the application ZIP code)
resource "aws_s3_bucket" "deploy" {
  bucket = "unievent-deploy-${random_string.suffix.result}"
}

# Upload app.zip from local to the deploy bucket
resource "aws_s3_object" "app_zip" {
  bucket = aws_s3_bucket.deploy.id
  key    = "app.zip"
  source = "${path.module}/../app.zip"
  
  # Ensure file updates trigger terraform upload
  etag = filemd5("${path.module}/../app.zip")
}

# IAM Role for EC2 Application Instances
resource "aws_iam_role" "ec2_role" {
  name = "unievent_ec2_role_${random_string.suffix.result}"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action    = "sts:AssumeRole"
        Effect    = "Allow"
        Principal = {
          Service = "ec2.amazonaws.com"
        }
      }
    ]
  })
}

# Policy allowing the EC2 basic systems manager (SSM), S3 write access, and S3 read for deployment
resource "aws_iam_policy" "ec2_policy" {
  name = "unievent_ec2_policy_${random_string.suffix.result}"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "s3:PutObject",
          "s3:GetObject",
          "s3:ListBucket"
        ]
        Resource = [
          "${aws_s3_bucket.images.arn}",
          "${aws_s3_bucket.images.arn}/*",
          "${aws_s3_bucket.deploy.arn}",
          "${aws_s3_bucket.deploy.arn}/*"
        ]
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "ec2_s3_attach" {
  role       = aws_iam_role.ec2_role.name
  policy_arn = aws_iam_policy.ec2_policy.arn
}

resource "aws_iam_role_policy_attachment" "ssm_attach" {
  role       = aws_iam_role.ec2_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
}

resource "aws_iam_instance_profile" "ec2_profile" {
  name = "unievent_ec2_profile_${random_string.suffix.result}"
  role = aws_iam_role.ec2_role.name
}

output "images_bucket_name" {
  value = aws_s3_bucket.images.id
}
