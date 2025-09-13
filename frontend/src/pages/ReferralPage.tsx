import React from 'react';

const ReferralPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Referral Program 🎁</h1>
          <p className="text-xl text-gray-600">
            Earn rewards by referring friends to MedLens!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl p-8 text-center">
            <div className="text-4xl mb-4">🥇</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">3 Referrals</h3>
            <p className="text-gray-600 mb-4">Get early access to MedLens</p>
            <div className="bg-yellow-200 text-yellow-800 px-4 py-2 rounded-full text-sm font-semibold">
              Early Access
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 text-center">
            <div className="text-4xl mb-4">📚</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">5 Referrals</h3>
            <p className="text-gray-600 mb-4">Free eBook: "Top 50 Simplified Medical Terms with AI Explanations"</p>
            <div className="bg-blue-200 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold">
              Free eBook
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8 text-center">
            <div className="text-4xl mb-4">💎</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">10 Referrals</h3>
            <p className="text-gray-600 mb-4">1-month free subscription to MedLens Pro</p>
            <div className="bg-green-200 text-green-800 px-4 py-2 rounded-full text-sm font-semibold">
              Free Subscription
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">How It Works</h2>
          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              <div className="bg-primary-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">1</div>
              <div>
                <h3 className="font-semibold text-gray-900">Join the Waitlist</h3>
                <p className="text-gray-600">Get your unique referral code when you join</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-primary-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">2</div>
              <div>
                <h3 className="font-semibold text-gray-900">Share Your Code</h3>
                <p className="text-gray-600">Share your referral code with friends and family</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-primary-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">3</div>
              <div>
                <h3 className="font-semibold text-gray-900">Earn Rewards</h3>
                <p className="text-gray-600">Unlock rewards as your referrals join the waitlist</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferralPage;
