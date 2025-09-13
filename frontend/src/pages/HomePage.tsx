import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../components/MobileDemo.css';

interface FormData {
  fullName: string;
  email: string;
  yearOfStudy: string;
  isBetaTester: boolean;
  referralCode: string;
  goals: string[];
  studyMethods: string[];
  struggles: string[];
  otherGoals: string;
  otherStruggles: string;
}

const HomePage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    yearOfStudy: '',
    isBetaTester: false,
    referralCode: '',
    goals: [],
    studyMethods: [],
    struggles: [],
    otherGoals: '',
    otherStruggles: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [userReferralCode, setUserReferralCode] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleCheckboxChange = (field: 'goals' | 'studyMethods' | 'struggles', value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('http://localhost:5001/api/waitlist/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setUserReferralCode(data.referralCode);
        setSubmitted(true);
        setFormData({
          fullName: '',
          email: '',
          yearOfStudy: '',
          isBetaTester: false,
          referralCode: '',
          goals: [],
          studyMethods: [],
          struggles: [],
          otherGoals: '',
          otherStruggles: ''
        });
      } else {
        alert(data.message || 'Error submitting form');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error submitting form');
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToWaitlist = () => {
    const waitlistSection = document.getElementById('waitlist-section');
    if (waitlistSection) {
      waitlistSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-50 to-gray-100 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Simplify Medical Education with{' '}
                <span className="bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
                  AI-Powered Explanations
                </span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Transform complex medical terms into simple, understandable explanations. 
                Join thousands of medical students who are already learning smarter with MedLens.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={scrollToWaitlist}
                  className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-200"
                >
                  Join the Waitlist 🚀
                </button>
                <button
                  onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
                  className="border-2 border-primary-500 text-primary-500 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-primary-50 transition-all duration-200"
                >
                  Learn More
                </button>
              </div>
            </div>
            
            {/* Mobile Demo Section */}
            <div className="flex justify-center">
              <div className="iphone-mockup w-80 h-[600px] rounded-[3rem] p-2">
                <div className="iphone-screen w-full h-full rounded-[2.5rem] overflow-hidden relative">
                  {/* Status Bar */}
                  <div className="iphone-status-bar absolute top-0 left-0 right-0 h-12 flex items-center justify-between px-6 z-10">
                    <span className="text-white font-semibold text-sm">9:41</span>
                    <div className="flex items-center space-x-1">
                      <div className="w-4 h-2 bg-white rounded-sm"></div>
                      <div className="w-4 h-2 bg-white rounded-sm"></div>
                      <div className="w-4 h-2 bg-white rounded-sm"></div>
                      <div className="w-6 h-3 border border-white rounded-sm flex items-center justify-center">
                        <div className="w-4 h-2 bg-white rounded-sm"></div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-4 h-2 bg-white rounded-sm"></div>
                      <div className="w-4 h-2 bg-white rounded-sm"></div>
                      <div className="w-4 h-2 bg-white rounded-sm"></div>
                      <div className="w-6 h-3 border border-white rounded-sm flex items-center justify-center">
                        <div className="w-4 h-2 bg-white rounded-sm"></div>
                      </div>
                    </div>
                  </div>

                  {/* Demo Content */}
                  <div className="pt-12 h-full flex items-center justify-center">
                    <div className="text-center p-6">
                      <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <span className="text-white text-2xl">📱</span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">MedLens App</h3>
                      <p className="text-gray-600 text-sm">AI-Powered Medical Learning</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Waitlist Section */}
      <section id="waitlist-section" className="py-16 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {submitted ? (
            <div className="bg-white rounded-2xl p-8 lg:p-12 text-center shadow-xl max-w-lg mx-auto">
              <div className="text-6xl mb-4">🎉</div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to MedLens!</h1>
              <p className="text-lg text-gray-600 mb-8">
                You've successfully joined our waitlist. We'll notify you as soon as we launch!
              </p>
              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Your Referral Code</h3>
                <div className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white p-4 rounded-lg text-2xl font-bold tracking-wider mb-4 font-mono">
                  {userReferralCode}
                </div>
                <p className="text-gray-600 mb-4">
                  Share this code with friends to move up the waitlist and earn rewards!
                </p>
                <Link 
                  to="/referral" 
                  className="inline-block bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
                >
                  Learn About Rewards 🎁
                </Link>
              </div>
            </div>
          ) : (
            <div className="text-center mb-12">
              <h1 className="text-5xl font-bold text-gray-900 mb-4">Join the Waitlist <span className="text-2xl">📝</span></h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Be among the first to experience MedLens. Help us build the perfect tool for medical education. <span className="text-lg">🎯⬆️</span>
              </p>
            </div>
          )}

          {!submitted && (
            <div className="flex justify-center">
              <div className="bg-white rounded-2xl p-8 lg:p-12 shadow-xl w-full max-w-2xl">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">Reserve Your Spot <span className="text-xl">🎫</span></h2>
                  <p className="text-gray-600">
                    Fill out the form below to join our exclusive waitlist and help shape the future of medical education.
                  </p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Full Name */}
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all duration-200"
                      placeholder="Enter your full name"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all duration-200"
                      placeholder="Enter your email address"
                    />
                  </div>

                  {/* Year of Study */}
                  <div>
                    <label htmlFor="yearOfStudy" className="block text-sm font-medium text-gray-700 mb-2">
                      Year of Study <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="yearOfStudy"
                      name="yearOfStudy"
                      value={formData.yearOfStudy}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all duration-200"
                    >
                      <option value="">Select your year of study</option>
                      <option value="MBBS 1st Year">MBBS 1st Year</option>
                      <option value="MBBS 2nd Year">MBBS 2nd Year</option>
                      <option value="MBBS 3rd Year">MBBS 3rd Year</option>
                      <option value="MBBS 4th Year">MBBS 4th Year</option>
                      <option value="Intern">Intern</option>
                      <option value="Paramedical Course">Paramedical Course</option>
                      <option value="Nursing">Nursing</option>
                      <option value="Pharmacy">Pharmacy</option>
                    </select>
                  </div>

                  {/* Referral Code */}
                  <div>
                    <label htmlFor="referralCode" className="block text-sm font-medium text-gray-700 mb-2">
                      Referral Code (Optional)
                    </label>
                    <input
                      type="text"
                      id="referralCode"
                      name="referralCode"
                      value={formData.referralCode}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all duration-200"
                      placeholder="Enter referral code if you have one"
                    />
                  </div>

                  {/* What are you hoping to achieve with MedLens? */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      What are you hoping to achieve with MedLens? <span className="text-lg">🎯</span> *
                    </h3>
                    <p className="text-sm text-gray-500">You can select multiple options</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        'Simplify complex topics',
                        'Save study time',
                        'Prepare better for exams',
                        'Boost confidence in clinical knowledge',
                        'Other'
                      ].map((option) => (
                        <label key={option} className="flex items-center space-x-3 p-4 bg-gray-50 rounded-full border-2 border-gray-200 hover:border-primary-500 hover:bg-primary-50 cursor-pointer transition-all duration-200">
                          <input
                            type="checkbox"
                            checked={formData.goals.includes(option)}
                            onChange={() => handleCheckboxChange('goals', option)}
                            className="w-5 h-5 text-primary-500 rounded-full focus:ring-primary-500"
                          />
                          <span className="text-gray-700 font-medium">{option}</span>
                        </label>
                      ))}
                    </div>
                    {formData.goals.includes('Other') && (
                      <input
                        type="text"
                        name="otherGoals"
                        value={formData.otherGoals}
                        onChange={handleInputChange}
                        placeholder="Please specify..."
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all duration-200"
                      />
                    )}
                  </div>

                  {/* How do you currently study complex medical topics? */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      How do you currently study complex medical topics? <span className="text-lg">📚</span> *
                    </h3>
                    <p className="text-sm text-gray-500">You can select multiple options</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        'Textbooks only',
                        'YouTube / Online videos',
                        'Coaching classes',
                        'AI tools or study apps',
                        'Peer group discussions'
                      ].map((option) => (
                        <label key={option} className="flex items-center space-x-3 p-4 bg-gray-50 rounded-full border-2 border-gray-200 hover:border-primary-500 hover:bg-primary-50 cursor-pointer transition-all duration-200">
                          <input
                            type="checkbox"
                            checked={formData.studyMethods.includes(option)}
                            onChange={() => handleCheckboxChange('studyMethods', option)}
                            className="w-5 h-5 text-primary-500 rounded-full focus:ring-primary-500"
                          />
                          <span className="text-gray-700 font-medium">{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* What is your biggest struggle when learning medicine? */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      What is your biggest struggle when learning medicine? <span className="text-lg">😰</span> *
                    </h3>
                    <p className="text-sm text-gray-500">You can select multiple options</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        'Too much theory to remember',
                        'Hard to understand clinical terms',
                        'Lack of clear explanations',
                        'Not enough practice or quiz material',
                        'Other'
                      ].map((option) => (
                        <label key={option} className="flex items-center space-x-3 p-4 bg-gray-50 rounded-full border-2 border-gray-200 hover:border-primary-500 hover:bg-primary-50 cursor-pointer transition-all duration-200">
                          <input
                            type="checkbox"
                            checked={formData.struggles.includes(option)}
                            onChange={() => handleCheckboxChange('struggles', option)}
                            className="w-5 h-5 text-primary-500 rounded-full focus:ring-primary-500"
                          />
                          <span className="text-gray-700 font-medium">{option}</span>
                        </label>
                      ))}
                    </div>
                    {formData.struggles.includes('Other') && (
                      <input
                        type="text"
                        name="otherStruggles"
                        value={formData.otherStruggles}
                        onChange={handleInputChange}
                        placeholder="Please specify..."
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all duration-200"
                      />
                    )}
                  </div>

                  {/* Beta Tester */}
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="isBetaTester"
                      name="isBetaTester"
                      checked={formData.isBetaTester}
                      onChange={handleInputChange}
                      className="w-5 h-5 text-primary-500 rounded focus:ring-primary-500"
                    />
                    <label htmlFor="isBetaTester" className="text-sm font-medium text-gray-700">
                      I want to be a beta tester and help shape MedLens
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || !formData.fullName || !formData.email || !formData.yearOfStudy || formData.goals.length === 0 || formData.studyMethods.length === 0 || formData.struggles.length === 0}
                    className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white py-4 rounded-xl font-semibold text-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isSubmitting ? 'Joining...' : 'Join the Waitlist 🚀'}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
