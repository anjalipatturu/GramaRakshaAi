import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaBars, FaTimes, FaGlobe } from 'react-icons/fa';
import { useApp } from '../../context/AppContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { language, setLanguage, user, logout } = useApp();

  const navLinks = [
    { path: '/', label: { en: 'Home', hi: 'होम', te: 'హోమ్' } },
    { path: '/symptom-checker', label: { en: 'Symptom Checker', hi: 'लक्षण जांच', te: 'లక్షణాల పరీక్ష' } },
    { path: '/chatbot', label: { en: 'AI Chatbot', hi: 'AI चैटबॉट', te: 'AI చాట్‌బాట్' } },
    { path: '/image-upload', label: { en: 'Image Analysis', hi: 'छवि विश्लेषण', te: 'చిత్ర విశ్లేషణ' } },
    { path: '/schemes', label: { en: 'Health Schemes', hi: 'स्वास्थ्य योजनाएं', te: 'ఆరోగ్య పథకాలు' } },
  ];

  return (
    <nav className="glass-panel sticky top-0 z-40">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-forest-green to-electric-teal rounded-lg flex items-center justify-center text-white font-bold">
              GR
            </div>
            <span className="text-xl font-bold text-forest-green hidden sm:block">
              GramaRaksha AI
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-soft-charcoal hover:text-electric-teal transition-colors font-medium"
              >
                {link.label[language]}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <div className="language-selector">
              {['en', 'hi', 'te'].map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`language-btn ${language === lang ? 'active' : ''}`}
                >
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>

            {user ? (
              <button
                onClick={logout}
                className="hidden md:block px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/auth/login"
                className="hidden md:block px-4 py-2 bg-electric-teal text-white rounded-lg hover:bg-forest-green transition-all"
              >
                Login
              </Link>
            )}

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden text-forest-green"
            >
              {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>

        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden mt-4 space-y-3"
          >
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className="block py-2 text-soft-charcoal hover:text-electric-teal transition-colors"
              >
                {link.label[language]}
              </Link>
            ))}
          </motion.div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
