#!/bin/bash
# =============================================================================
# Database Backup Script
# =============================================================================
# Description: Create database backups
# Usage: ./backup.sh [full|schema|data]
# =============================================================================

set -e

# Configuration
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"
DB_NAME="${DB_NAME:-network_plus_learning}"
DB_USER="${DB_USER:-postgres}"
DB_PASSWORD="${DB_PASSWORD:-postgres}"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKUP_DIR="${BACKUP_DIR:-$SCRIPT_DIR/../backups}"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Colors
GREEN='\033[0;32m'
NC='\033[0m'

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

# Full backup
backup_full() {
    local backup_file="$BACKUP_DIR/${DB_NAME}_full_${TIMESTAMP}.sql"
    log_info "Creating full backup: $(basename $backup_file)"
    PGPASSWORD=$DB_PASSWORD pg_dump -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -F p -f "$backup_file"
    gzip "$backup_file"
    log_info "Backup completed: ${backup_file}.gz"
}

# Schema only backup
backup_schema() {
    local backup_file="$BACKUP_DIR/${DB_NAME}_schema_${TIMESTAMP}.sql"
    log_info "Creating schema backup: $(basename $backup_file)"
    PGPASSWORD=$DB_PASSWORD pg_dump -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -s -F p -f "$backup_file"
    log_info "Backup completed: $backup_file"
}

# Data only backup
backup_data() {
    local backup_file="$BACKUP_DIR/${DB_NAME}_data_${TIMESTAMP}.sql"
    log_info "Creating data backup: $(basename $backup_file)"
    PGPASSWORD=$DB_PASSWORD pg_dump -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -a -F p -f "$backup_file"
    gzip "$backup_file"
    log_info "Backup completed: ${backup_file}.gz"
}

# Clean old backups (keep last 7 days)
cleanup_old_backups() {
    log_info "Cleaning up old backups (keeping last 7 days)..."
    find "$BACKUP_DIR" -name "*.sql.gz" -mtime +7 -delete
    find "$BACKUP_DIR" -name "*.sql" -mtime +7 -delete
}

# Main execution
case "${1:-full}" in
    full)
        backup_full
        ;;
    schema)
        backup_schema
        ;;
    data)
        backup_data
        ;;
    cleanup)
        cleanup_old_backups
        ;;
    *)
        echo "Usage: $0 [full|schema|data|cleanup]"
        exit 1
        ;;
esac

cleanup_old_backups
