const mongoose = require('mongoose');

const waitlistUserSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  yearOfStudy: {
    type: String,
    required: true,
    enum: ['MBBS 1st Year', 'MBBS 2nd Year', 'MBBS 3rd Year', 'MBBS 4th Year', 'Intern', 'Paramedical Course', 'Nursing', 'Pharmacy', '1st Year', 'First Year', '2nd Year', 'Second Year', '3rd Year', 'Third Year', '4th Year', 'Fourth Year', '5th Year', 'Fifth Year', 'Graduate', 'Resident', 'Fellow', 'Attending', 'Other']
  },
  isBetaTester: {
    type: Boolean,
    default: false
  },
  referralCode: {
    type: String,
    unique: true,
    sparse: true
  },
  referredBy: {
    type: String,
    default: null
  },
  referralCount: {
    type: Number,
    default: 0
  },
  questions: [{
    questionId: {
      type: String,
      required: true
    },
    answer: {
      type: [String],
      required: true
    }
  }],
  joinedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('WaitlistUser', waitlistUserSchema);
