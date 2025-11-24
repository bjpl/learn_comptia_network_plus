#!/bin/bash

echo "==================================="
echo "Production Secrets Generator"
echo "==================================="
echo ""
echo "⚠️  CRITICAL: Save these secrets securely!"
echo "⚠️  Never commit these to version control!"
echo "⚠️  Each environment needs unique secrets!"
echo ""

# Function to generate secret
generate_secret() {
    openssl rand -base64 32 | tr -d "=+/" | cut -c1-32
}

# Function to generate hex
generate_hex() {
    openssl rand -hex 32
}

# Function to generate UUID
generate_uuid() {
    if command -v uuidgen &> /dev/null; then
        uuidgen
    else
        cat /proc/sys/kernel/random/uuid
    fi
}

echo "🔐 JWT Secrets"
echo "=============="
JWT_SECRET=$(generate_secret)
REFRESH_TOKEN_SECRET=$(generate_secret)
echo "JWT_SECRET=$JWT_SECRET"
echo "REFRESH_TOKEN_SECRET=$REFRESH_TOKEN_SECRET"
echo ""

echo "🗄️  Database Credentials"
echo "======================="
DB_PASSWORD=$(generate_secret)
DB_USER="comptia_admin_$(openssl rand -hex 4)"
DB_NAME="comptia_network_$(openssl rand -hex 4)"
echo "DB_USER=$DB_USER"
echo "DB_PASSWORD=$DB_PASSWORD"
echo "DB_NAME=$DB_NAME"
echo ""

echo "🍪 Session & Cookie Secrets"
echo "==========================="
SESSION_SECRET=$(generate_hex)
COOKIE_SECRET=$(generate_secret)
echo "SESSION_SECRET=$SESSION_SECRET"
echo "COOKIE_SECRET=$COOKIE_SECRET"
echo ""

echo "🔑 Encryption Keys"
echo "================="
ENCRYPTION_KEY=$(generate_hex)
echo "ENCRYPTION_KEY=$ENCRYPTION_KEY"
echo ""

echo "📧 Email Service (if using)"
echo "=========================="
echo "SENDGRID_API_KEY=<get-from-sendgrid>"
echo "SMTP_PASSWORD=<get-from-provider>"
echo ""

echo "☁️  Cloud Service Keys (if using)"
echo "================================"
echo "AWS_ACCESS_KEY_ID=<get-from-aws>"
echo "AWS_SECRET_ACCESS_KEY=<get-from-aws>"
S3_BUCKET="comptia-network-$(openssl rand -hex 4)"
echo "S3_BUCKET_NAME=$S3_BUCKET"
echo ""

echo "🎲 API Keys & Tokens"
echo "==================="
API_KEY=$(generate_secret)
ADMIN_API_KEY=$(generate_secret)
echo "API_KEY=$API_KEY"
echo "ADMIN_API_KEY=$ADMIN_API_KEY"
echo ""

echo "🛡️  Security Tokens"
echo "=================="
CSRF_SECRET=$(generate_hex)
echo "CSRF_SECRET=$CSRF_SECRET"
echo ""

echo "📊 Analytics (if using)"
echo "======================"
echo "GOOGLE_ANALYTICS_ID=<optional>"
echo "SENTRY_DSN=<optional>"
echo ""

echo "🔄 Redis Credentials"
echo "===================="
REDIS_PASSWORD=$(generate_secret)
echo "REDIS_PASSWORD=$REDIS_PASSWORD"
echo ""

echo "==================================="
echo "✅ Secrets Generated Successfully"
echo "==================================="
echo ""
echo "📝 Next Steps:"
echo "1. Copy these secrets to a secure password manager"
echo "2. Update .env.production with these values"
echo "3. Set secrets in your hosting platform (Vercel, Railway, etc.)"
echo "4. Set GitHub Secrets for CI/CD"
echo "5. NEVER commit .env.production to git"
echo ""
echo "⚠️  IMPORTANT: Run this script again for each environment:"
echo "   - Development (already has default values)"
echo "   - Staging (needs unique secrets)"
echo "   - Production (needs unique secrets)"
echo ""
echo "💾 Save Output:"
echo "   ./generate-secrets.sh > secrets-$(date +%Y%m%d).txt"
echo "   Then securely delete after saving to password manager:"
echo "   shred -vfz -n 10 secrets-$(date +%Y%m%d).txt"
echo ""
