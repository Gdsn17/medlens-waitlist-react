const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: "trans-falcon-472008-c2",
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  }),
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
  res.json({ status: 'OK', message: 'MedLens Backend is running!' });
});

// Waitlist routes
app.post('/api/waitlist/join', async (req, res) => {
  try {
    const { fullName, email, yearOfStudy, goals, studyMethods, struggles, otherGoals, otherStruggles, isBetaTester, referralCode } = req.body;

    // Validate required fields
    if (!fullName || !email || !yearOfStudy) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if user already exists
    const existingUserQuery = await db.collection('waitlistUsers').where('email', '==', email).get();
    if (!existingUserQuery.empty) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Generate referral code if not provided
    const userReferralCode = referralCode || generateReferralCode();

    // Prepare questions array
    const questions = [
      {
        questionId: 'goals',
        answer: otherGoals ? [...goals, otherGoals] : goals
      },
      {
        questionId: 'studyMethods', 
        answer: studyMethods
      },
      {
        questionId: 'struggles',
        answer: otherStruggles ? [...struggles, otherStruggles] : struggles
      }
    ];

    // Create user document
    const userData = {
      fullName,
      email,
      yearOfStudy,
      questions,
      isBetaTester: isBetaTester || false,
      referralCode: userReferralCode,
      joinedAt: admin.firestore.FieldValue.serverTimestamp(),
      referredBy: referralCode ? await findReferrerByCode(referralCode) : null
    };

    // Add user to Firestore
    const docRef = await db.collection('waitlistUsers').add(userData);

    // Update referrer's referral count if applicable
    if (referralCode) {
      await updateReferralCount(referralCode);
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

app.listen(PORT, () => {
  console.log(`🚀 MedLens Backend running on port ${PORT}`);
  console.log(`📊 Using Firebase Firestore as database`);
});
