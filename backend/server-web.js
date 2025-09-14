const express = require('express');
const cors = require('cors');
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, getDocs, query, where, orderBy, limit } = require('firebase/firestore');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5002;

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCp10zixMF7zt-ibp9R4UD-rItUGaOCVTg",
  authDomain: "trans-falcon-472008-c2.firebaseapp.com",
  projectId: "trans-falcon-472008-c2",
  storageBucket: "trans-falcon-472008-c2.appspot.com",
  messagingSenderId: "739773511999",
  appId: "1:739773511999:web:7772079039aeb5cfaebb8a",
  measurementId: "G-YB353X3Y16"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

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
  res.json({ status: 'OK', message: 'MedLens Backend is running with Firebase Web SDK!' });
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
    const existingUserQuery = query(collection(db, 'waitlistUsers'), where('email', '==', email));
    const existingUserSnapshot = await getDocs(existingUserQuery);
    
    if (!existingUserSnapshot.empty) {
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
      joinedAt: new Date().toISOString(),
      referredBy: referredByCode ? await findReferrerByCode(referredByCode) : null
    };

    // Add user to Firestore
    const docRef = await addDoc(collection(db, 'waitlistUsers'), userData);

    // Update referrer's referral count if applicable
    if (referredByCode) {
      await updateReferralCount(referredByCode);
    }

    res.status(201).json({
      message: 'Successfully joined the waitlist!',
      user: {
        id: docRef.id,
        ...userData
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
    const snapshot = await getDocs(collection(db, 'waitlistUsers'));
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

// Get all waitlist users (for validation)
app.get('/api/waitlist/users', async (req, res) => {
  try {
    const snapshot = await getDocs(collection(db, 'waitlistUsers'));
    const users = [];
    
    snapshot.forEach(doc => {
      users.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    res.json({
      users,
      total: users.length,
      message: 'Users retrieved successfully'
    });
  } catch (error) {
    console.error('Error getting users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Helper functions
function generateReferralCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

async function findReferrerByCode(referralCode) {
  try {
    const querySnapshot = query(collection(db, 'waitlistUsers'), where('referralCode', '==', referralCode));
    const snapshot = await getDocs(querySnapshot);
    
    if (!snapshot.empty) {
      return snapshot.docs[0].id;
    }
    return null;
  } catch (error) {
    console.error('Error finding referrer:', error);
    return null;
  }
}

async function updateReferralCount(referralCode) {
  try {
    const querySnapshot = query(collection(db, 'waitlistUsers'), where('referralCode', '==', referralCode));
    const snapshot = await getDocs(querySnapshot);
    
    if (!snapshot.empty) {
      // Note: For increment operations, you'd need to use Firebase Admin SDK
      // For now, we'll just log the referral
      console.log(`Referral code ${referralCode} was used`);
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
