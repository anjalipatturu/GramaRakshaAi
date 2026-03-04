import React from 'react';
import { Link } from 'react-router-dom';
import { FaGithub, FaTwitter, FaLinkedin, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-forest-green to-electric-teal text-white mt-20">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">GramaRaksha AI</h3>
            <p className="text-sm opacity-90 mb-4">
              Built for Bharat. Powered by AI. Transforming rural healthcare through intelligent technology.
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-sand-beige transition-colors">
                <FaGithub size={20} />
              </a>
              <a href="#" className="hover:text-sand-beige transition-colors">
                <FaTwitter size={20} />
              </a>
              <a href="#" className="hover:text-sand-beige transition-colors">
                <FaLinkedin size={20} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/symptom-checker" className="hover:text-sand-beige transition-colors">Symptom Checker</Link></li>
              <li><Link to="/chatbot" className="hover:text-sand-beige transition-colors">AI Chatbot</Link></li>
              <li><Link to="/image-upload" className="hover:text-sand-beige transition-colors">Image Analysis</Link></li>
              <li><Link to="/schemes" className="hover:text-sand-beige transition-colors">Health Schemes</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><Link to="/emergency" className="hover:text-sand-beige transition-colors">Emergency</Link></li>
              <li><Link to="/about" className="hover:text-sand-beige transition-colors">About Us</Link></li>
              <li><Link to="/privacy" className="hover:text-sand-beige transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-sand-beige transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <FaPhone size={16} />
                <span>108 (Emergency)</span>
              </li>
              <li className="flex items-center gap-2">
                <FaEnvelope size={16} />
                <span>support@gramaraksha.gov.in</span>
              </li>
              <li className="flex items-center gap-2">
                <FaMapMarkerAlt size={16} />
                <span>Telangana, India</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 mt-8 pt-8 text-center">
          <p className="text-sm opacity-90">
            © {new Date().getFullYear()} GramaRaksha AI. All rights reserved. | A Government of India Initiative
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
