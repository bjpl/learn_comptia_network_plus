#!/bin/bash

# Database Restore Script
# Restores a PostgreSQL database backup

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}Database Restore Utility${NC}"

# Configuration
DB_CONTAINER="comptia-postgres"
DB_NAME="comptia_network"
DB_USER="admin"
BACKUP_DIR="./backups"

# Check if backup file is provided
if [ -z "$1" ]; then
    echo -e "${RED}Error: Please provide backup file${NC}"
    echo "Usage: $0 <backup_file>"
    echo ""
    echo "Available backups:"
    ls -lh "${BACKUP_DIR}"/*.sql.gz 2>/dev/null || echo "No backups found"
    exit 1
fi

BACKUP_FILE="$1"

# Check if backup file exists
if [ ! -f "${BACKUP_FILE}" ]; then
    echo -e "${RED}Error: Backup file not found: ${BACKUP_FILE}${NC}"
    exit 1
fi

# Check if database container is running
if ! docker ps | grep -q "${DB_CONTAINER}"; then
    echo -e "${RED}Error: Database container is not running${NC}"
    exit 1
fi

# Confirm restore
echo -e "${YELLOW}WARNING: This will overwrite the current database!${NC}"
read -p "Are you sure you want to continue? (yes/no): " CONFIRM

if [ "${CONFIRM}" != "yes" ]; then
    echo -e "${YELLOW}Restore cancelled${NC}"
    exit 0
fi

# Decompress if needed
if [[ "${BACKUP_FILE}" == *.gz ]]; then
    echo -e "${YELLOW}Decompressing backup...${NC}"
    gunzip -k "${BACKUP_FILE}"
    BACKUP_FILE="${BACKUP_FILE%.gz}"
fi

# Drop existing database and recreate
echo -e "${YELLOW}Dropping existing database...${NC}"
docker-compose exec -T postgres psql -U "${DB_USER}" -c "DROP DATABASE IF EXISTS ${DB_NAME};"
docker-compose exec -T postgres psql -U "${DB_USER}" -c "CREATE DATABASE ${DB_NAME};"

# Restore backup
echo -e "${YELLOW}Restoring backup...${NC}"
cat "${BACKUP_FILE}" | docker-compose exec -T postgres psql -U "${DB_USER}" "${DB_NAME}"

# Cleanup temporary file
if [[ "${BACKUP_FILE}" != "$1" ]]; then
    rm "${BACKUP_FILE}"
fi

echo -e "${GREEN}Database restored successfully!${NC}"
