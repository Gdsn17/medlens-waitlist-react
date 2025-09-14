const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: process.env.FIREBASE_DATABASE_URL || `https://medlens-waitlist-app-default-rtdb.asia-southeast1.firebasedatabase.app`
});

const db = admin.database();

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3003', 
    'http://localhost:5173',
    'https://medlens-waitlist-app.web.app',
    'https://medlens-waitlist-app.firebaseapp.com'
  ],
  credentials: true
}));
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'MedLens Backend is running!' });
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
    const existingUserSnapshot = await db.ref('waitlistUsers').orderByChild('email').equalTo(email).once('value');
    if (existingUserSnapshot.exists()) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Generate referral code if not provided
    const userReferralCode = referralCode || generateReferralCode();

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
      joinedAt: admin.database.ServerValue.TIMESTAMP,
      referredBy: referredByCode ? await findReferrerByCode(referredByCode) : null
    };

    // Add user to Realtime Database
    const newUserRef = await db.ref('waitlistUsers').push(userData);

    // Update referrer's referral count if applicable
    if (referredByCode) {
      await updateReferralCount(referredByCode);
    }

    res.status(201).json({
      message: 'Successfully joined the waitlist!',
      user: {
        id: newUserRef.key,
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
    const snapshot = await db.ref('waitlistUsers').once('value');
    const users = snapshot.val() || {};
    const totalUsers = Object.keys(users).length;
    
    const betaTesters = Object.values(users).filter(user => user.isBetaTester).length;
    
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
    const snapshot = await db.ref('waitlistUsers').orderByChild('referralCode').equalTo(referralCode).once('value');
    if (snapshot.exists()) {
      const userData = snapshot.val();
      return Object.keys(userData)[0]; // Return the first matching user's key
    }
    return null;
  } catch (error) {
    console.error('Error finding referrer:', error);
    return null;
  }
}

async function updateReferralCount(referralCode) {
  try {
    const snapshot = await db.ref('waitlistUsers').orderByChild('referralCode').equalTo(referralCode).once('value');
    if (snapshot.exists()) {
      const userData = snapshot.val();
      const userId = Object.keys(userData)[0];
      await db.ref(`waitlistUsers/${userId}/referralCount`).set(admin.database.ServerValue.increment(1));
    }
  } catch (error) {
    console.error('Error updating referral count:', error);
  }
}

// Start server
app.listen(PORT, () => {
  console.log(`MedLens Backend Server running on port ${PORT}`);
  console.log(`Database URL: ${process.env.FIREBASE_DATABASE_URL || 'https://medlens-waitlist-app-default-rtdb.asia-southeast1.firebasedatabase.app'}`);
});
