#!/bin/bash

# MedLens Waitlist Backend Deployment Script
echo "🚀 Deploying MedLens Waitlist Backend to Cloud Run..."

# Navigate to backend directory
cd backend

# Build the Docker image
echo "📦 Building Docker image..."
docker build -t medlens-api .

# Deploy to Cloud Run
echo "☁️ Deploying to Cloud Run..."
gcloud run deploy medlens-api \
  --source . \
  --region asia-south1 \
  --allow-unauthenticated \
  --port 8080 \
  --memory 512Mi \
  --cpu 1 \
  --max-instances 10 \
  --timeout 300

# Get the service URL
echo "🔗 Getting service URL..."
SERVICE_URL=$(gcloud run services describe medlens-api --region=asia-south1 --format='value(status.url)')

echo "✅ Backend deployed successfully!"
echo "🌐 Service URL: $SERVICE_URL"
echo ""
echo "📝 Update your frontend configuration with this URL:"
echo "   REACT_APP_API_URL=$SERVICE_URL"
echo ""
echo "🧪 Test the deployment:"
echo "   curl $SERVICE_URL/api/health"
