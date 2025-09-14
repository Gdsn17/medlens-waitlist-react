const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;

// Initialize Firebase Admin with your credentials
const serviceAccount = {
  type: "service_account",
  project_id: "trans-falcon-472008-c2",
  private_key_id: "your-private-key-id",
  private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n') || "your-private-key",
  client_email: process.env.FIREBASE_CLIENT_EMAIL || "firebase-adminsdk-xxxxx@trans-falcon-472008-c2.iam.gserviceaccount.com",
  client_id: "your-client-id",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xxxxx%40trans-falcon-472008-c2.iam.gserviceaccount.com"
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: "trans-falcon-472008-c2"
});

const db = admin.firestore();

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3003', 
    'http://localhost:5173',
    'https://trans-falcon-472008-c2.web.app',
    'https://trans-falcon-472008-c2.firebaseapp.com'
  ],
  credentials: true
}));
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'MedLens Backend is running with Firebase Firestore!' });
});

// Waitlist Join Route
app.post('/api/waitlist/join', async (req, res) => {
  const {
    fullName,
    email,
    yearOfStudy,
    goals,
    studyMethods,
    struggles,
    otherGoals,
    otherStruggles,
    isBetaTester,
    referredByCode
  } = req.body;

  // Validate required fields
  if (!fullName || !email || !yearOfStudy) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Check if user already exists
    const existingUserQuery = await db.collection('waitlistUsers').where('email', '==', email).get();
    if (!existingUserQuery.empty) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Generate referral code if not provided
    const userReferralCode = referredByCode || generateReferralCode();

    // Prepare questions array
    const questions = [];
    if (goals && goals.length > 0) {
      let finalGoals = [...goals];
      if (goals.includes('Other') && otherGoals) {
        finalGoals = finalGoals.filter(g => g !== 'Other');
        finalGoals.push(otherGoals);
      }
      questions.push({ questionId: 'goals', answer: finalGoals });
    }
    if (studyMethods && studyMethods.length > 0) {
      questions.push({ questionId: 'studyMethods', answer: studyMethods });
    }
    if (struggles && struggles.length > 0) {
      let finalStruggles = [...struggles];
      if (struggles.includes('Other') && otherStruggles) {
        finalStruggles = finalStruggles.filter(s => s !== 'Other');
        finalStruggles.push(otherStruggles);
      }
      questions.push({ questionId: 'struggles', answer: finalStruggles });
    }

    // Create user object
    const userData = {
      fullName,
      email,
      yearOfStudy,
      questions,
      isBetaTester: isBetaTester || false,
      referralCode: userReferralCode,
      joinedAt: admin.firestore.FieldValue.serverTimestamp(),
      referredBy: referredByCode ? await findReferrerByCode(referredByCode) : null
    };

    // Add user to Firestore
    const docRef = await db.collection('waitlistUsers').add(userData);

    // Update referrer's referral count if applicable
    if (referredByCode) {
      await updateReferralCount(referredByCode);
    }

    res.status(201).json({
      message: 'Successfully joined the waitlist!',
      user: {
        id: docRef.id,
        ...userData,
        joinedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error joining waitlist:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get waitlist stats
app.get('/api/waitlist/stats', async (req, res) => {
  try {
    const snapshot = await db.collection('waitlistUsers').get();
    const totalUsers = snapshot.size;
    
    const betaTesters = snapshot.docs.filter(doc => doc.data().isBetaTester).length;
    
    res.json({
      totalUsers,
      betaTesters,
      message: 'Stats retrieved successfully'
    });
  } catch (error) {
    console.error('Error getting stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Helper functions
function generateReferralCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

async function findReferrerByCode(referralCode) {
  try {
    const querySnapshot = await db.collection('waitlistUsers')
      .where('referralCode', '==', referralCode)
      .get();
    
    if (!querySnapshot.empty) {
      return querySnapshot.docs[0].id;
    }
    return null;
  } catch (error) {
    console.error('Error finding referrer:', error);
    return null;
  }
}

async function updateReferralCount(referralCode) {
  try {
    const querySnapshot = await db.collection('waitlistUsers')
      .where('referralCode', '==', referralCode)
      .get();
    
    if (!querySnapshot.empty) {
      const referrerDoc = querySnapshot.docs[0];
      await referrerDoc.ref.update({
        referralCount: admin.firestore.FieldValue.increment(1)
      });
    }
  } catch (error) {
    console.error('Error updating referral count:', error);
  }
}

// Start server
app.listen(PORT, () => {
  console.log(`MedLens Backend Server running on port ${PORT}`);
  console.log(`Connected to Firebase Firestore: trans-falcon-472008-c2`);
});
