const express = require('express');
const router = express.Router();
const { getFirestore, collection, addDoc, getDocs, query, where, doc, updateDoc, increment } = require('firebase/firestore');
const crypto = require('crypto');

// Initialize Firestore (this will be passed from server-web.js)
let db;

// Generate unique referral code
const generateReferralCode = () => {
  return crypto.randomBytes(4).toString('hex').toUpperCase();
};

// Join waitlist
router.post('/join', async (req, res) => {
  try {
    const { 
      fullName, 
      email, 
      yearOfStudy, 
      isBetaTester, 
      referralCode, 
      goals, 
      studyMethods, 
      struggles, 
      otherGoals, 
      otherStruggles 
    } = req.body;

    // Validate required fields
    if (!fullName || !email || !yearOfStudy) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check if user already exists
    const existingUserQuery = query(collection(db, 'waitlistUsers'), where('email', '==', email));
    const existingUserSnapshot = await getDocs(existingUserQuery);
    
    if (!existingUserSnapshot.empty) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Generate unique referral code for new user
    let userReferralCode = generateReferralCode();
    let isCodeUnique = false;
    while (!isCodeUnique) {
      const codeQuery = query(collection(db, 'waitlistUsers'), where('referralCode', '==', userReferralCode));
      const codeSnapshot = await getDocs(codeQuery);
      if (codeSnapshot.empty) {
        isCodeUnique = true;
      } else {
        userReferralCode = generateReferralCode();
      }
    }

    // Check if user was referred by someone
    let referredBy = null;
    if (referralCode) {
      const referrerQuery = query(collection(db, 'waitlistUsers'), where('referralCode', '==', referralCode));
      const referrerSnapshot = await getDocs(referrerQuery);
      
      if (!referrerSnapshot.empty) {
        const referrerDoc = referrerSnapshot.docs[0];
        referredBy = referrerDoc.id;
        
        // Increment referrer's count
        await updateDoc(doc(db, 'waitlistUsers', referrerDoc.id), {
          referralCount: increment(1)
        });
      }
    }

    // Prepare questions array
    const questions = [];
    if (goals && goals.length > 0) {
      let finalGoals = [...goals];
      if (goals.includes('Other') && otherGoals) {
        finalGoals = finalGoals.filter(g => g !== 'Other');
        finalGoals.push(`Other: ${otherGoals.trim()}`);
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
        finalStruggles.push(`Other: ${otherStruggles.trim()}`);
      }
      questions.push({ questionId: 'struggles', answer: finalStruggles });
    }

    // Create user object
    const userData = {
      fullName,
      email,
      yearOfStudy,
      isBetaTester: isBetaTester || false,
      referralCode: userReferralCode,
      referredBy,
      referralCount: 0,
      questions,
      joinedAt: new Date().toISOString()
    };

    // Add user to Firestore
    const docRef = await addDoc(collection(db, 'waitlistUsers'), userData);

    res.status(201).json({
      message: 'Successfully joined waitlist!',
      referralCode: userReferralCode,
      user: {
        id: docRef.id,
        ...userData
      }
    });
  } catch (error) {
    console.error('Error joining waitlist:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user by referral code
router.get('/referral/:code', async (req, res) => {
  try {
    const { code } = req.params;
    const userQuery = query(collection(db, 'waitlistUsers'), where('referralCode', '==', code));
    const userSnapshot = await getDocs(userQuery);
    
    if (userSnapshot.empty) {
      return res.status(404).json({ message: 'Invalid referral code' });
    }

    const userDoc = userSnapshot.docs[0];
    const userData = userDoc.data();

    res.json({
      fullName: userData.fullName,
      referralCount: userData.referralCount
    });
  } catch (error) {
    console.error('Error fetching referral info:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get waitlist stats
router.get('/stats', async (req, res) => {
  try {
    const snapshot = await getDocs(collection(db, 'waitlistUsers'));
    const totalUsers = snapshot.size;
    
    const betaTesters = snapshot.docs.filter(doc => doc.data().isBetaTester).length;
    
    res.json({
      totalUsers,
      betaTesters
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all users (for debugging)
router.get('/users', async (req, res) => {
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
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Function to set the database instance
const setDatabase = (database) => {
  db = database;
};

module.exports = { router, setDatabase };
