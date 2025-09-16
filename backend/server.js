const express = require('express');
const cors = require('cors');
const { initializeApp, getApps, deleteApp } = require('firebase/app');
const { getFirestore, collection, addDoc, serverTimestamp, getDocs } = require('firebase/firestore');

// Clear any existing Firebase apps
getApps().forEach(app => {
  try {
    deleteApp(app);
  } catch (error) {
    console.log('App already deleted or error:', error.message);
  }
});

// Firebase configuration for medlensai-waitlist
const firebaseConfig = {
  projectId: 'medlensai-waitlist',
  apiKey: 'AIzaSyBhJW9vCrWkbRjNJGqiQrK8BRA5iP3S45E',
  authDomain: 'medlensai-waitlist.firebaseapp.com',
  storageBucket: 'medlensai-waitlist.firebasestorage.app',
  messagingSenderId: '44671607185',
  appId: '1:44671607185:web:865af97328f2fd0acbfa30',
  measurementId: 'G-XL82SECBJQ'
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig, 'medlens-waitlist-main');
const db = getFirestore(firebaseApp);

// Debug: Log Firebase configuration
console.log('🔥 Firebase Configuration:');
console.log(`   Project ID: ${firebaseConfig.projectId}`);
console.log(`   Auth Domain: ${firebaseConfig.authDomain}`);
console.log(`   Storage Bucket: ${firebaseConfig.storageBucket}`);

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:5173',
    'https://medlensai-waitlist.web.app',
    'https://medlensai-waitlist.firebaseapp.com',
    'https://medlens-api-*.a.run.app'
  ],
  credentials: true
}));
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'MedLens Waitlist API is running',
    projectId: firebaseConfig.projectId,
    timestamp: new Date().toISOString()
  });
});

// Save waitlist form to Firestore
app.post('/api/waitlist/save', async (req, res) => {
  try {
    console.log('🔥 Saving to Firestore...');
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
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      timestamp: new Date().toISOString()
    };

    // Try to save to Firestore
    let docRef;
    try {
      docRef = await addDoc(collection(db, 'waitlistUsers'), waitlistData);
      console.log('✅ Saved to Firestore with ID:', docRef.id);
    } catch (firestoreError) {
      console.log('⚠️ Firestore failed, saving to backup...');
      
      // Fallback: Save to local file
      const fs = require('fs');
      const path = require('path');
      
      const backupData = {
        ...waitlistData,
        error: 'Firestore failed, saved locally',
        firestoreError: firestoreError.message
      };
      
      const backupFile = path.join(__dirname, 'backup-signups.json');
      let existingData = [];
      
      if (fs.existsSync(backupFile)) {
        existingData = JSON.parse(fs.readFileSync(backupFile, 'utf8'));
      }
      
      existingData.push(backupData);
      fs.writeFileSync(backupFile, JSON.stringify(existingData, null, 2));
      
      console.log('💾 Saved to backup file as fallback');
      
      res.json({
        success: true,
        message: 'Successfully joined the waitlist! (Saved locally due to Firestore issues)',
        data: {
          id: 'backup-' + Date.now(),
          ...backupData
        }
      });
      return;
    }
    
    res.json({
      success: true,
      message: 'Successfully joined the waitlist!',
      data: {
        id: docRef.id,
        ...waitlistData
      }
    });

  } catch (error) {
    console.error('❌ Error saving:', error);
    res.status(500).json({
      success: false,
      message: `Failed to save: ${error.message}`,
      error: error.message
    });
  }
});

// Get all users (for debugging)
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

// Start server
app.listen(PORT, () => {
  console.log(`🚀 MedLens Waitlist API running on port ${PORT}`);
  console.log(`🔥 Connected to Firebase: ${firebaseConfig.projectId}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`💾 Save endpoint: http://localhost:${PORT}/api/waitlist/save`);
  console.log(`👥 Users endpoint: http://localhost:${PORT}/api/waitlist/users`);
});
