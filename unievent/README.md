# UniEvent - University Event Management System

**Prepared by:** Dua e Zahra
**Role:** Cloud Architect

## Problem Statement

The university plans to launch **UniEvent**, a centralized platform where students can browse university events, register for activities, and view event-related media. 

*Requirements:*
- Must automatically fetch event data from a legitimate Open API (we chose **Ticketmaster API**).
- Scalable, fault-tolerant, and secure architecture utilizing AWS best practices.
- Core services used: IAM, VPC, EC2, S3, and Elastic Load Balancing.
- Must run the web application across multiple EC2 instances specifically in **Private Subnets**.
- All event posters/images must be stored securely in **S3**.

## Architecture & Design Justification

The system uses a full-stack Next/React React frontend combined with a customized Node.js backend to fulfill all assignment deliverables:

### 1. Open API Integration (Node.js Backend)
The system does not blindly fetch from the frontend. A backend Express server utilizes a background job (`node-cron`) to periodically scrape official events from the publicly available **Ticketmaster Discovery API**.
- **Justification:** Caching events in the backend memory reduces third-party API rate limiting and provides a single source of truth for all EC2 instances. Ticketmaster provides highly structured JSON (titles, dates, descriptions, venues, and media links) perfectly suited for university-level event data.

### 2. Secure Media Storage (Amazon S3)
- **Implementation:** During the background fetch step, the Node.js server extracts the image `url` provided by Ticketmaster, downloads the image physically into memory, and uploads it via the AWS SDK to a private **Amazon S3 Bucket**. 
- **Justification:** Decouples heavy image-serving requests from the web servers, fulfilling the assignment requirement for secure cloud storage of event posters.

### 3. High Availability in Private Subnets
The entire infrastructure is defined as Infrastructure as Code (IaC) via Terraform (`/terraform`), creating the following secure environment:
- **Custom VPC:** Contains 2 Public Subnets and 2 Private Subnets.
- **NAT Instance:** A custom Free Tier `t3.micro` EC2 router sits in the public subnet. This satisfies the "private subnet" server requirement while still allowing our internal web servers internet access to fetch the Ticketmaster API, crucially without incurring the standard AWS NAT Gateway fees.
- **Auto Scaling Group (EC2):** Web servers live entirely inside the Private Subnets. If one fails, the Auto Scaling Group boots a replacement.
- **Application Load Balancer (ALB):** Spans across the public subnets, distributing traffic natively to the private EC2 instances ensuring zero downtime.

## How to Deploy (Terraform)

Prerequisites: AWS CLI configured with your credentials, and Terraform installed.

1. Navigate to the terraform directory:
   ```bash
   cd terraform
   ```
2. Initialize and download the AWS Provider:
   ```bash
   terraform init
   ```
3. Provision the full architecture:
   ```bash
   terraform apply -auto-approve
   ```
4. Wait 3-5 minutes. At the end, Terraform will output the Load Balancer URL (`alb_dns_name`). View this URL in your browser once the EC2 instances finish booting.

## Cleanup

To ensure you are not billed for resources outside of free-tier hours, destroy the infrastructure when your grading is complete:
```bash
terraform destroy -auto-approve
```
