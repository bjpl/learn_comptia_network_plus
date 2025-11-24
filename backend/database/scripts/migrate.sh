#!/bin/bash
# =============================================================================
# Database Migration Script
# =============================================================================
# Description: Run database migrations in order
# Usage: ./migrate.sh [up|down|reset]
# =============================================================================

set -e

# Configuration
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"
DB_NAME="${DB_NAME:-network_plus_learning}"
DB_USER="${DB_USER:-postgres}"
DB_PASSWORD="${DB_PASSWORD:-postgres}"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MIGRATIONS_DIR="$SCRIPT_DIR/../migrations"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Execute SQL file
execute_sql() {
    local sql_file=$1
    log_info "Executing: $(basename $sql_file)"
    PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f "$sql_file"
}

# Create database if it doesn't exist
create_database() {
    log_info "Checking if database exists..."
    PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d postgres -tc "SELECT 1 FROM pg_database WHERE datname = '$DB_NAME'" | grep -q 1 || {
        log_info "Creating database: $DB_NAME"
        PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d postgres -c "CREATE DATABASE $DB_NAME"
    }
}

# Run migrations
migrate_up() {
    log_info "Starting database migration..."
    create_database

    # Run migrations in order
    for migration in $(ls $MIGRATIONS_DIR/*.sql | sort); do
        execute_sql "$migration"
    done

    log_info "Migration completed successfully!"
}

# Rollback migrations
migrate_down() {
    log_warn "Rolling back migrations..."
    log_warn "Note: Manual rollback required. Check migration files for DOWN sections."

    # Run rollback commands from migration files (commented sections)
    # This would need to be extracted and run in reverse order

    log_warn "To fully rollback, run the DOWN sections from each migration in reverse order."
}

# Reset database
migrate_reset() {
    log_warn "Resetting database..."
    read -p "This will drop and recreate the database. Continue? (yes/no): " confirm

    if [ "$confirm" = "yes" ]; then
        log_info "Dropping database: $DB_NAME"
        PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d postgres -c "DROP DATABASE IF EXISTS $DB_NAME"

        migrate_up
        log_info "Database reset complete!"
    else
        log_info "Reset cancelled."
    fi
}

# Main execution
case "${1:-up}" in
    up)
        migrate_up
        ;;
    down)
        migrate_down
        ;;
    reset)
        migrate_reset
        ;;
    *)
        log_error "Unknown command: $1"
        echo "Usage: $0 [up|down|reset]"
        exit 1
        ;;
esac
