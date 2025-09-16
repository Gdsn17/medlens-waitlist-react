const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')({origin: true});

// Initialize Firebase Admin
admin.initializeApp();

const db = admin.firestore();

// Health check function
exports.health = functions.https.onRequest((req, res) => {
  return cors(req, res, () => {
    res.json({
      status: 'OK',
      message: 'MedLens Waitlist API is running',
      projectId: 'medlensai-waitlist',
      timestamp: new Date().toISOString()
    });
  });
});

// Save waitlist form function
exports.saveWaitlist = functions.https.onRequest((req, res) => {
  return cors(req, res, async () => {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
      console.log('🔥 Saving to Firestore via Firebase Functions...');
      console.log('Data:', req.body);

      const waitlistData = {
        fullName: req.body.fullName,
        email: req.body.email,
        yearOfStudy: req.body.yearOfStudy,
        isBetaTester: req.body.isBetaTester || false,
        referralCode: req.body.referralCode || '',
        goals: req.body.goals || [],
        studyMethods: req.body.studyMethods || [],
        struggles: req.body.struggles || [],
        otherGoals: req.body.otherGoals || '',
        otherStruggles: req.body.otherStruggles || '',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        timestamp: new Date().toISOString()
      };

      // Save to Firestore
      const docRef = await db.collection('waitlistUsers').add(waitlistData);
      console.log('✅ Saved to Firestore with ID:', docRef.id);

      res.json({
        success: true,
        message: 'Successfully joined the waitlist!',
        data: {
          id: docRef.id,
          ...waitlistData
        }
      });

    } catch (error) {
      console.error('❌ Error saving to Firestore:', error);
      res.status(500).json({
        success: false,
        message: `Failed to save: ${error.message}`,
        error: error.message
      });
    }
  });
});

// Get all users function
exports.getUsers = functions.https.onRequest((req, res) => {
  return cors(req, res, async () => {
    try {
      const snapshot = await db.collection('waitlistUsers').get();
      const users = [];
      snapshot.forEach(doc => {
        users.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      res.json({
        success: true,
        count: users.length,
        users: users
      });
    } catch (error) {
      console.error('❌ Error fetching users:', error);
      res.status(500).json({
        success: false,
        message: `Failed to fetch users: ${error.message}`,
        error: error.message
      });
    }
  });
});