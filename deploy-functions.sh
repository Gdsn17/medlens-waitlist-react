#!/bin/bash

# MedLens Waitlist Firebase Functions Deployment Script
echo "🚀 Deploying MedLens Waitlist to Firebase Functions..."

# Navigate to functions directory
cd functions

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Go back to root
cd ..

# Deploy functions
echo "☁️ Deploying Firebase Functions..."
firebase deploy --only functions

# Get function URLs
echo "🔗 Getting function URLs..."
HEALTH_URL=$(firebase functions:config:get --project=medlensai-waitlist 2>/dev/null || echo "https://us-central1-medlensai-waitlist.cloudfunctions.net/health")
SAVE_URL=$(firebase functions:config:get --project=medlensai-waitlist 2>/dev/null || echo "https://us-central1-medlensai-waitlist.cloudfunctions.net/saveWaitlist")
USERS_URL=$(firebase functions:config:get --project=medlensai-waitlist 2>/dev/null || echo "https://us-central1-medlensai-waitlist.cloudfunctions.net/getUsers")

echo "✅ Firebase Functions deployed successfully!"
echo ""
echo "🌐 Function URLs:"
echo "   Health Check: https://us-central1-medlensai-waitlist.cloudfunctions.net/health"
echo "   Save Waitlist: https://us-central1-medlensai-waitlist.cloudfunctions.net/saveWaitlist"
echo "   Get Users: https://us-central1-medlensai-waitlist.cloudfunctions.net/getUsers"
echo ""
echo "📝 Update your frontend configuration with this URL:"
echo "   REACT_APP_API_URL=https://us-central1-medlensai-waitlist.cloudfunctions.net"
echo ""
echo "🧪 Test the deployment:"
echo "   curl https://us-central1-medlensai-waitlist.cloudfunctions.net/health"
