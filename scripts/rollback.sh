#!/bin/bash
# Rollback script for CompTIA Network+ Learning Platform
# This script reverts to a previous working state

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
BACKUP_DIR="./backups"
DEPLOYMENT_METHOD=""

print_header() {
    echo -e "\n${BLUE}========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}========================================${NC}\n"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

# Detect deployment method
detect_deployment_method() {
    if [ -f "docker-compose.prod.yml" ] && command -v docker &> /dev/null; then
        DEPLOYMENT_METHOD="docker"
        print_info "Detected Docker deployment"
    elif command -v pm2 &> /dev/null; then
        DEPLOYMENT_METHOD="pm2"
        print_info "Detected PM2 deployment"
    else
        print_error "Cannot detect deployment method"
        exit 1
    fi
}

# Git rollback
rollback_git() {
    local commit_hash=$1

    print_header "Rolling Back Git Repository"

    if [ -z "$commit_hash" ]; then
        # Show recent commits
        echo "Recent commits:"
        git log --oneline -10
        echo ""
        read -p "Enter commit hash to rollback to: " commit_hash
    fi

    if [ -z "$commit_hash" ]; then
        print_error "No commit hash provided"
        exit 1
    fi

    print_info "Rolling back to commit: $commit_hash"

    # Verify commit exists
    if ! git cat-file -e $commit_hash 2>/dev/null; then
        print_error "Commit $commit_hash not found"
        exit 1
    fi

    # Create backup branch
    BACKUP_BRANCH="backup-$(date +%Y%m%d-%H%M%S)"
    git branch $BACKUP_BRANCH
    print_info "Created backup branch: $BACKUP_BRANCH"

    # Rollback
    git reset --hard $commit_hash
    print_success "Git rollback completed"
}

# Docker rollback
rollback_docker() {
    print_header "Rolling Back Docker Deployment"

    # List recent images
    echo "Recent backend images:"
    docker images | grep comptia-network-backend | head -5
    echo ""

    read -p "Enter image tag to rollback to (or press Enter for previous): " image_tag

    if [ -z "$image_tag" ]; then
        # Use previous image
        image_tag="previous"
    fi

    print_info "Rolling back to image: $image_tag"

    # Stop current containers
    print_info "Stopping current containers..."
    docker compose -f docker-compose.prod.yml down

    # Update compose file to use specific tag
    if [ "$image_tag" != "latest" ] && [ "$image_tag" != "previous" ]; then
        sed -i.bak "s/:latest/:$image_tag/g" docker-compose.prod.yml
    fi

    # Start containers with old image
    print_info "Starting containers with previous image..."
    docker compose -f docker-compose.prod.yml up -d

    # Restore original compose file if modified
    if [ -f "docker-compose.prod.yml.bak" ]; then
        mv docker-compose.prod.yml.bak docker-compose.prod.yml.backup
    fi

    print_success "Docker rollback completed"
}

# PM2 rollback
rollback_pm2() {
    print_header "Rolling Back PM2 Deployment"

    # Stop current process
    print_info "Stopping current application..."
    pm2 stop comptia-backend || true

    # Rebuild from current code
    print_info "Rebuilding backend..."
    cd backend
    npm run build
    cd ..

    print_info "Rebuilding frontend..."
    npm run build

    # Deploy
    print_info "Deploying rolled back version..."
    sudo rm -rf /var/www/comptia-network/*
    sudo cp -r dist/* /var/www/comptia-network/
    sudo chown -R www-data:www-data /var/www/comptia-network

    # Restart backend
    pm2 restart comptia-backend

    # Reload nginx
    sudo nginx -t && sudo systemctl reload nginx

    print_success "PM2 rollback completed"
}

# Database rollback
rollback_database() {
    local backup_file=$1

    print_header "Rolling Back Database"

    if [ ! -d "$BACKUP_DIR/database" ]; then
        print_error "Backup directory not found: $BACKUP_DIR/database"
        return 1
    fi

    # List available backups
    echo "Available database backups:"
    ls -lh "$BACKUP_DIR/database/" | grep -E '\.(dump|sql|gz)$' | tail -10
    echo ""

    if [ -z "$backup_file" ]; then
        read -p "Enter backup filename to restore: " backup_file
    fi

    if [ -z "$backup_file" ]; then
        print_warning "No backup file provided. Skipping database rollback."
        return 0
    fi

    BACKUP_PATH="$BACKUP_DIR/database/$backup_file"

    if [ ! -f "$BACKUP_PATH" ]; then
        print_error "Backup file not found: $BACKUP_PATH"
        return 1
    fi

    print_warning "This will replace the current database!"
    read -p "Are you sure you want to continue? (yes/no): " confirm

    if [ "$confirm" != "yes" ]; then
        print_info "Database rollback cancelled"
        return 0
    fi

    # Create backup of current database before restoring
    print_info "Creating backup of current database..."
    SAFETY_BACKUP="$BACKUP_DIR/database/pre-rollback-$(date +%Y%m%d-%H%M%S).dump"

    if [ "$DEPLOYMENT_METHOD" = "docker" ]; then
        docker compose -f docker-compose.prod.yml exec -T postgres pg_dump \
            -U comptia_admin -d comptia_network_prod -F c > "$SAFETY_BACKUP"
    else
        pg_dump -U comptia_admin -d comptia_network_prod -F c > "$SAFETY_BACKUP"
    fi

    print_success "Safety backup created: $SAFETY_BACKUP"

    # Restore database
    print_info "Restoring database from: $backup_file"

    if [[ "$backup_file" == *.gz ]]; then
        # Decompress and restore
        gunzip -c "$BACKUP_PATH" > /tmp/restore.dump
        BACKUP_PATH="/tmp/restore.dump"
    fi

    if [ "$DEPLOYMENT_METHOD" = "docker" ]; then
        cat "$BACKUP_PATH" | docker compose -f docker-compose.prod.yml exec -T postgres \
            pg_restore -U comptia_admin -d comptia_network_prod --clean --if-exists
    else
        pg_restore -U comptia_admin -d comptia_network_prod --clean --if-exists "$BACKUP_PATH"
    fi

    # Cleanup
    if [ -f "/tmp/restore.dump" ]; then
        rm /tmp/restore.dump
    fi

    print_success "Database restored"
}

# Verify rollback
verify_rollback() {
    print_header "Verifying Rollback"

    # Wait for services to start
    print_info "Waiting for services to start..."
    sleep 10

    # Check backend health
    print_info "Checking backend health..."
    BACKEND_HEALTH=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/health || echo "000")

    if [ "$BACKEND_HEALTH" = "200" ]; then
        print_success "Backend is healthy"
    else
        print_error "Backend health check failed (HTTP $BACKEND_HEALTH)"
        return 1
    fi

    # Check frontend
    print_info "Checking frontend..."
    FRONTEND_HEALTH=$(curl -s -o /dev/null -w "%{http_code}" http://localhost/ || echo "000")

    if [ "$FRONTEND_HEALTH" = "200" ] || [ "$FRONTEND_HEALTH" = "301" ]; then
        print_success "Frontend is healthy"
    else
        print_error "Frontend health check failed (HTTP $FRONTEND_HEALTH)"
        return 1
    fi

    print_success "Rollback verification completed"
    return 0
}

# Show usage
usage() {
    echo "Usage: $0 [options]"
    echo ""
    echo "Options:"
    echo "  -c COMMIT_HASH    Git commit to rollback to"
    echo "  -d BACKUP_FILE    Database backup file to restore"
    echo "  -s                Skip database rollback"
    echo "  -h                Show this help message"
    echo ""
    echo "Example:"
    echo "  $0 -c abc123 -d backup-2025-10-29.dump"
    echo "  $0 -c HEAD~1 -s"
    exit 1
}

# Main script
main() {
    local commit_hash=""
    local db_backup=""
    local skip_db=false

    # Parse arguments
    while getopts "c:d:sh" opt; do
        case $opt in
            c) commit_hash="$OPTARG" ;;
            d) db_backup="$OPTARG" ;;
            s) skip_db=true ;;
            h) usage ;;
            *) usage ;;
        esac
    done

    # Banner
    print_header "CompTIA Network+ Rollback Script"
    print_warning "This will rollback your deployment to a previous state"
    echo ""

    # Detect deployment method
    detect_deployment_method

    # Confirmation
    read -p "Are you sure you want to proceed with rollback? (yes/no): " confirm
    if [ "$confirm" != "yes" ]; then
        print_info "Rollback cancelled"
        exit 0
    fi

    # Git rollback
    rollback_git "$commit_hash"

    # Application rollback
    if [ "$DEPLOYMENT_METHOD" = "docker" ]; then
        rollback_docker
    elif [ "$DEPLOYMENT_METHOD" = "pm2" ]; then
        rollback_pm2
    fi

    # Database rollback (optional)
    if [ "$skip_db" = false ]; then
        rollback_database "$db_backup"
    else
        print_info "Skipping database rollback as requested"
    fi

    # Verify
    if verify_rollback; then
        print_header "Rollback Summary"
        print_success "Rollback completed successfully!"
        echo ""
        print_info "Deployment reverted to:"
        echo "  Git commit: $(git rev-parse --short HEAD)"
        echo "  Timestamp: $(date '+%Y-%m-%d %H:%M:%S')"
        echo ""
        print_info "Next steps:"
        echo "  1. Verify application functionality"
        echo "  2. Check logs for any errors"
        echo "  3. Monitor application performance"
        echo "  4. Document the rollback reason"
        exit 0
    else
        print_error "Rollback completed but verification failed"
        print_info "Please check the application manually"
        exit 1
    fi
}

# Run main function
main "$@"
