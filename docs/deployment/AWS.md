# Deployment Guide: AWS (Amazon Web Services)

**Recommended for:** Enterprise applications, high traffic, complex requirements

**Estimated Time:** 2-4 hours
**Cost:** $60-200+/month
**Difficulty:** Hard ⭐⭐⭐

## Overview

This guide deploys a production-grade architecture on AWS:

- **Frontend** → S3 + CloudFront (CDN)
- **Backend** → ECS Fargate (Container service)
- **Database** → RDS PostgreSQL (Managed database)
- **Cache** → ElastiCache Redis
- **Load Balancer** → Application Load Balancer
- **SSL** → ACM (AWS Certificate Manager)
- **DNS** → Route 53

### Architecture Diagram

```
┌─────────────────┐
│   Route 53      │ ← DNS
└────────┬────────┘
         │
    ┌────┴─────┐
    │          │
┌───▼──────┐ ┌▼──────────┐
│CloudFront│ │    ALB     │ ← SSL Termination
│   (CDN)  │ │            │
└───┬──────┘ └─────┬──────┘
    │              │
┌───▼──────┐  ┌────▼────────┐
│    S3    │  │ ECS Fargate │ ← Backend (2+ tasks)
│ (Assets) │  │             │
└──────────┘  └──────┬──────┘
                     │
              ┌──────┴───────┬──────────┐
              │              │          │
         ┌────▼────┐   ┌─────▼────┐ ┌──▼──────┐
         │   RDS   │   │ElastiCache│ │   S3   │
         │Postgres │   │  Redis    │ │ Backups│
         └─────────┘   └───────────┘ └─────────┘
```

## Prerequisites

- AWS account with billing enabled
- AWS CLI installed
- Domain name
- Basic AWS knowledge
- Docker installed locally

## Part 1: Initial AWS Setup

### Step 1: Install AWS CLI

**macOS:**

```bash
brew install awscli
```

**Windows:**
Download from [AWS CLI Installer](https://aws.amazon.com/cli/)

**Linux:**

```bash
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install
```

### Step 2: Configure AWS Credentials

```bash
# Configure AWS CLI
aws configure

# Enter:
# AWS Access Key ID: YOUR_ACCESS_KEY
# AWS Secret Access Key: YOUR_SECRET_KEY
# Default region name: us-east-1
# Default output format: json

# Verify
aws sts get-caller-identity
```

**Create IAM user with necessary permissions:**

1. Go to AWS Console → IAM → Users
2. Click "Add users"
3. Username: `comptia-network-deploy`
4. Access type: Programmatic access
5. Attach policies:
   - AmazonEC2FullAccess
   - AmazonS3FullAccess
   - AmazonRDSFullAccess
   - AmazonECS_FullAccess
   - CloudFrontFullAccess
   - AWSCertificateManagerFullAccess
6. Save access key and secret key

### Step 3: Set Environment Variables

```bash
# Create deployment config
cat > aws-config.env << EOF
AWS_REGION=us-east-1
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
PROJECT_NAME=comptia-network
ENVIRONMENT=production
DOMAIN=yourdomain.com
EOF

source aws-config.env
```

## Part 2: VPC and Networking

### Step 1: Create VPC

```bash
# Create VPC
VPC_ID=$(aws ec2 create-vpc \
  --cidr-block 10.0.0.0/16 \
  --tag-specifications "ResourceType=vpc,Tags=[{Key=Name,Value=$PROJECT_NAME-vpc}]" \
  --query 'Vpc.VpcId' \
  --output text)

echo "VPC ID: $VPC_ID"

# Enable DNS hostnames
aws ec2 modify-vpc-attribute \
  --vpc-id $VPC_ID \
  --enable-dns-hostnames
```

### Step 2: Create Subnets

```bash
# Public Subnet 1 (us-east-1a)
PUBLIC_SUBNET_1=$(aws ec2 create-subnet \
  --vpc-id $VPC_ID \
  --cidr-block 10.0.1.0/24 \
  --availability-zone us-east-1a \
  --tag-specifications "ResourceType=subnet,Tags=[{Key=Name,Value=$PROJECT_NAME-public-1}]" \
  --query 'Subnet.SubnetId' \
  --output text)

# Public Subnet 2 (us-east-1b)
PUBLIC_SUBNET_2=$(aws ec2 create-subnet \
  --vpc-id $VPC_ID \
  --cidr-block 10.0.2.0/24 \
  --availability-zone us-east-1b \
  --tag-specifications "ResourceType=subnet,Tags=[{Key=Name,Value=$PROJECT_NAME-public-2}]" \
  --query 'Subnet.SubnetId' \
  --output text)

# Private Subnet 1 (us-east-1a)
PRIVATE_SUBNET_1=$(aws ec2 create-subnet \
  --vpc-id $VPC_ID \
  --cidr-block 10.0.3.0/24 \
  --availability-zone us-east-1a \
  --tag-specifications "ResourceType=subnet,Tags=[{Key=Name,Value=$PROJECT_NAME-private-1}]" \
  --query 'Subnet.SubnetId' \
  --output text)

# Private Subnet 2 (us-east-1b)
PRIVATE_SUBNET_2=$(aws ec2 create-subnet \
  --vpc-id $VPC_ID \
  --cidr-block 10.0.4.0/24 \
  --availability-zone us-east-1b \
  --tag-specifications "ResourceType=subnet,Tags=[{Key=Name,Value=$PROJECT_NAME-private-2}]" \
  --query 'Subnet.SubnetId' \
  --output text)

echo "Public Subnets: $PUBLIC_SUBNET_1, $PUBLIC_SUBNET_2"
echo "Private Subnets: $PRIVATE_SUBNET_1, $PRIVATE_SUBNET_2"
```

### Step 3: Internet Gateway and NAT Gateway

```bash
# Create Internet Gateway
IGW_ID=$(aws ec2 create-internet-gateway \
  --tag-specifications "ResourceType=internet-gateway,Tags=[{Key=Name,Value=$PROJECT_NAME-igw}]" \
  --query 'InternetGateway.InternetGatewayId' \
  --output text)

# Attach to VPC
aws ec2 attach-internet-gateway \
  --vpc-id $VPC_ID \
  --internet-gateway-id $IGW_ID

# Allocate Elastic IP for NAT Gateway
EIP_ALLOC=$(aws ec2 allocate-address \
  --domain vpc \
  --query 'AllocationId' \
  --output text)

# Create NAT Gateway
NAT_GW_ID=$(aws ec2 create-nat-gateway \
  --subnet-id $PUBLIC_SUBNET_1 \
  --allocation-id $EIP_ALLOC \
  --tag-specifications "ResourceType=nat-gateway,Tags=[{Key=Name,Value=$PROJECT_NAME-nat}]" \
  --query 'NatGateway.NatGatewayId' \
  --output text)

echo "Waiting for NAT Gateway to be available..."
aws ec2 wait nat-gateway-available --nat-gateway-ids $NAT_GW_ID
```

### Step 4: Route Tables

```bash
# Public Route Table
PUBLIC_RT=$(aws ec2 create-route-table \
  --vpc-id $VPC_ID \
  --tag-specifications "ResourceType=route-table,Tags=[{Key=Name,Value=$PROJECT_NAME-public-rt}]" \
  --query 'RouteTable.RouteTableId' \
  --output text)

# Add internet gateway route
aws ec2 create-route \
  --route-table-id $PUBLIC_RT \
  --destination-cidr-block 0.0.0.0/0 \
  --gateway-id $IGW_ID

# Associate public subnets
aws ec2 associate-route-table --subnet-id $PUBLIC_SUBNET_1 --route-table-id $PUBLIC_RT
aws ec2 associate-route-table --subnet-id $PUBLIC_SUBNET_2 --route-table-id $PUBLIC_RT

# Private Route Table
PRIVATE_RT=$(aws ec2 create-route-table \
  --vpc-id $VPC_ID \
  --tag-specifications "ResourceType=route-table,Tags=[{Key=Name,Value=$PROJECT_NAME-private-rt}]" \
  --query 'RouteTable.RouteTableId' \
  --output text)

# Add NAT gateway route
aws ec2 create-route \
  --route-table-id $PRIVATE_RT \
  --destination-cidr-block 0.0.0.0/0 \
  --nat-gateway-id $NAT_GW_ID

# Associate private subnets
aws ec2 associate-route-table --subnet-id $PRIVATE_SUBNET_1 --route-table-id $PRIVATE_RT
aws ec2 associate-route-table --subnet-id $PRIVATE_SUBNET_2 --route-table-id $PRIVATE_RT
```

## Part 3: Security Groups

```bash
# ALB Security Group
ALB_SG=$(aws ec2 create-security-group \
  --group-name "$PROJECT_NAME-alb-sg" \
  --description "Security group for ALB" \
  --vpc-id $VPC_ID \
  --query 'GroupId' \
  --output text)

# Allow HTTP and HTTPS
aws ec2 authorize-security-group-ingress --group-id $ALB_SG --protocol tcp --port 80 --cidr 0.0.0.0/0
aws ec2 authorize-security-group-ingress --group-id $ALB_SG --protocol tcp --port 443 --cidr 0.0.0.0/0

# ECS Security Group
ECS_SG=$(aws ec2 create-security-group \
  --group-name "$PROJECT_NAME-ecs-sg" \
  --description "Security group for ECS tasks" \
  --vpc-id $VPC_ID \
  --query 'GroupId' \
  --output text)

# Allow traffic from ALB
aws ec2 authorize-security-group-ingress --group-id $ECS_SG --protocol tcp --port 3001 --source-group $ALB_SG

# RDS Security Group
RDS_SG=$(aws ec2 create-security-group \
  --group-name "$PROJECT_NAME-rds-sg" \
  --description "Security group for RDS" \
  --vpc-id $VPC_ID \
  --query 'GroupId' \
  --output text)

# Allow traffic from ECS
aws ec2 authorize-security-group-ingress --group-id $RDS_SG --protocol tcp --port 5432 --source-group $ECS_SG

# Redis Security Group
REDIS_SG=$(aws ec2 create-security-group \
  --group-name "$PROJECT_NAME-redis-sg" \
  --description "Security group for Redis" \
  --vpc-id $VPC_ID \
  --query 'GroupId' \
  --output text)

# Allow traffic from ECS
aws ec2 authorize-security-group-ingress --group-id $REDIS_SG --protocol tcp --port 6379 --source-group $ECS_SG

echo "Security Groups created:"
echo "ALB SG: $ALB_SG"
echo "ECS SG: $ECS_SG"
echo "RDS SG: $RDS_SG"
echo "Redis SG: $REDIS_SG"
```

## Part 4: RDS PostgreSQL Database

```bash
# Create DB Subnet Group
aws rds create-db-subnet-group \
  --db-subnet-group-name "$PROJECT_NAME-db-subnet" \
  --db-subnet-group-description "Subnet group for RDS" \
  --subnet-ids $PRIVATE_SUBNET_1 $PRIVATE_SUBNET_2

# Generate strong password
DB_PASSWORD=$(openssl rand -base64 24 | tr -d "/@'\"")

# Create RDS Instance
aws rds create-db-instance \
  --db-instance-identifier "$PROJECT_NAME-db" \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --engine-version 14.9 \
  --master-username comptia_admin \
  --master-user-password "$DB_PASSWORD" \
  --allocated-storage 20 \
  --storage-type gp3 \
  --storage-encrypted \
  --vpc-security-group-ids $RDS_SG \
  --db-subnet-group-name "$PROJECT_NAME-db-subnet" \
  --backup-retention-period 7 \
  --preferred-backup-window "03:00-04:00" \
  --preferred-maintenance-window "mon:04:00-mon:05:00" \
  --multi-az \
  --publicly-accessible false \
  --db-name comptia_network_prod \
  --tags "Key=Name,Value=$PROJECT_NAME-db"

echo "Creating RDS instance... (this takes 10-15 minutes)"
echo "Database password: $DB_PASSWORD"
echo "SAVE THIS PASSWORD!"

# Wait for RDS to be available
aws rds wait db-instance-available --db-instance-identifier "$PROJECT_NAME-db"

# Get RDS endpoint
DB_ENDPOINT=$(aws rds describe-db-instances \
  --db-instance-identifier "$PROJECT_NAME-db" \
  --query 'DBInstances[0].Endpoint.Address' \
  --output text)

echo "Database endpoint: $DB_ENDPOINT"
echo "Connection string: postgresql://comptia_admin:$DB_PASSWORD@$DB_ENDPOINT:5432/comptia_network_prod"
```

## Part 5: ElastiCache Redis

```bash
# Create Redis Subnet Group
aws elasticache create-cache-subnet-group \
  --cache-subnet-group-name "$PROJECT_NAME-redis-subnet" \
  --cache-subnet-group-description "Subnet group for Redis" \
  --subnet-ids $PRIVATE_SUBNET_1 $PRIVATE_SUBNET_2

# Generate Redis auth token
REDIS_PASSWORD=$(openssl rand -base64 32 | tr -d "/@'\"")

# Create Redis Cluster
aws elasticache create-cache-cluster \
  --cache-cluster-id "$PROJECT_NAME-redis" \
  --engine redis \
  --engine-version 7.0 \
  --cache-node-type cache.t3.micro \
  --num-cache-nodes 1 \
  --security-group-ids $REDIS_SG \
  --cache-subnet-group-name "$PROJECT_NAME-redis-subnet" \
  --auth-token "$REDIS_PASSWORD" \
  --transit-encryption-enabled \
  --at-rest-encryption-enabled

echo "Creating Redis cluster..."
echo "Redis password: $REDIS_PASSWORD"

# Wait for Redis to be available
aws elasticache wait cache-cluster-available --cache-cluster-id "$PROJECT_NAME-redis"

# Get Redis endpoint
REDIS_ENDPOINT=$(aws elasticache describe-cache-clusters \
  --cache-cluster-id "$PROJECT_NAME-redis" \
  --show-cache-node-info \
  --query 'CacheClusters[0].CacheNodes[0].Endpoint.Address' \
  --output text)

echo "Redis endpoint: $REDIS_ENDPOINT"
```

## Part 6: ECR (Container Registry)

```bash
# Create ECR repository
aws ecr create-repository \
  --repository-name "$PROJECT_NAME-backend" \
  --image-scanning-configuration scanOnPush=true \
  --encryption-configuration encryptionType=AES256

# Get ECR URI
ECR_URI=$(aws ecr describe-repositories \
  --repository-names "$PROJECT_NAME-backend" \
  --query 'repositories[0].repositoryUri' \
  --output text)

echo "ECR Repository: $ECR_URI"

# Login to ECR
aws ecr get-login-password --region $AWS_REGION | \
  docker login --username AWS --password-stdin $ECR_URI

# Build and push Docker image
cd backend

docker build -t $PROJECT_NAME-backend .
docker tag $PROJECT_NAME-backend:latest $ECR_URI:latest
docker push $ECR_URI:latest

cd ..
```

## Part 7: ECS Fargate

### Step 1: Create ECS Cluster

```bash
# Create cluster
aws ecs create-cluster \
  --cluster-name "$PROJECT_NAME-cluster" \
  --capacity-providers FARGATE FARGATE_SPOT \
  --default-capacity-provider-strategy capacityProvider=FARGATE,weight=1
```

### Step 2: Create IAM Roles

```bash
# ECS Task Execution Role
cat > ecs-task-execution-role-trust-policy.json << EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "ecs-tasks.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF

aws iam create-role \
  --role-name "$PROJECT_NAME-ecs-execution-role" \
  --assume-role-policy-document file://ecs-task-execution-role-trust-policy.json

aws iam attach-role-policy \
  --role-name "$PROJECT_NAME-ecs-execution-role" \
  --policy-arn arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy

# ECS Task Role
aws iam create-role \
  --role-name "$PROJECT_NAME-ecs-task-role" \
  --assume-role-policy-document file://ecs-task-execution-role-trust-policy.json
```

### Step 3: Create Task Definition

```bash
# Generate secrets
JWT_SECRET=$(openssl rand -base64 32)
REFRESH_TOKEN_SECRET=$(openssl rand -base64 32)
SESSION_SECRET=$(openssl rand -base64 32)

# Create task definition
cat > task-definition.json << EOF
{
  "family": "$PROJECT_NAME-backend",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "512",
  "memory": "1024",
  "executionRoleArn": "arn:aws:iam::$AWS_ACCOUNT_ID:role/$PROJECT_NAME-ecs-execution-role",
  "taskRoleArn": "arn:aws:iam::$AWS_ACCOUNT_ID:role/$PROJECT_NAME-ecs-task-role",
  "containerDefinitions": [
    {
      "name": "backend",
      "image": "$ECR_URI:latest",
      "essential": true,
      "portMappings": [
        {
          "containerPort": 3001,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {"name": "NODE_ENV", "value": "production"},
        {"name": "PORT", "value": "3001"},
        {"name": "DB_HOST", "value": "$DB_ENDPOINT"},
        {"name": "DB_PORT", "value": "5432"},
        {"name": "DB_NAME", "value": "comptia_network_prod"},
        {"name": "DB_USER", "value": "comptia_admin"},
        {"name": "DB_PASSWORD", "value": "$DB_PASSWORD"},
        {"name": "DB_SSL", "value": "true"},
        {"name": "REDIS_HOST", "value": "$REDIS_ENDPOINT"},
        {"name": "REDIS_PORT", "value": "6379"},
        {"name": "REDIS_PASSWORD", "value": "$REDIS_PASSWORD"},
        {"name": "JWT_SECRET", "value": "$JWT_SECRET"},
        {"name": "REFRESH_TOKEN_SECRET", "value": "$REFRESH_TOKEN_SECRET"},
        {"name": "SESSION_SECRET", "value": "$SESSION_SECRET"},
        {"name": "CORS_ORIGIN", "value": "https://$DOMAIN"},
        {"name": "LOG_LEVEL", "value": "info"}
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/$PROJECT_NAME-backend",
          "awslogs-region": "$AWS_REGION",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
EOF

# Create CloudWatch log group
aws logs create-log-group --log-group-name "/ecs/$PROJECT_NAME-backend"

# Register task definition
aws ecs register-task-definition --cli-input-json file://task-definition.json
```

### Step 4: Create Application Load Balancer

```bash
# Create ALB
ALB_ARN=$(aws elbv2 create-load-balancer \
  --name "$PROJECT_NAME-alb" \
  --subnets $PUBLIC_SUBNET_1 $PUBLIC_SUBNET_2 \
  --security-groups $ALB_SG \
  --scheme internet-facing \
  --type application \
  --ip-address-type ipv4 \
  --query 'LoadBalancers[0].LoadBalancerArn' \
  --output text)

# Get ALB DNS name
ALB_DNS=$(aws elbv2 describe-load-balancers \
  --load-balancer-arns $ALB_ARN \
  --query 'LoadBalancers[0].DNSName' \
  --output text)

echo "ALB DNS: $ALB_DNS"

# Create target group
TG_ARN=$(aws elbv2 create-target-group \
  --name "$PROJECT_NAME-tg" \
  --protocol HTTP \
  --port 3001 \
  --vpc-id $VPC_ID \
  --target-type ip \
  --health-check-enabled \
  --health-check-protocol HTTP \
  --health-check-path /health \
  --health-check-interval-seconds 30 \
  --health-check-timeout-seconds 5 \
  --healthy-threshold-count 2 \
  --unhealthy-threshold-count 3 \
  --query 'TargetGroups[0].TargetGroupArn' \
  --output text)

# Create listener (HTTP for now, will add HTTPS after ACM)
aws elbv2 create-listener \
  --load-balancer-arn $ALB_ARN \
  --protocol HTTP \
  --port 80 \
  --default-actions Type=forward,TargetGroupArn=$TG_ARN
```

### Step 5: Create ECS Service

```bash
# Create service
aws ecs create-service \
  --cluster "$PROJECT_NAME-cluster" \
  --service-name "$PROJECT_NAME-backend-service" \
  --task-definition "$PROJECT_NAME-backend" \
  --desired-count 2 \
  --launch-type FARGATE \
  --platform-version LATEST \
  --network-configuration "awsvpcConfiguration={subnets=[$PRIVATE_SUBNET_1,$PRIVATE_SUBNET_2],securityGroups=[$ECS_SG],assignPublicIp=DISABLED}" \
  --load-balancers "targetGroupArn=$TG_ARN,containerName=backend,containerPort=3001" \
  --health-check-grace-period-seconds 60 \
  --deployment-configuration "minimumHealthyPercent=100,maximumPercent=200" \
  --scheduling-strategy REPLICA

echo "ECS Service created. Tasks starting..."
```

## Part 8: SSL Certificate (ACM)

```bash
# Request certificate
CERT_ARN=$(aws acm request-certificate \
  --domain-name $DOMAIN \
  --subject-alternative-names "www.$DOMAIN" "api.$DOMAIN" \
  --validation-method DNS \
  --query 'CertificateArn' \
  --output text)

echo "Certificate ARN: $CERT_ARN"

# Get validation records
aws acm describe-certificate \
  --certificate-arn $CERT_ARN \
  --query 'Certificate.DomainValidationOptions'

echo ""
echo "Add these DNS records to validate your certificate:"
echo "Then wait for validation (5-30 minutes)"

# Wait for certificate validation
aws acm wait certificate-validated --certificate-arn $CERT_ARN

# Add HTTPS listener to ALB
aws elbv2 create-listener \
  --load-balancer-arn $ALB_ARN \
  --protocol HTTPS \
  --port 443 \
  --certificates CertificateArn=$CERT_ARN \
  --default-actions Type=forward,TargetGroupArn=$TG_ARN

# Update HTTP listener to redirect to HTTPS
HTTP_LISTENER_ARN=$(aws elbv2 describe-listeners \
  --load-balancer-arn $ALB_ARN \
  --query 'Listeners[?Protocol==`HTTP`].ListenerArn' \
  --output text)

aws elbv2 modify-listener \
  --listener-arn $HTTP_LISTENER_ARN \
  --default-actions Type=redirect,RedirectConfig="{Protocol=HTTPS,Port=443,StatusCode=HTTP_301}"
```

## Part 9: S3 + CloudFront (Frontend)

### Step 1: Create S3 Bucket

```bash
# Create bucket
aws s3 mb s3://$DOMAIN

# Enable static website hosting
aws s3 website s3://$DOMAIN \
  --index-document index.html \
  --error-document index.html

# Create bucket policy
cat > bucket-policy.json << EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::$DOMAIN/*"
    }
  ]
}
EOF

aws s3api put-bucket-policy \
  --bucket $DOMAIN \
  --policy file://bucket-policy.json

# Build frontend
cd ..
npm run build

# Upload to S3
aws s3 sync dist/ s3://$DOMAIN/ --delete

echo "Frontend uploaded to S3"
```

### Step 2: Create CloudFront Distribution

```bash
# Create CloudFront distribution
cat > cloudfront-config.json << EOF
{
  "CallerReference": "$(date +%s)",
  "Comment": "$PROJECT_NAME frontend",
  "Enabled": true,
  "DefaultRootObject": "index.html",
  "Origins": {
    "Quantity": 1,
    "Items": [
      {
        "Id": "S3-$DOMAIN",
        "DomainName": "$DOMAIN.s3.amazonaws.com",
        "S3OriginConfig": {
          "OriginAccessIdentity": ""
        }
      }
    ]
  },
  "DefaultCacheBehavior": {
    "TargetOriginId": "S3-$DOMAIN",
    "ViewerProtocolPolicy": "redirect-to-https",
    "AllowedMethods": {
      "Quantity": 2,
      "Items": ["GET", "HEAD"]
    },
    "ForwardedValues": {
      "QueryString": false,
      "Cookies": {
        "Forward": "none"
      }
    },
    "Compress": true,
    "MinTTL": 0,
    "DefaultTTL": 86400,
    "MaxTTL": 31536000
  },
  "CustomErrorResponses": {
    "Quantity": 1,
    "Items": [
      {
        "ErrorCode": 404,
        "ResponsePagePath": "/index.html",
        "ResponseCode": "200",
        "ErrorCachingMinTTL": 300
      }
    ]
  },
  "ViewerCertificate": {
    "ACMCertificateArn": "$CERT_ARN",
    "SSLSupportMethod": "sni-only",
    "MinimumProtocolVersion": "TLSv1.2_2021"
  },
  "Aliases": {
    "Quantity": 2,
    "Items": ["$DOMAIN", "www.$DOMAIN"]
  }
}
EOF

# Create distribution
CF_DIST_ID=$(aws cloudfront create-distribution \
  --distribution-config file://cloudfront-config.json \
  --query 'Distribution.Id' \
  --output text)

# Get CloudFront domain
CF_DOMAIN=$(aws cloudfront get-distribution \
  --id $CF_DIST_ID \
  --query 'Distribution.DomainName' \
  --output text)

echo "CloudFront Distribution ID: $CF_DIST_ID"
echo "CloudFront Domain: $CF_DOMAIN"
```

## Part 10: Route 53 (DNS)

```bash
# Create hosted zone (if not exists)
HOSTED_ZONE_ID=$(aws route53 create-hosted-zone \
  --name $DOMAIN \
  --caller-reference $(date +%s) \
  --query 'HostedZone.Id' \
  --output text | cut -d'/' -f3)

echo "Hosted Zone ID: $HOSTED_ZONE_ID"

# Create DNS records
cat > dns-records.json << EOF
{
  "Changes": [
    {
      "Action": "UPSERT",
      "ResourceRecordSet": {
        "Name": "$DOMAIN",
        "Type": "A",
        "AliasTarget": {
          "HostedZoneId": "Z2FDTNDATAQYW2",
          "DNSName": "$CF_DOMAIN",
          "EvaluateTargetHealth": false
        }
      }
    },
    {
      "Action": "UPSERT",
      "ResourceRecordSet": {
        "Name": "www.$DOMAIN",
        "Type": "A",
        "AliasTarget": {
          "HostedZoneId": "Z2FDTNDATAQYW2",
          "DNSName": "$CF_DOMAIN",
          "EvaluateTargetHealth": false
        }
      }
    },
    {
      "Action": "UPSERT",
      "ResourceRecordSet": {
        "Name": "api.$DOMAIN",
        "Type": "A",
        "AliasTarget": {
          "HostedZoneId": "$(aws elbv2 describe-load-balancers --load-balancer-arns $ALB_ARN --query 'LoadBalancers[0].CanonicalHostedZoneId' --output text)",
          "DNSName": "$ALB_DNS",
          "EvaluateTargetHealth": true
        }
      }
    }
  ]
}
EOF

aws route53 change-resource-record-sets \
  --hosted-zone-id $HOSTED_ZONE_ID \
  --change-batch file://dns-records.json

echo "DNS records created. Propagation may take 5-60 minutes."
```

## Part 11: Run Database Migrations

```bash
# Create EC2 bastion host (temporary) to access RDS
BASTION_SG=$(aws ec2 create-security-group \
  --group-name "$PROJECT_NAME-bastion-sg" \
  --description "Bastion host for database access" \
  --vpc-id $VPC_ID \
  --query 'GroupId' \
  --output text)

# Allow SSH from your IP
MY_IP=$(curl -s ifconfig.me)
aws ec2 authorize-security-group-ingress \
  --group-id $BASTION_SG \
  --protocol tcp \
  --port 22 \
  --cidr $MY_IP/32

# Allow bastion to access RDS
aws ec2 authorize-security-group-ingress \
  --group-id $RDS_SG \
  --protocol tcp \
  --port 5432 \
  --source-group $BASTION_SG

# Launch bastion instance
BASTION_ID=$(aws ec2 run-instances \
  --image-id ami-0c55b159cbfafe1f0 \
  --instance-type t3.micro \
  --key-name YOUR_KEY_PAIR \
  --security-group-ids $BASTION_SG \
  --subnet-id $PUBLIC_SUBNET_1 \
  --query 'Instances[0].InstanceId' \
  --output text)

# Get bastion public IP
BASTION_IP=$(aws ec2 describe-instances \
  --instance-ids $BASTION_ID \
  --query 'Reservations[0].Instances[0].PublicIpAddress' \
  --output text)

# SSH tunnel to RDS
ssh -i YOUR_KEY.pem -L 5432:$DB_ENDPOINT:5432 ec2-user@$BASTION_IP

# In another terminal, run migrations
cd backend
DATABASE_URL="postgresql://comptia_admin:$DB_PASSWORD@localhost:5432/comptia_network_prod" npm run migrate

# Terminate bastion when done
aws ec2 terminate-instances --instance-ids $BASTION_ID
```

## Part 12: Monitoring and Alarms

```bash
# Create CloudWatch alarms

# High CPU alarm
aws cloudwatch put-metric-alarm \
  --alarm-name "$PROJECT_NAME-high-cpu" \
  --alarm-description "Alert when ECS CPU exceeds 80%" \
  --metric-name CPUUtilization \
  --namespace AWS/ECS \
  --statistic Average \
  --period 300 \
  --evaluation-periods 2 \
  --threshold 80 \
  --comparison-operator GreaterThanThreshold \
  --dimensions Name=ClusterName,Value=$PROJECT_NAME-cluster Name=ServiceName,Value=$PROJECT_NAME-backend-service

# High memory alarm
aws cloudwatch put-metric-alarm \
  --alarm-name "$PROJECT_NAME-high-memory" \
  --alarm-description "Alert when ECS memory exceeds 80%" \
  --metric-name MemoryUtilization \
  --namespace AWS/ECS \
  --statistic Average \
  --period 300 \
  --evaluation-periods 2 \
  --threshold 80 \
  --comparison-operator GreaterThanThreshold \
  --dimensions Name=ClusterName,Value=$PROJECT_NAME-cluster Name=ServiceName,Value=$PROJECT_NAME-backend-service

# RDS high CPU
aws cloudwatch put-metric-alarm \
  --alarm-name "$PROJECT_NAME-rds-high-cpu" \
  --alarm-description "Alert when RDS CPU exceeds 80%" \
  --metric-name CPUUtilization \
  --namespace AWS/RDS \
  --statistic Average \
  --period 300 \
  --evaluation-periods 2 \
  --threshold 80 \
  --comparison-operator GreaterThanThreshold \
  --dimensions Name=DBInstanceIdentifier,Value=$PROJECT_NAME-db
```

## Part 13: Auto Scaling

```bash
# Register ECS service as scalable target
aws application-autoscaling register-scalable-target \
  --service-namespace ecs \
  --resource-id service/$PROJECT_NAME-cluster/$PROJECT_NAME-backend-service \
  --scalable-dimension ecs:service:DesiredCount \
  --min-capacity 2 \
  --max-capacity 10

# Create scaling policy
aws application-autoscaling put-scaling-policy \
  --service-namespace ecs \
  --resource-id service/$PROJECT_NAME-cluster/$PROJECT_NAME-backend-service \
  --scalable-dimension ecs:service:DesiredCount \
  --policy-name "$PROJECT_NAME-cpu-scaling" \
  --policy-type TargetTrackingScaling \
  --target-tracking-scaling-policy-configuration '{
    "TargetValue": 75.0,
    "PredefinedMetricSpecification": {
      "PredefinedMetricType": "ECSServiceAverageCPUUtilization"
    },
    "ScaleInCooldown": 300,
    "ScaleOutCooldown": 60
  }'
```

## Cost Optimization

**Current configuration costs (approximate):**

- VPC + Networking: $0 (free)
- NAT Gateway: $32/month + data transfer
- RDS t3.micro Multi-AZ: $58/month
- ElastiCache t3.micro: $24/month
- ECS Fargate (2 tasks): $30/month
- ALB: $16/month + bandwidth
- CloudFront: $0-50/month (depends on traffic)
- S3: $1-5/month
- Route 53: $0.50/month

**Total: ~$160-200/month**

### Reduce costs:

1. **Use single AZ for RDS** (not recommended for production): Save $29/month
2. **Remove ElastiCache**: Save $24/month (use in-memory cache)
3. **Use 1 ECS task**: Save $15/month (not recommended for HA)
4. **Use t3.nano for RDS**: Save $40/month (limited performance)

## CI/CD with GitHub Actions

Create `.github/workflows/deploy-aws.yml`:

```yaml
name: Deploy to AWS

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1

      - name: Login to ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v1

      - name: Build and push Docker image
        env:
          ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
          ECR_REPOSITORY: comptia-network-backend
          IMAGE_TAG: ${{ github.sha }}
        run: |
          cd backend
          docker build -t $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG .
          docker tag $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG $ECR_REGISTRY/$ECR_REPOSITORY:latest
          docker push $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG
          docker push $ECR_REGISTRY/$ECR_REPOSITORY:latest

      - name: Update ECS service
        run: |
          aws ecs update-service \
            --cluster comptia-network-cluster \
            --service comptia-network-backend-service \
            --force-new-deployment

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Build frontend
        env:
          VITE_API_URL: https://api.yourdomain.com
        run: |
          npm install
          npm run build

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1

      - name: Deploy to S3
        run: |
          aws s3 sync dist/ s3://yourdomain.com/ --delete

      - name: Invalidate CloudFront
        run: |
          aws cloudfront create-invalidation \
            --distribution-id YOUR_DISTRIBUTION_ID \
            --paths "/*"
```

## Troubleshooting

### ECS Tasks Not Starting

Check CloudWatch logs:

```bash
aws logs tail /ecs/comptia-network-backend --follow
```

### Database Connection Failed

Verify security groups:

```bash
aws ec2 describe-security-groups --group-ids $ECS_SG $RDS_SG
```

### High Costs

Review AWS Cost Explorer:

```bash
aws ce get-cost-and-usage \
  --time-period Start=2025-10-01,End=2025-10-29 \
  --granularity MONTHLY \
  --metrics BlendedCost \
  --group-by Type=SERVICE
```

## Clean Up (Delete Everything)

```bash
# WARNING: This deletes everything!
./scripts/aws-cleanup.sh
```

---

**Deployment Status:** Production Ready ✅
**Last Updated:** 2025-10-29
