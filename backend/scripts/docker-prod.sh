#!/bin/bash

# Docker Production Build Script
# Builds optimized production images

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}Building CompTIA Network+ Production Images${NC}"

# Get version from package.json
VERSION=$(node -p "require('./package.json').version")
IMAGE_NAME="comptia-backend"

echo -e "${YELLOW}Building version: ${VERSION}${NC}"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}Error: Docker is not running${NC}"
    exit 1
fi

# Build the image
echo -e "${GREEN}Building Docker image...${NC}"
docker build \
    --tag "${IMAGE_NAME}:${VERSION}" \
    --tag "${IMAGE_NAME}:latest" \
    --build-arg BUILD_DATE=$(date -u +'%Y-%m-%dT%H:%M:%SZ') \
    --build-arg VERSION="${VERSION}" \
    .

# Show image info
echo -e "${GREEN}Image built successfully!${NC}"
docker images "${IMAGE_NAME}"

# Security scan
echo -e "${YELLOW}Running security scan...${NC}"
if command -v trivy &> /dev/null; then
    trivy image --severity HIGH,CRITICAL "${IMAGE_NAME}:${VERSION}"
else
    echo -e "${YELLOW}Trivy not installed. Skipping security scan.${NC}"
    echo -e "${YELLOW}Install with: brew install aquasecurity/trivy/trivy${NC}"
fi

# Test the image
echo -e "${YELLOW}Testing the image...${NC}"
docker run --rm \
    -e NODE_ENV=production \
    -e DATABASE_URL=postgresql://admin:test@localhost:5432/comptia_network \
    -e JWT_SECRET=test_secret \
    "${IMAGE_NAME}:${VERSION}" \
    node -e "console.log('Image test successful!')"

echo ""
echo -e "${GREEN}Production image ready!${NC}"
echo "  Image: ${IMAGE_NAME}:${VERSION}"
echo "  Size: $(docker images ${IMAGE_NAME}:${VERSION} --format '{{.Size}}')"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "  1. Push to registry: docker push ${IMAGE_NAME}:${VERSION}"
echo "  2. Deploy to production"
echo "  3. Run smoke tests"
