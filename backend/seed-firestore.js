const { initializeApp, getApps, deleteApp } = require('firebase/app');
const { getFirestore, collection, addDoc, serverTimestamp } = require('firebase/firestore');

// Clear any existing Firebase apps to avoid conflicts
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
const firebaseApp = initializeApp(firebaseConfig, 'medlens-seed-script');
const db = getFirestore(firebaseApp);

/**
 * Seeds the waitlist collection with initial test data
 * @returns {Promise<{success: boolean, message: string, data?: any}>}
 */
async function seedWaitlistData() {
  try {
    console.log('🌱 Starting to seed waitlist data...');
    console.log('📊 Project ID:', firebaseConfig.projectId);
    
    // Sample waitlist users with realistic data
    const sampleUsers = [
      {
        email: 'sarah.johnson@university.edu',
        fullName: 'Sarah Johnson',
        yearOfStudy: '2nd Year',
        referralCode: 'MED2024',
        betaTester: true,
        joinedAt: serverTimestamp(),
        questions: {
          goals: 'Improve my medical knowledge retention and ace my upcoming pathology exam',
          studyMethods: 'I prefer active recall with flashcards and group study sessions',
          struggles: 'I struggle with time management and staying focused during long study sessions'
        }
      },
      {
        email: 'mike.chen@medschool.com',
        fullName: 'Mike Chen',
        yearOfStudy: '3rd Year',
        referralCode: 'STUDY2024',
        betaTester: false,
        joinedAt: serverTimestamp(),
        questions: {
          goals: 'Master complex medical procedures and improve my clinical reasoning skills',
          studyMethods: 'I use spaced repetition and practice with medical simulation software',
          struggles: 'Memorizing drug interactions and keeping up with the latest medical research'
        }
      },
      {
        email: 'emma.rodriguez@healthcare.edu',
        fullName: 'Emma Rodriguez',
        yearOfStudy: '1st Year',
        referralCode: '',
        betaTester: true,
        joinedAt: serverTimestamp(),
        questions: {
          goals: 'Build a strong foundation in anatomy and physiology for my medical career',
          studyMethods: 'I learn best through visual diagrams and hands-on lab work',
          struggles: 'Understanding complex biochemical pathways and maintaining motivation during difficult courses'
        }
      },
      {
        email: 'alex.kumar@premed.edu',
        fullName: 'Alex Kumar',
        yearOfStudy: '4th Year',
        referralCode: 'PREMED2024',
        betaTester: true,
        joinedAt: serverTimestamp(),
        questions: {
          goals: 'Prepare for medical school entrance exams and strengthen my application',
          studyMethods: 'I use practice tests and study groups with other pre-med students',
          struggles: 'Balancing coursework with MCAT preparation and managing stress levels'
        }
      },
      {
        email: 'jessica.williams@nursing.edu',
        fullName: 'Jessica Williams',
        yearOfStudy: '2nd Year',
        referralCode: 'NURSE2024',
        betaTester: false,
        joinedAt: serverTimestamp(),
        questions: {
          goals: 'Excel in my nursing program and prepare for clinical rotations',
          studyMethods: 'I prefer case studies and simulation-based learning approaches',
          struggles: 'Understanding pharmacology and applying theoretical knowledge in real clinical settings'
        }
      }
    ];

    console.log(`📝 Preparing to add ${sampleUsers.length} users to the waitlist collection...`);

    // Add each user to the waitlist collection
    const addedUsers = [];
    for (let i = 0; i < sampleUsers.length; i++) {
      const user = sampleUsers[i];
      try {
        console.log(`➕ Adding user ${i + 1}/${sampleUsers.length}: ${user.fullName} (${user.email})`);
        
        const docRef = await addDoc(collection(db, 'waitlist'), user);
        
        console.log(`✅ Successfully added user with ID: ${docRef.id}`);
        addedUsers.push({
          id: docRef.id,
          ...user
        });
        
        // Small delay to avoid overwhelming Firestore
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (userError) {
        console.error(`❌ Failed to add user ${user.fullName}:`, userError.message);
        // Continue with other users even if one fails
      }
    }

    console.log('🎉 Seeding completed!');
    console.log(`📊 Successfully added ${addedUsers.length} out of ${sampleUsers.length} users`);
    
    return {
      success: true,
      message: `Successfully seeded ${addedUsers.length} users to the waitlist collection`,
      data: {
        totalUsers: sampleUsers.length,
        addedUsers: addedUsers.length,
        users: addedUsers
      }
    };

  } catch (error) {
    console.error('❌ Error seeding waitlist data:', error);
    
    return {
      success: false,
      message: `Failed to seed waitlist data: ${error.message}`,
      error: error
    };
  }
}

/**
 * Main execution function
 */
async function main() {
  console.log('🚀 MedLens Waitlist Data Seeding Script');
  console.log('=====================================');
  
  const result = await seedWaitlistData();
  
  if (result.success) {
    console.log('\n✅ SUCCESS!');
    console.log(`📝 ${result.message}`);
    console.log(`👥 Users added: ${result.data.addedUsers}/${result.data.totalUsers}`);
  } else {
    console.log('\n❌ FAILED!');
    console.log(`💥 ${result.message}`);
    process.exit(1);
  }
  
  console.log('\n🏁 Script completed successfully!');
  process.exit(0);
}

// Run the script if called directly
if (require.main === module) {
  main().catch(error => {
    console.error('💥 Script failed with error:', error);
    process.exit(1);
  });
}

// Export the function for use in other modules
module.exports = { seedWaitlistData };
