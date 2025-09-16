#!/bin/bash

# MedLens Waitlist Free Tier Deployment Script
echo "🚀 Deploying MedLens Waitlist using FREE tier only..."

# Check if we're in the right project
echo "📋 Current Firebase project:"
firebase use

# Navigate to frontend directory
cd frontend

# Create production environment file with Firebase credentials
echo "📝 Creating production environment file..."
cat > .env.production << 'EOF'
# Production Environment Variables for Free Tier
REACT_APP_FIREBASE_PROJECT_ID=medlensai-waitlist
REACT_APP_FIREBASE_API_KEY=YOUR_API_KEY_HERE
REACT_APP_FIREBASE_AUTH_DOMAIN=medlensai-waitlist.firebaseapp.com
REACT_APP_FIREBASE_STORAGE_BUCKET=medlensai-waitlist.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=YOUR_SENDER_ID_HERE
REACT_APP_FIREBASE_APP_ID=YOUR_APP_ID_HERE
REACT_APP_FIREBASE_MEASUREMENT_ID=YOUR_MEASUREMENT_ID_HERE
EOF

echo "⚠️  IMPORTANT: Update Firebase credentials in frontend/.env.production before deploying!"

# Build the React app
echo "📦 Building React app..."
npm run build

# Check if build was successful
if [ ! -d "build" ]; then
    echo "❌ Build failed! Please check the errors above."
    exit 1
fi

# Go back to root
cd ..

# Deploy to Firebase Hosting
echo "☁️ Deploying to Firebase Hosting (FREE TIER)..."
firebase deploy --only hosting

echo ""
echo "✅ Frontend deployed successfully!"
echo "🌐 Your app is now live at: https://medlensai-waitlist.web.app"
echo ""
echo "📝 Next steps:"
echo "   1. Get Firebase credentials from: https://console.firebase.google.com/project/medlensai-waitlist/settings/general"
echo "   2. Update frontend/.env.production with real credentials"
echo "   3. Run: ./deploy-free.sh (again) to redeploy with credentials"
echo ""
echo "🎉 Your MedLens Waitlist is live using FREE tier only!"
echo "   - Frontend: Firebase Hosting (FREE)"
echo "   - Database: Firestore (FREE tier)"
echo "   - No backend needed - direct Firestore integration!"
