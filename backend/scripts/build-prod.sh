#!/bin/bash

# Build Production Docker Images
# CompTIA Network+ Learning Platform

set -e

echo "Building production Docker images..."

# Load environment variables
if [ -f .env.production ]; then
    export $(cat .env.production | grep -v '^#' | xargs)
fi

# Build images
echo "Building backend image..."
docker-compose -f docker-compose.prod.yml build --no-cache

# Tag images with version
VERSION=$(node -p "require('./package.json').version")
echo "Tagging images with version: $VERSION"

docker tag comptia-backend:latest comptia-backend:$VERSION

# Test the build
echo "Testing the production build..."
docker-compose -f docker-compose.prod.yml run --rm backend npm run test

echo "Production images built successfully!"
echo "Backend image: comptia-backend:latest, comptia-backend:$VERSION"

# Optionally push to registry
read -p "Push images to registry? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    REGISTRY=${DOCKER_REGISTRY:-"your-registry.com"}

    docker tag comptia-backend:latest $REGISTRY/comptia-backend:latest
    docker tag comptia-backend:$VERSION $REGISTRY/comptia-backend:$VERSION

    docker push $REGISTRY/comptia-backend:latest
    docker push $REGISTRY/comptia-backend:$VERSION

    echo "Images pushed to registry: $REGISTRY"
fi
