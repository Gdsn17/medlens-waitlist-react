# MedLens Waitlist

A modern waitlist application for MedLens - an AI-powered tool that simplifies complex medical terms for students and healthcare professionals.

## 🚀 Live Demo

- **Frontend:** https://medlensai-waitlist.web.app
- **Backend API:** Running on Cloud Run (port 8080)
- **Database:** Firebase Firestore

## 🏗️ Architecture

- **Frontend:** React + TypeScript + Tailwind CSS
- **Backend:** Node.js + Express.js
- **Database:** Firebase Firestore
- **Hosting:** Firebase Hosting (Frontend) + Cloud Run (Backend)
- **Deployment:** Free tier only

## 📁 Project Structure

```
medlens-waitlist/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/           # Page components
│   │   └── services/        # API services
│   └── public/              # Static assets
├── backend/                 # Node.js backend API
│   ├── routes/              # API route handlers
│   ├── models/              # Data models
│   └── server.js            # Main server file
├── functions/               # Firebase Functions (alternative backend)
└── firebase.json            # Firebase configuration
```

## 🛠️ Development Setup

### Prerequisites

- Node.js 18+
- Firebase CLI
- Google Cloud SDK (for deployment)

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd medlens-waitlist
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install frontend dependencies
   cd frontend && npm install
   
   # Install backend dependencies
   cd ../backend && npm install
   ```

3. **Start development servers**
   ```bash
   # Start backend (port 8080)
   cd backend && npm start
   
   # Start frontend (port 3000)
   cd frontend && npm start
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8080

## 🚀 Deployment

### Frontend (Firebase Hosting)
```bash
./deploy-frontend.sh <BACKEND_API_URL>
```

### Backend (Cloud Run)
```bash
./deploy-backend.sh
```

### Free Tier Deployment
```bash
./deploy-free.sh
```

## 📊 Database Schema

### waitlistUsers Collection
```javascript
{
  fullName: string,
  email: string,
  yearOfStudy: string,
  isBetaTester: boolean,
  referralCode: string,
  goals: string[],
  studyMethods: string[],
  struggles: string[],
  otherGoals: string,
  otherStruggles: string,
  createdAt: timestamp,
  updatedAt: timestamp,
  timestamp: string
}
```

## 🔧 API Endpoints

- `GET /api/health` - Health check
- `POST /api/waitlist/save` - Save waitlist signup
- `GET /api/waitlist/users` - Get all users (admin)

## 🎯 Features

- ✅ Responsive design
- ✅ Form validation
- ✅ Real-time data storage
- ✅ Referral system
- ✅ Beta tester signup
- ✅ Mobile-first approach
- ✅ Free tier deployment

## 📱 Technologies Used

- **Frontend:** React, TypeScript, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** Firebase Firestore
- **Hosting:** Firebase Hosting, Cloud Run
- **Deployment:** Firebase CLI, Google Cloud SDK

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support or questions, please contact the development team.