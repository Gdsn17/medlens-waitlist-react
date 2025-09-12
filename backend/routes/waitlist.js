const express = require('express');
const router = express.Router();
const WaitlistUser = require('../models/WaitlistUser');
const crypto = require('crypto');

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

    // Check if user already exists
    const existingUser = await WaitlistUser.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Generate unique referral code for new user
    let userReferralCode = generateReferralCode();
    while (await WaitlistUser.findOne({ referralCode: userReferralCode })) {
      userReferralCode = generateReferralCode();
    }

    // Check if user was referred by someone
    let referredBy = null;
    if (referralCode) {
      const referrer = await WaitlistUser.findOne({ referralCode });
      if (referrer) {
        referredBy = referrer._id;
        // Increment referrer's count
        await WaitlistUser.findByIdAndUpdate(referrer._id, {
          $inc: { referralCount: 1 }
        });
      }
    }

    // Prepare questions array
    const questions = [
      {
        questionId: 'goals',
        answer: goals || []
      },
      {
        questionId: 'studyMethods',
        answer: studyMethods || []
      },
      {
        questionId: 'struggles',
        answer: struggles || []
      }
    ];

    // Add other goals if provided
    if (otherGoals && otherGoals.trim()) {
      questions[0].answer.push(`Other: ${otherGoals.trim()}`);
    }

    // Add other struggles if provided
    if (otherStruggles && otherStruggles.trim()) {
      questions[2].answer.push(`Other: ${otherStruggles.trim()}`);
    }

    const newUser = new WaitlistUser({
      fullName,
      email,
      yearOfStudy,
      isBetaTester: isBetaTester || false,
      referralCode: userReferralCode,
      referredBy,
      questions
    });

    await newUser.save();

    res.status(201).json({
      message: 'Successfully joined waitlist!',
      referralCode: userReferralCode,
      user: {
        id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        yearOfStudy: newUser.yearOfStudy,
        isBetaTester: newUser.isBetaTester,
        referralCount: newUser.referralCount,
        questions: newUser.questions
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
    const user = await WaitlistUser.findOne({ referralCode: code });
    
    if (!user) {
      return res.status(404).json({ message: 'Invalid referral code' });
    }

    res.json({
      fullName: user.fullName,
      referralCount: user.referralCount
    });
  } catch (error) {
    console.error('Error fetching referral info:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get waitlist stats
router.get('/stats', async (req, res) => {
  try {
    const totalUsers = await WaitlistUser.countDocuments();
    const betaTesters = await WaitlistUser.countDocuments({ isBetaTester: true });
    
    res.json({
      totalUsers,
      betaTesters
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
