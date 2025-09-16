import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import '../components/MobileDemo.css';
import { saveWaitlistForm } from '../services/firestoreService';

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
  
  // Mobile Demo Carousel State
  const [currentDemoStep, setCurrentDemoStep] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
  
  // Medical Terms Rotation State
  const [currentTermIndex, setCurrentTermIndex] = useState(0);
  const medicalTerms = [
    {
      term: "Disseminated Intravascular Coagulation (DIC)",
      explanation: "A rare condition where blood clots form all over the body and then cause severe bleeding."
    },
    {
      term: "Hypertrophic Cardiomyopathy",
      explanation: "A heart disease where the muscle wall becomes too thick, making it harder to pump blood."
    },
    {
      term: "Glioblastoma Multiforme",
      explanation: "An aggressive brain tumor that grows and spreads quickly."
    },
    {
      term: "Pulmonary Alveolar Proteinosis",
      explanation: "A lung disease where protein-like material builds up, making it hard to breathe."
    },
    {
      term: "Systemic Lupus Erythematosus (SLE)",
      explanation: "A long-term autoimmune disease where the immune system attacks the body's own tissues."
    }
  ];

  // Search History Categories State
  const [showHistoryAnimation, setShowHistoryAnimation] = useState(false);
  const searchCategories = [
    {
      id: 'anatomy',
      name: 'Anatomy',
      icon: '🦴',
      color: 'from-blue-500 to-blue-600',
      searches: [
        { query: 'Human skeleton', time: '2 hours ago' },
        { query: 'Brain structure', time: '1 day ago' },
        { query: 'Muscle groups', time: '2 days ago' },
        { query: 'Bone density', time: '3 days ago' },
        { query: 'Organ systems', time: '1 week ago' }
      ]
    },
    {
      id: 'cardiology',
      name: 'Cardiology',
      icon: '❤️',
      color: 'from-red-500 to-red-600',
      searches: [
        { query: 'Heart diseases', time: '1 hour ago' },
        { query: 'ECG reading', time: '4 hours ago' },
        { query: 'Blood pressure', time: '1 day ago' },
        { query: 'Arrhythmia types', time: '2 days ago' },
        { query: 'Cardiac surgery', time: '3 days ago' }
      ]
    },
    {
      id: 'neurology',
      name: 'Neurology',
      icon: '🧠',
      color: 'from-purple-500 to-purple-600',
      searches: [
        { query: 'Parkinson symptoms', time: '30 min ago' },
        { query: 'MRI brain', time: '2 hours ago' },
        { query: 'Nerve mapping', time: '1 day ago' },
        { query: 'Epilepsy treatment', time: '2 days ago' },
        { query: 'Stroke recovery', time: '4 days ago' }
      ]
    },
    {
      id: 'pediatrics',
      name: 'Pediatrics',
      icon: '👶',
      color: 'from-green-500 to-green-600',
      searches: [
        { query: 'Child growth chart', time: '1 hour ago' },
        { query: 'Vaccination schedule', time: '3 hours ago' },
        { query: 'Common colds', time: '1 day ago' },
        { query: 'Infant nutrition', time: '2 days ago' },
        { query: 'Developmental milestones', time: '3 days ago' }
      ]
    }
  ];

  // Demo slides configuration
  const demoSlides = useMemo(() => [
    { id: 'scanning', name: 'Scanning' },
    { id: 'analyzing', name: 'AI Analyzing' },
    { id: 'explanation', name: 'Explanation' },
    { id: 'history', name: 'History' },
    { id: 'categories', name: 'Categories' },
    { id: 'saved', name: 'Saved Terms' }
  ], []);

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
      console.log('🚀 Submitting form to Firestore...');
      console.log('Form data:', formData);
      
      // Use Firestore service to save the form data directly
      const result = await saveWaitlistForm(formData);

      if (result.success) {
        console.log('✅ Form submitted successfully:', result.data);
        
        // Generate a simple referral code (you can enhance this later)
        const referralCode = `ML${Date.now().toString().slice(-6)}`;
        setUserReferralCode(referralCode);
        setSubmitted(true);
        
        // Clear the form
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
        
        console.log('🎉 Success! User joined waitlist with referral code:', referralCode);
      } else {
        console.error('❌ Form submission failed:', result.message);
        alert(result.message || 'Error submitting form');
      }
    } catch (error) {
      console.error('❌ Error submitting form:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      alert(`Error submitting form: ${errorMessage}. Please check your internet connection and try again.`);
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

  // Mobile Demo Functions
  const nextDemoStep = useCallback(() => {
    setCurrentDemoStep((prev) => (prev + 1) % demoSlides.length);
    // Only show history animation for specific slides
    if (demoSlides[currentDemoStep]?.id === 'history' || demoSlides[currentDemoStep]?.id === 'categories') {
      setShowHistoryAnimation(true);
      setTimeout(() => setShowHistoryAnimation(false), 1000);
    }
  }, [currentDemoStep, demoSlides]);

  const prevDemoStep = () => {
    setCurrentDemoStep((prev) => (prev - 1 + demoSlides.length) % demoSlides.length);
    // Only show history animation for specific slides
    if (demoSlides[currentDemoStep]?.id === 'history' || demoSlides[currentDemoStep]?.id === 'categories') {
      setShowHistoryAnimation(true);
      setTimeout(() => setShowHistoryAnimation(false), 1000);
    }
  };

  const handleHistoryClick = () => {
    setCurrentDemoStep(3); // Go to history slide
  };

  const handleManualControl = () => {
    setIsAutoPlaying(false);
    setShowHistoryAnimation(false); // Remove history animation for manual control
    if (autoPlayRef.current) {
      clearTimeout(autoPlayRef.current);
    }
    // Resume auto-play after 5 seconds
    setTimeout(() => {
      setIsAutoPlaying(true);
    }, 5000);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextDemoStep();
      handleManualControl();
    }
    if (isRightSwipe) {
      prevDemoStep();
      handleManualControl();
    }
  };

  // Medical Terms Rotation
  const nextMedicalTerm = useCallback(() => {
    setCurrentTermIndex((prev) => (prev + 1) % medicalTerms.length);
  }, [medicalTerms.length]);

  // Auto-play effects
  useEffect(() => {
    if (isAutoPlaying) {
      autoPlayRef.current = setInterval(nextDemoStep, 3000);
    } else {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    }
    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isAutoPlaying, nextDemoStep]);

  useEffect(() => {
    const termInterval = setInterval(nextMedicalTerm, 3000);
    return () => clearInterval(termInterval);
  }, [nextMedicalTerm]);

  // Hash-based navigation
  useEffect(() => {
    const hash = window.location.hash;
    if (hash === '#about') {
      document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
    } else if (hash === '#referral') {
      document.getElementById('referral')?.scrollIntoView({ behavior: 'smooth' });
    } else if (hash === '#waitlist') {
      document.getElementById('waitlist-section')?.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-50 to-gray-100 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="flex items-center space-x-3 mb-4">
                <h1 className="text-4xl lg:text-5xl font-bold text-blue-600">MedLens</h1>
                <span className="text-4xl">📱</span>
              </div>
              <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight text-left">
                Simplifying Complex Medical Terms into Clear Language
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed text-left">
                Join the waitlist for the first AI-powered tool that helps medical students and healthcare professionals learn smarter, faster, and clearer.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={scrollToWaitlist}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-200"
                >
                  Join the Waitlist 🚀
                </button>
              </div>
            </div>
            
            {/* Mobile Demo Section */}
            <div className="flex flex-col items-center">
              <div 
                className="iphone-mockup w-80 h-[600px] rounded-[3rem] p-2"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                <div className="iphone-screen w-full h-full rounded-[2.5rem] overflow-hidden relative">
                  {/* Status Bar */}
                  <div className="iphone-status-bar absolute top-0 left-0 right-0 h-12 flex items-center justify-between px-6 z-10">
                    <span className="text-white font-semibold text-sm">9:41</span>
                    <div className="flex items-center">
                      {/* Battery icon */}
                      <div className="w-6 h-3 border border-green-400 rounded-sm flex items-center justify-center">
                        <div className="w-4 h-2 bg-green-400 rounded-sm"></div>
                      </div>
                    </div>
                  </div>

                  {/* History Icon - Fixed Position */}
                  <button
                    onClick={handleHistoryClick}
                    className="absolute top-16 right-4 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center shadow-lg hover:bg-blue-600 transition-colors duration-200 z-20"
                  >
                    <span className="text-white text-lg">📚</span>
                  </button>
                    
                  {/* Carousel Content */}
                  <div className="relative h-full bg-white">
                    {/* Navigation Buttons Inside Mobile Demo */}
                    <button
                      onClick={() => {
                        prevDemoStep();
                        handleManualControl();
                      }}
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-white/90 rounded-full shadow-lg flex items-center justify-center hover:bg-white transition-colors duration-200 z-20"
                    >
                      <span className="text-gray-600 text-sm">‹</span>
                    </button>
                    <button
                      onClick={() => {
                        nextDemoStep();
                        handleManualControl();
                      }}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-white/90 rounded-full shadow-lg flex items-center justify-center hover:bg-white transition-colors duration-200 z-20"
                    >
                      <span className="text-gray-600 text-sm">›</span>
                    </button>

                    {/* Slide 1: Scanning */}
                    {currentDemoStep === 0 && (
                      <div className="h-full flex flex-col bg-gradient-to-b from-blue-600 to-blue-800">
                        {/* Scanner Header */}
                        <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
                          <h3 className="text-white font-semibold text-lg">Scanner</h3>
                        </div>
                        
                        {/* Main Content Area */}
                        <div className="flex-1 flex items-center justify-center p-6">
                          <div className="w-full max-w-xs">
                            <div className="bg-blue-700 rounded-2xl p-6 text-center relative overflow-hidden">
                              <div className="text-white text-xl font-semibold mb-2">Glioblastoma Multiforme</div>
                              <div className="text-blue-200 text-sm">Processing...</div>
                              
                              {/* Scanning Animation */}
                              <div className="absolute inset-0 pointer-events-none">
                                <div className="scanning-line absolute top-0 left-0 right-0 h-0.5 bg-blue-400 animate-pulse"></div>
                              </div>
                            </div>
                          </div>
                    </div>
                    
                        {/* Camera Icon at Bottom */}
                        <div className="flex justify-center pb-6">
                          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
                            <span className="text-blue-600 text-xl">📷</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Slide 2: AI Analyzing */}
                    {currentDemoStep === 1 && (
                      <div className="h-full flex flex-col items-center justify-center p-6 bg-white">
                        <div className="w-full max-w-xs mb-8">
                          <div className="neural-network bg-gray-900 rounded-2xl p-6 h-48 flex items-center justify-center">
                            <div className="text-center">
                              <div className="neural-pulse w-16 h-16 bg-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                                <div className="w-8 h-8 bg-white rounded"></div>
                              </div>
                              <div className="text-white text-lg font-semibold mb-2">AI Analyzing</div>
                              <div className="text-gray-300 text-sm">Processing medical data...</div>
                            </div>
                          </div>
                        </div>
                        <div className="w-full max-w-xs">
                          <div className="bg-gray-100 rounded-xl p-4">
                            <div className="text-sm text-gray-600">Analyzing complex medical terms...</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Slide 3: Simple Explanation */}
                    {currentDemoStep === 2 && (
                      <div className="h-full flex flex-col items-center justify-center p-6 bg-white">
                        <div className="w-full max-w-xs mb-8">
                          <div className="bg-gray-900 rounded-2xl p-6 h-48 flex items-center justify-center">
                            <div className="text-center text-white">
                              <div className="text-lg font-semibold mb-2">Glioblastoma Multiforme</div>
                              <div className="text-sm text-gray-300">→</div>
                              <div className="text-sm text-blue-300">An aggressive brain tumor that grows and spreads quickly</div>
                            </div>
                          </div>
                        </div>
                        <div className="w-full max-w-xs">
                          <div className="bg-green-100 rounded-xl p-4">
                            <div className="text-sm text-green-800">✓ Simplified explanation ready!</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Slide 4: History Page */}
                    {currentDemoStep === 3 && (
                      <div className="h-full flex flex-col bg-gradient-to-b from-gray-50 to-white">
                        {/* History Header */}
                        <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <span className="text-2xl">📚</span>
                            <h3 className="text-white font-semibold text-lg">Search History</h3>
                          </div>
                          <p className="text-white/80 text-sm mt-1">Recent searches</p>
                        </div>
                        
                        {/* History Content */}
                        <div className="flex-1 p-4 overflow-y-auto">
                          <div className="space-y-3">
                            {[
                              { query: 'Myocardial Infarction', time: 'Just now', category: 'Cardiology' },
                              { query: 'Glioblastoma Multiforme', time: '2 min ago', category: 'Neurology' },
                              { query: 'Human skeleton', time: '1 hour ago', category: 'Anatomy' },
                              { query: 'Heart diseases', time: '2 hours ago', category: 'Cardiology' },
                              { query: 'Brain structure', time: '1 day ago', category: 'Anatomy' }
                            ].map((search, searchIndex) => (
                              <div 
                                key={searchIndex}
                                className={`bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 ${
                                  showHistoryAnimation ? 'animate-pulse' : ''
                                }`}
                                style={{
                                  animationDelay: `${searchIndex * 100}ms`
                                }}
                              >
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <h4 className="text-gray-900 font-medium text-sm mb-1">{search.query}</h4>
                                    <div className="flex items-center space-x-2">
                                      <p className="text-gray-500 text-xs">{search.time}</p>
                                      <span className="text-blue-500 text-xs font-medium">{search.category}</span>
                                    </div>
                                  </div>
                                  <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                                    <span className="text-gray-400 text-xs">🔍</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                      </div>
                      
                        {/* Bottom Action Bar */}
                        <div className="bg-gray-100 px-4 py-3 border-t border-gray-200">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                              <span className="text-gray-600 text-xs">Search History</span>
                            </div>
                            <button className="text-blue-500 text-xs font-medium">View All</button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Slide 5: Categories */}
                    {currentDemoStep === 4 && (
                      <div className="h-full flex flex-col bg-gradient-to-b from-gray-50 to-white">
                        {/* Categories Header */}
                        <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <span className="text-2xl">📂</span>
                            <h3 className="text-white font-semibold text-lg">Categories</h3>
                          </div>
                          <p className="text-white/80 text-sm mt-1">Browse by department</p>
                        </div>
                        
                        {/* Categories Content */}
                        <div className="flex-1 p-4 overflow-y-auto">
                          <div className="grid grid-cols-2 gap-3">
                            {searchCategories.map((category, index) => (
                              <div 
                                key={category.id}
                                className={`bg-gradient-to-r ${category.color} rounded-xl p-4 text-white hover:shadow-lg transition-all duration-200 ${
                                  showHistoryAnimation ? 'animate-pulse' : ''
                                }`}
                                style={{
                                  animationDelay: `${index * 100}ms`
                                }}
                              >
                                <div className="flex items-center space-x-2 mb-2">
                                  <span className="text-xl">{category.icon}</span>
                                  <h4 className="font-semibold text-sm">{category.name}</h4>
                                </div>
                                <p className="text-white/80 text-xs">{category.searches.length} searches</p>
                              </div>
                            ))}
                      </div>
                    </div>
                    
                        {/* Bottom Action Bar */}
                        <div className="bg-gray-100 px-4 py-3 border-t border-gray-200">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                              <span className="text-gray-600 text-xs">Categories</span>
                            </div>
                            <button className="text-purple-500 text-xs font-medium">Browse All</button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Slide 6: Saved Terms */}
                    {currentDemoStep === 5 && (
                      <div className="h-full flex flex-col items-center justify-center p-6 bg-white">
                        <div className="w-full max-w-xs mb-8">
                          <div className="bg-gray-900 rounded-2xl p-6 h-48 flex items-center justify-center">
                            <div className="text-center text-white">
                              <div className="text-lg font-semibold mb-4">Saved Terms</div>
                              <div className="space-y-2 text-sm">
                                <div className="bg-blue-500 rounded-lg p-2">DIC - Blood clotting disorder</div>
                                <div className="bg-blue-500 rounded-lg p-2">HCM - Heart muscle disease</div>
                                <div className="bg-blue-500 rounded-lg p-2">GBM - Brain tumor</div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="w-full max-w-xs">
                          <div className="bg-blue-100 rounded-xl p-4">
                            <div className="text-sm text-blue-800">📚 All terms saved for review!</div>
                          </div>
                        </div>
                      </div>
                    )}
                    </div>
                  
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Referral Rewards Section */}
      <section id="referral" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Referral Rewards 🎁</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Invite your friends and earn amazing rewards! The more you refer, the better the rewards. 💫
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* 3 Referrals */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 text-center hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-2xl">🚀</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Early Access</h3>
              <p className="text-gray-600 mb-6">
                Get exclusive early access to MedLens before the public launch. Be among the first to experience the future of medical education.
              </p>
              <div className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold">
                🎯 3 Referrals
              </div>
            </div>

            {/* 5 Referrals */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-8 text-center hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-2xl">📚</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Free eBook</h3>
              <p className="text-gray-600 mb-6">
                Get our exclusive "Top 50 Simplified Medical Terms with AI Explanations" eBook - a comprehensive guide to complex medical terminology.
              </p>
              <div className="bg-purple-500 text-white px-6 py-3 rounded-lg font-semibold">
                🎯 5 Referrals
              </div>
            </div>

            {/* 10 Referrals */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8 text-center hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-2xl">💎</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">1-Month Free</h3>
              <p className="text-gray-600 mb-6">
                Enjoy a full month of premium MedLens features completely free! Access all advanced AI explanations and study tools.
              </p>
              <div className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold">
                🎯 10 Referrals
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why MedLens Section */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Why MedLens? <span className="text-2xl">🤔</span></h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm">1</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">AI-Powered Simplification</h3>
                    <p className="text-gray-600">Transform complex medical jargon into simple, understandable explanations using advanced AI technology.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm">2</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Save Study Time</h3>
                    <p className="text-gray-600">Stop spending hours trying to understand complex terms. Get instant, clear explanations in seconds.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm">3</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Boost Confidence</h3>
                    <p className="text-gray-600">Build confidence in your medical knowledge with clear, accurate explanations that stick.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Live Demo</h3>
              <div className="space-y-4">
                <div className="bg-gray-900 rounded-lg p-4 text-center">
                  <div className="text-white text-lg font-semibold mb-2">
                    {medicalTerms[currentTermIndex].term}
                  </div>
                  <div className="text-blue-300 text-sm">
                    {medicalTerms[currentTermIndex].explanation}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-500">MedLens transforms complex terms like this</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">About MedLens <span className="text-2xl">🏥</span></h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're revolutionizing medical education by making complex concepts simple and accessible to every student.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Mission Card */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mb-6">
                <span className="text-white text-2xl">🎯</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
              <p className="text-gray-600 leading-relaxed">
                To democratize medical education by providing AI-powered tools that make complex medical concepts accessible to every student, regardless of their background or learning style.
              </p>
            </div>

            {/* Vision Card */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8 hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-6">
                <span className="text-white text-2xl">👁️</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
              <p className="text-gray-600 leading-relaxed">
                A world where every medical student has access to clear, understandable explanations that help them succeed in their studies and become better healthcare professionals.
              </p>
            </div>

            {/* Features Card */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-8 hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mb-6">
                <span className="text-white text-2xl">⚡</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Key Features</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span className="text-gray-700 text-sm">AI-powered explanations</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span className="text-gray-700 text-sm">Mobile-first design</span>
                    </div>
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                    </div>
                  <span className="text-gray-700 text-sm">Personalized learning</span>
                    </div>
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span className="text-gray-700 text-sm">Community-driven</span>
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
