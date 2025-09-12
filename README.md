# MedLens Waitlist Landing Page

A modern, responsive waitlist landing page for MedLens - an AI-powered medical education tool. Built with React, Node.js, and MongoDB.

## Features

- 🎯 **Waitlist Signup Form** - Collect user information with referral system
- 📊 **Survey Page** - Gather user goals and study methods
- 🎁 **Referral Program** - Reward system with multiple tiers
- 📱 **Responsive Design** - Mobile-first approach with Tailwind CSS
- 🚀 **Modern UI/UX** - Clean, professional design with smooth animations

## Tech Stack

### Frontend
- React 18 with TypeScript
- Tailwind CSS for styling
- React Router for navigation
- Axios for API calls

### Backend
- Node.js with Express
- MongoDB with Mongoose
- CORS enabled for cross-origin requests

## Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd medlens-waitlist
   ```

2. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd ../backend
   npm install
   ```

4. **Set up environment variables**
   Create a `.env` file in the backend directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/medlens-waitlist
   NODE_ENV=development
   ```

5. **Start MongoDB**
   Make sure MongoDB is running on your system.

6. **Start the backend server**
   ```bash
   cd backend
   npm run dev
   ```

7. **Start the frontend development server**
   ```bash
   cd frontend
   npm start
   ```

The application will be available at `http://localhost:3000`

## Project Structure

```
medlens-waitlist/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   └── types/          # TypeScript types
│   └── public/             # Static assets
├── backend/                 # Node.js backend
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   └── server.js           # Main server file
└── README.md
```

## API Endpoints

### Waitlist
- `POST /api/waitlist/join` - Join the waitlist
- `GET /api/waitlist/referral/:code` - Get referral info
- `GET /api/waitlist/stats` - Get waitlist statistics

### Survey
- `POST /api/survey/submit` - Submit survey response
- `GET /api/survey/stats` - Get survey statistics

## Features Overview

### 1. Landing Page
- Hero section with app mockup
- Feature highlights
- Call-to-action buttons
- How it works section

### 2. Waitlist Form
- User information collection
- Year of study selection
- Beta tester opt-in
- Referral code support
- Success page with referral code

### 3. Survey Page
- Goals and study methods questions
- Multiple choice with "Other" options
- Form validation
- Success confirmation

### 4. Referral Program
- Three-tier reward system
- Visual reward cards
- How it works explanation
- Call-to-action

### 5. About Page
- Company mission
- Feature showcase
- AI assistant demo
- Statistics section

## Styling

The project uses Tailwind CSS for styling with:
- Custom color palette (primary blue, secondary green)
- Responsive design patterns
- Smooth animations and transitions
- Modern gradient backgrounds
- Consistent spacing and typography

## Database Schema

### WaitlistUser
- fullName: String
- email: String (unique)
- yearOfStudy: String
- isBetaTester: Boolean
- referralCode: String (unique)
- referredBy: String
- referralCount: Number
- joinedAt: Date

### SurveyResponse
- email: String
- goals: [String]
- studyMethods: [String]
- otherGoals: String
- otherStudyMethods: String
- submittedAt: Date

## Development

### Frontend Development
```bash
cd frontend
npm start
```

### Backend Development
```bash
cd backend
npm run dev
```

### Building for Production
```bash
# Frontend
cd frontend
npm run build

# Backend
cd backend
npm start
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please contact the development team.
