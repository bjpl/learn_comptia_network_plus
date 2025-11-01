#!/bin/bash

echo "🔄 Secret Rotation Script"
echo "========================"
echo ""
echo "This script helps rotate secrets safely"
echo ""
echo "⚠️  WARNING: Secret rotation requires careful planning!"
echo "⚠️  Always rotate secrets one at a time"
echo "⚠️  Follow the zero-downtime rotation procedure"
echo ""

# Function to generate secret
generate_secret() {
    openssl rand -base64 32 | tr -d "=+/" | cut -c1-32
}

# Function to generate hex
generate_hex() {
    openssl rand -hex 32
}

echo "Which secret do you want to rotate?"
echo "1) JWT_SECRET"
echo "2) REFRESH_TOKEN_SECRET"
echo "3) DATABASE_PASSWORD"
echo "4) SESSION_SECRET"
echo "5) ENCRYPTION_KEY"
echo "6) API_KEY"
echo "7) REDIS_PASSWORD"
echo "8) All secrets (advanced)"
read -p "Choice (1-8): " choice

echo ""

case $choice in
    1)
        echo "🔐 Rotating JWT_SECRET"
        echo "====================="
        NEW_SECRET=$(generate_secret)
        echo ""
        echo "New JWT_SECRET: $NEW_SECRET"
        echo ""
        echo "📋 Zero-Downtime Rotation Procedure:"
        echo "1. Add new secret as JWT_SECRET_NEW to environment"
        echo "2. Update code to accept both old and new secrets"
        echo "3. Deploy and verify both secrets work"
        echo "4. Wait 24 hours for old tokens to expire"
        echo "5. Remove old secret, rename JWT_SECRET_NEW to JWT_SECRET"
        echo "6. Deploy final version"
        echo ""
        ;;

    2)
        echo "🔄 Rotating REFRESH_TOKEN_SECRET"
        echo "================================"
        NEW_SECRET=$(generate_secret)
        echo ""
        echo "New REFRESH_TOKEN_SECRET: $NEW_SECRET"
        echo ""
        echo "📋 Zero-Downtime Rotation Procedure:"
        echo "1. Add new secret as REFRESH_TOKEN_SECRET_NEW"
        echo "2. Update code to accept both secrets"
        echo "3. Deploy and verify"
        echo "4. Wait 7 days for old refresh tokens to expire"
        echo "5. Remove old secret, rename new to REFRESH_TOKEN_SECRET"
        echo "6. Deploy final version"
        echo ""
        ;;

    3)
        echo "🗄️  Rotating DATABASE_PASSWORD"
        echo "=============================="
        NEW_PASSWORD=$(generate_secret)
        echo ""
        echo "New DB_PASSWORD: $NEW_PASSWORD"
        echo ""
        echo "📋 Database Password Rotation Procedure:"
        echo "1. Create new database user with new password"
        echo "2. Grant same permissions as old user"
        echo "3. Update DATABASE_URL with new credentials"
        echo "4. Deploy and verify connection works"
        echo "5. Monitor for 24 hours"
        echo "6. Revoke old user's permissions"
        echo "7. Delete old user after 7 days"
        echo ""
        ;;

    4)
        echo "🍪 Rotating SESSION_SECRET"
        echo "========================="
        NEW_SECRET=$(generate_hex)
        echo ""
        echo "New SESSION_SECRET: $NEW_SECRET"
        echo ""
        echo "📋 Session Secret Rotation Procedure:"
        echo "1. Update SESSION_SECRET in environment"
        echo "2. Deploy new version"
        echo "3. All active sessions will be invalidated"
        echo "4. Users will need to log in again"
        echo ""
        echo "⚠️  NOTE: This will force all users to re-login!"
        echo ""
        ;;

    5)
        echo "🔑 Rotating ENCRYPTION_KEY"
        echo "========================="
        NEW_KEY=$(generate_hex)
        echo ""
        echo "New ENCRYPTION_KEY: $NEW_KEY"
        echo ""
        echo "📋 Encryption Key Rotation Procedure:"
        echo "1. ⚠️  CRITICAL: This requires data re-encryption!"
        echo "2. Create migration script to re-encrypt data"
        echo "3. Add new key as ENCRYPTION_KEY_NEW"
        echo "4. Run migration to re-encrypt with new key"
        echo "5. Verify all data accessible"
        echo "6. Remove old key, rename new to ENCRYPTION_KEY"
        echo ""
        echo "⚠️  WARNING: Test thoroughly in staging first!"
        echo ""
        ;;

    6)
        echo "🎲 Rotating API_KEY"
        echo "=================="
        NEW_API_KEY=$(generate_secret)
        echo ""
        echo "New API_KEY: $NEW_API_KEY"
        echo ""
        echo "📋 API Key Rotation Procedure:"
        echo "1. Notify API consumers of upcoming key change"
        echo "2. Add new key to environment"
        echo "3. Update code to accept both old and new keys"
        echo "4. Deploy and verify both keys work"
        echo "5. Provide new key to API consumers"
        echo "6. Wait for migration period (e.g., 30 days)"
        echo "7. Remove old key support"
        echo ""
        ;;

    7)
        echo "🔄 Rotating REDIS_PASSWORD"
        echo "========================="
        NEW_PASSWORD=$(generate_secret)
        echo ""
        echo "New REDIS_PASSWORD: $NEW_PASSWORD"
        echo ""
        echo "📋 Redis Password Rotation Procedure:"
        echo "1. Set new password in Redis: CONFIG SET requirepass '$NEW_PASSWORD'"
        echo "2. Update REDIS_PASSWORD in environment"
        echo "3. Deploy new version"
        echo "4. Verify Redis connection works"
        echo "5. Monitor for connection errors"
        echo ""
        ;;

    8)
        echo "🔐 Rotating ALL Secrets"
        echo "======================"
        echo ""
        echo "⚠️  WARNING: This is a major operation!"
        echo "⚠️  Only do this during planned maintenance"
        echo "⚠️  Follow documented procedures for each secret"
        echo ""
        read -p "Are you sure you want to continue? (yes/no): " confirm

        if [ "$confirm" == "yes" ]; then
            echo ""
            echo "Generating all new secrets..."
            echo ""

            echo "JWT_SECRET=$(generate_secret)"
            echo "REFRESH_TOKEN_SECRET=$(generate_secret)"
            echo "DB_PASSWORD=$(generate_secret)"
            echo "SESSION_SECRET=$(generate_hex)"
            echo "COOKIE_SECRET=$(generate_secret)"
            echo "ENCRYPTION_KEY=$(generate_hex)"
            echo "API_KEY=$(generate_secret)"
            echo "ADMIN_API_KEY=$(generate_secret)"
            echo "CSRF_SECRET=$(generate_hex)"
            echo "REDIS_PASSWORD=$(generate_secret)"
            echo ""
            echo "📋 Full Rotation Checklist:"
            echo "□ Schedule maintenance window"
            echo "□ Notify all users of downtime"
            echo "□ Create database backup"
            echo "□ Test rotation in staging first"
            echo "□ Prepare rollback plan"
            echo "□ Update all secrets in hosting platform"
            echo "□ Update GitHub Secrets"
            echo "□ Deploy new version"
            echo "□ Verify all services functional"
            echo "□ Monitor for 24 hours"
            echo "□ Document rotation date"
            echo ""
        else
            echo "Rotation cancelled."
        fi
        ;;

    *)
        echo "Invalid choice. Exiting."
        exit 1
        ;;
esac

echo "========================"
echo "✅ Secret Generated"
echo "========================"
echo ""
echo "📝 Next Steps:"
echo "1. Copy the new secret to your password manager"
echo "2. Follow the rotation procedure above"
echo "3. Test in staging environment first"
echo "4. Document the rotation in your change log"
echo "5. Update monitoring alerts if needed"
echo ""
echo "⚠️  Remember: Never rotate secrets in production without testing in staging first!"
echo ""
