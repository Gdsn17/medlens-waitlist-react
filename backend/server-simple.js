const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// In-memory storage for demo purposes
let waitlistUsers = [];
let userCounter = 0;

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3003', 
    'http://localhost:5173',
    'https://medlens-waitlist.vercel.app',
    'https://medlens-waitlist-git-main-gdsn17.vercel.app'
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
    const existingUser = waitlistUsers.find(user => user.email === email);
    if (existingUser) {
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

    // Create user object
    const userData = {
      id: ++userCounter,
      fullName,
      email,
      yearOfStudy,
      questions,
      isBetaTester: isBetaTester || false,
      referralCode: userReferralCode,
      joinedAt: new Date().toISOString(),
      referredBy: referralCode ? findReferrerByCode(referralCode) : null
    };

    // Add user to array
    waitlistUsers.push(userData);

    // Update referrer's referral count if applicable
    if (referralCode) {
      updateReferralCount(referralCode);
    }

    res.status(201).json({
      message: 'Successfully joined the waitlist!',
      user: userData
    });

  } catch (error) {
    console.error('Error joining waitlist:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get waitlist stats
app.get('/api/waitlist/stats', async (req, res) => {
  try {
    const totalUsers = waitlistUsers.length;
    const betaTesters = waitlistUsers.filter(user => user.isBetaTester).length;
    
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

function findReferrerByCode(referralCode) {
  const referrer = waitlistUsers.find(user => user.referralCode === referralCode);
  return referrer ? referrer.id : null;
}

function updateReferralCount(referralCode) {
  const referrer = waitlistUsers.find(user => user.referralCode === referralCode);
  if (referrer) {
    referrer.referralCount = (referrer.referralCount || 0) + 1;
  }
}

app.listen(PORT, () => {
  console.log(`🚀 MedLens Backend running on port ${PORT}`);
  console.log(`📊 Using in-memory storage for demo`);
});
