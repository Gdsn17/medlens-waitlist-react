import React from 'react';

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About MedLens 🩺</h1>
          <p className="text-xl text-gray-600">
            Revolutionizing medical education with AI-powered explanations
          </p>
        </div>

        <div className="prose prose-lg max-w-none">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-gray-700 leading-relaxed">
              MedLens is on a mission to simplify medical education by transforming complex medical terms 
              and concepts into clear, understandable explanations using artificial intelligence. We believe 
              that every medical student deserves access to learning tools that make complex topics accessible 
              and engaging.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">🎯 What We Do</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Convert complex medical terms into simple explanations</li>
                <li>• Provide AI-powered study assistance</li>
                <li>• Create interactive learning experiences</li>
                <li>• Support medical students worldwide</li>
              </ul>
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">🚀 Our Vision</h3>
              <p className="text-gray-700">
                To become the leading platform for AI-powered medical education, 
                making complex medical knowledge accessible to students at every level 
                of their medical journey.
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Why MedLens?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl mb-2">⚡</div>
                <h4 className="font-semibold text-gray-900 mb-2">Fast Learning</h4>
                <p className="text-sm text-gray-600">Get instant explanations for complex medical terms</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">🎓</div>
                <h4 className="font-semibold text-gray-900 mb-2">Student-Focused</h4>
                <p className="text-sm text-gray-600">Designed specifically for medical students</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">🤖</div>
                <h4 className="font-semibold text-gray-900 mb-2">AI-Powered</h4>
                <p className="text-sm text-gray-600">Leveraging cutting-edge AI technology</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
