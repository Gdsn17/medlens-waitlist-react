#!/bin/bash

# MedLens Waitlist Frontend Deployment Script
echo "🚀 Deploying MedLens Waitlist Frontend to Firebase Hosting..."

# Check if API URL is provided
if [ -z "$1" ]; then
    echo "❌ Error: Please provide the backend API URL"
    echo "Usage: ./deploy-frontend.sh <API_URL>"
    echo "Example: ./deploy-frontend.sh https://medlens-api-xxxxx.a.run.app"
    exit 1
fi

API_URL=$1

# Navigate to frontend directory
cd frontend

# Create production environment file
echo "📝 Creating production environment file..."
cat > .env.production << EOF
REACT_APP_API_URL=$API_URL
REACT_APP_FIREBASE_PROJECT_ID=medlensai-waitlist
REACT_APP_FIREBASE_API_KEY=YOUR_API_KEY_HERE
REACT_APP_FIREBASE_AUTH_DOMAIN=medlensai-waitlist.firebaseapp.com
REACT_APP_FIREBASE_STORAGE_BUCKET=medlensai-waitlist.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=YOUR_SENDER_ID_HERE
REACT_APP_FIREBASE_APP_ID=YOUR_APP_ID_HERE
REACT_APP_FIREBASE_MEASUREMENT_ID=YOUR_MEASUREMENT_ID_HERE
EOF

# Build the React app
echo "📦 Building React app..."
npm run build

# Check if build was successful
if [ ! -d "build" ]; then
    echo "❌ Build failed! Please check the errors above."
    exit 1
fi

# Deploy to Firebase Hosting
echo "☁️ Deploying to Firebase Hosting..."
cd ..
firebase deploy --only hosting

echo "✅ Frontend deployed successfully!"
echo "🌐 Your app is now live at: https://medlensai-waitlist.web.app"
echo ""
echo "📝 Don't forget to:"
echo "   1. Update Firebase credentials in .env.production"
echo "   2. Redeploy if you change credentials"
