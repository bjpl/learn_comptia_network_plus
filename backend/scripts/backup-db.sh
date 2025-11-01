#!/bin/bash

# Database Backup Script
# Creates a backup of the PostgreSQL database

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}Database Backup Utility${NC}"

# Configuration
DB_CONTAINER="comptia-postgres"
DB_NAME="comptia_network"
DB_USER="admin"
BACKUP_DIR="./backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="${BACKUP_DIR}/comptia_network_${TIMESTAMP}.sql"

# Create backup directory if it doesn't exist
mkdir -p "${BACKUP_DIR}"

# Check if database container is running
if ! docker ps | grep -q "${DB_CONTAINER}"; then
    echo -e "${RED}Error: Database container is not running${NC}"
    exit 1
fi

# Create backup
echo -e "${YELLOW}Creating backup: ${BACKUP_FILE}${NC}"
docker-compose exec -T postgres pg_dump -U "${DB_USER}" "${DB_NAME}" > "${BACKUP_FILE}"

# Compress backup
echo -e "${YELLOW}Compressing backup...${NC}"
gzip "${BACKUP_FILE}"

# Show backup info
BACKUP_SIZE=$(du -h "${BACKUP_FILE}.gz" | cut -f1)
echo -e "${GREEN}Backup created successfully!${NC}"
echo "  File: ${BACKUP_FILE}.gz"
echo "  Size: ${BACKUP_SIZE}"

# Cleanup old backups (keep last 7 days)
echo -e "${YELLOW}Cleaning up old backups...${NC}"
find "${BACKUP_DIR}" -name "comptia_network_*.sql.gz" -mtime +7 -delete

echo -e "${GREEN}Backup complete!${NC}"
