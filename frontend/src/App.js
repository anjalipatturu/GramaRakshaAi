import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { AppProvider } from './context/AppContext';

import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';

import Home from './pages/Home';
import SymptomCheckerAI from './pages/SymptomCheckerAI';
import ChatbotEnhanced from './pages/ChatbotEnhanced';
import DashboardEnhanced from './pages/DashboardEnhanced';
import HealthSchemes from './pages/HealthSchemes';
import ImageUpload from './pages/ImageUpload';
import Emergency from './pages/Emergency';
import AdminPanel from './pages/AdminPanel';

import './index.css';

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-sand-beige via-white to-soft-charcoal/5">
          <Navbar />
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/symptom-checker" element={<SymptomCheckerAI />} />
              <Route path="/chatbot" element={<ChatbotEnhanced />} />
              <Route path="/dashboard" element={<DashboardEnhanced />} />
              <Route path="/schemes" element={<HealthSchemes />} />
              <Route path="/image-upload" element={<ImageUpload />} />
              <Route path="/emergency" element={<Emergency />} />
              <Route path="/admin/*" element={<AdminPanel />} />
            </Routes>
          </AnimatePresence>
          <Footer />
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
