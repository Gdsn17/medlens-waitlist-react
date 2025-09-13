import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header: React.FC = () => {
  const location = useLocation();

  const scrollToWaitlist = () => {
    if (location.pathname === '/') {
      const waitlistSection = document.getElementById('waitlist-section');
      if (waitlistSection) {
        waitlistSection.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.location.href = '/#waitlist-section';
    }
  };

  const scrollToSection = (sectionId: string) => {
    if (location.pathname === '/') {
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.location.href = `/#${sectionId}`;
    }
  };

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
            MedLens
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection('about')}
              className="text-gray-700 hover:text-primary-500 font-medium transition-colors duration-200"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection('referral-program')}
              className="text-gray-700 hover:text-primary-500 font-medium transition-colors duration-200"
            >
              Referral Program
            </button>
            <button
              onClick={scrollToWaitlist}
              className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
            >
              Join Waitlist
            </button>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={scrollToWaitlist}
              className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-4 py-2 rounded-lg font-semibold text-sm"
            >
              Join Waitlist
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
