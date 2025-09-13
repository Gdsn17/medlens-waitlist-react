#!/bin/bash

# Configuration
PROJECT_ID="your-gcp-project-id"  # Replace with your actual project ID
REGION="us-central1"
REPOSITORY="medlens-waitlist"
GITHUB_SHA=${GITHUB_SHA:-$(git rev-parse HEAD)}

echo "Building and pushing Docker images..."

# Authenticate with Google Cloud
gcloud auth configure-docker ${REGION}-docker.pkg.dev

# Build and push Frontend
echo "Building frontend image..."
cd frontend
docker build -t ${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPOSITORY}/frontend:${GITHUB_SHA} .
docker tag ${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPOSITORY}/frontend:${GITHUB_SHA} ${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPOSITORY}/frontend:latest

echo "Pushing frontend image..."
docker push ${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPOSITORY}/frontend:${GITHUB_SHA}
docker push ${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPOSITORY}/frontend:latest

# Build and push Backend
echo "Building backend image..."
cd ../backend
docker build -t ${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPOSITORY}/backend:${GITHUB_SHA} .
docker tag ${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPOSITORY}/backend:${GITHUB_SHA} ${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPOSITORY}/backend:latest

echo "Pushing backend image..."
docker push ${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPOSITORY}/backend:${GITHUB_SHA}
docker push ${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPOSITORY}/backend:latest

echo "Images pushed successfully!"
echo "Frontend: ${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPOSITORY}/frontend:${GITHUB_SHA}"
echo "Backend: ${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPOSITORY}/backend:${GITHUB_SHA}"
