#!/bin/bash

# =============================================================================
# Production Secrets Generator
# =============================================================================
# This script generates strong, random secrets for your production environment
# WARNING: Keep these secrets safe! Never commit them to version control.
# =============================================================================

set -e  # Exit on error

echo "🔐 Production Secrets Generator"
echo "================================"
echo ""
echo "⚠️  IMPORTANT:"
echo "   - Save these secrets in a secure password manager"
echo "   - Do NOT commit these to git"
echo "   - Each environment should have unique secrets"
echo ""
read -p "Press Enter to generate secrets..."
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if openssl is available
if ! command -v openssl &> /dev/null; then
    echo -e "${RED}❌ Error: openssl is not installed${NC}"
    echo "Install it with: sudo apt-get install openssl"
    exit 1
fi

echo "🔑 Generating secrets..."
echo ""

# Generate secrets
JWT_SECRET=$(openssl rand -base64 32)
REFRESH_TOKEN_SECRET=$(openssl rand -base64 32)
SESSION_SECRET=$(openssl rand -base64 32)

# Ensure they're different
while [ "$JWT_SECRET" = "$REFRESH_TOKEN_SECRET" ]; do
    REFRESH_TOKEN_SECRET=$(openssl rand -base64 32)
done

while [ "$SESSION_SECRET" = "$JWT_SECRET" ] || [ "$SESSION_SECRET" = "$REFRESH_TOKEN_SECRET" ]; do
    SESSION_SECRET=$(openssl rand -base64 32)
done

# Display secrets
echo -e "${GREEN}✅ Secrets Generated Successfully!${NC}"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${YELLOW}COPY THESE VALUES - You'll need them in your hosting platform:${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "JWT_SECRET=$JWT_SECRET"
echo ""
echo "REFRESH_TOKEN_SECRET=$REFRESH_TOKEN_SECRET"
echo ""
echo "SESSION_SECRET=$SESSION_SECRET"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Optionally save to a file (MAKE SURE IT'S GITIGNORED!)
echo "💾 Save to file?"
echo ""
echo "Options:"
echo "  1) Save to .secrets.txt (for copying to hosting platform)"
echo "  2) Create .env.production template (for VPS/Docker deployment)"
echo "  3) Skip (just display above)"
echo ""
read -p "Choose (1/2/3): " choice

case $choice in
    1)
        OUTPUT_FILE="../.secrets.txt"
        cat > "$OUTPUT_FILE" << EOF
# =============================================================================
# PRODUCTION SECRETS - GENERATED $(date)
# =============================================================================
# ⚠️  CRITICAL: Delete this file after copying to your hosting platform!
# =============================================================================

JWT_SECRET=$JWT_SECRET
REFRESH_TOKEN_SECRET=$REFRESH_TOKEN_SECRET
SESSION_SECRET=$SESSION_SECRET

# =============================================================================
# NEXT STEPS:
# =============================================================================
# 1. Copy these secrets to your hosting platform (Vercel/Railway/AWS)
# 2. Add these additional variables:
#    - NODE_ENV=production
#    - DB_PASSWORD=[your database password]
#    - CORS_ORIGIN=https://your-domain.com
# 3. DELETE THIS FILE: rm backend/.secrets.txt
# 4. Deploy your application
# =============================================================================
EOF
        echo ""
        echo -e "${GREEN}✅ Secrets saved to: $OUTPUT_FILE${NC}"
        echo -e "${RED}⚠️  Remember to DELETE this file after use!${NC}"
        echo "   Command: rm $OUTPUT_FILE"
        ;;
    
    2)
        OUTPUT_FILE=".env.production"
        cat > "$OUTPUT_FILE" << EOF
# =============================================================================
# PRODUCTION ENVIRONMENT VARIABLES - GENERATED $(date)
# =============================================================================
# ⚠️  CRITICAL: This file should ONLY exist on your production server!
# =============================================================================

NODE_ENV=production
PORT=3001

# =============================================================================
# DATABASE (CONFIGURE THESE!)
# =============================================================================
DB_HOST=your-database-host.com
DB_PORT=5432
DB_NAME=comptia_network_prod
DB_USER=your_db_user
DB_PASSWORD=YOUR_STRONG_DB_PASSWORD_HERE

# =============================================================================
# JWT SECRETS (GENERATED)
# =============================================================================
JWT_SECRET=$JWT_SECRET
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_SECRET=$REFRESH_TOKEN_SECRET
REFRESH_TOKEN_EXPIRES_IN=7d

# =============================================================================
# SESSION (GENERATED)
# =============================================================================
SESSION_SECRET=$SESSION_SECRET

# =============================================================================
# CORS (CONFIGURE THIS!)
# =============================================================================
CORS_ORIGIN=https://your-production-domain.com

# =============================================================================
# LOGGING
# =============================================================================
LOG_LEVEL=info
LOG_DIR=/var/log/comptia-network

# =============================================================================
# NEXT STEPS:
# =============================================================================
# 1. Replace DB_HOST, DB_NAME, DB_USER, DB_PASSWORD with actual values
# 2. Replace CORS_ORIGIN with your production frontend URL
# 3. Secure this file: chmod 600 .env.production
# 4. NEVER commit this file to git!
# =============================================================================
EOF
        echo ""
        echo -e "${GREEN}✅ .env.production created with generated secrets${NC}"
        echo ""
        echo "Next steps:"
        echo "1. Edit .env.production and update DB_* variables"
        echo "2. Update CORS_ORIGIN with your domain"
        echo "3. Secure the file: chmod 600 .env.production"
        echo "4. Test: NODE_ENV=production node dist/server.js"
        ;;
    
    *)
        echo ""
        echo -e "${YELLOW}Secrets displayed above - copy them manually${NC}"
        ;;
esac

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}✅ Setup Complete!${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📖 Full documentation: docs/PRODUCTION_SECRETS_SETUP_GUIDE.md"
echo "🔒 Security audit: docs/SECURITY_AUDIT_REPORT.md"
echo ""
