#!/bin/bash
# =============================================================================
# Database Seed Script
# =============================================================================
# Description: Populate database with seed data
# Usage: ./seed.sh
# =============================================================================

set -e

# Configuration
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"
DB_NAME="${DB_NAME:-network_plus_learning}"
DB_USER="${DB_USER:-postgres}"
DB_PASSWORD="${DB_PASSWORD:-postgres}"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SEEDS_DIR="$SCRIPT_DIR/../seeds"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

execute_sql() {
    local sql_file=$1
    log_info "Executing: $(basename $sql_file)"
    PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f "$sql_file"
}

log_info "Starting database seeding..."

# Run seed files in order
for seed in $(ls $SEEDS_DIR/*.sql | sort); do
    execute_sql "$seed"
done

log_info "Database seeding completed successfully!"
log_info ""
log_info "Demo accounts created:"
log_info "  Admin:      admin@network.test / password123"
log_info "  Instructor: instructor@network.test / password123"
log_info "  Student 1:  student1@network.test / password123"
log_info "  Student 2:  student2@network.test / password123"
log_info "  Student 3:  student3@network.test / password123"
