import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaHeartbeat, FaRobot, FaCamera, FaMicrophone, FaMapMarkedAlt, FaHandHoldingHeart } from 'react-icons/fa';
import { useApp } from '../context/AppContext';

const Home = () => {
  const { language } = useApp();

  const content = {
    en: {
      tagline: "Built for Bharat. Powered by AI.",
      hero: "Rural Health Intelligence & Smart Triage System",
      description: "Early risk detection • AI Chatbot • Voice Support • Public Health Monitoring",
      startScreening: "Start Health Screening",
      chatWithAI: "Chat with AI",
      features: "Key Features"
    },
    hi: {
      tagline: "भारत के लिए निर्मित। AI द्वारा संचालित।",
      hero: "ग्रामीण स्वास्थ्य खुफिया और स्मार्ट ट्राइएज सिस्टम",
      description: "प्रारंभिक जोखिम पहचान • AI चैटबॉट • आवाज सहायता • सार्वजनिक स्वास्थ्य निगरानी",
      startScreening: "स्वास्थ्य जांच शुरू करें",
      chatWithAI: "AI से बात करें",
      features: "मुख्य विशेषताएं"
    },
    te: {
      tagline: "భారత్ కోసం నిర్మించబడింది. AI ద్వారా శక్తివంతం.",
      hero: "గ్రామీణ ఆరోగ్య ఇంటెలిజెన్స్ & స్మార్ట్ ట్రయాజ్ సిస్టమ్",
      description: "ముందస్తు ప్రమాద గుర్తింపు • AI చాట్‌బాట్ • వాయిస్ సపోర్ట్ • పబ్లిక్ హెల్త్ మానిటరింగ్",
      startScreening: "ఆరోగ్య స్క్రీనింగ్ ప్రారంభించండి",
      chatWithAI: "AIతో చాట్ చేయండి",
      features: "ప్రధాన లక్షణాలు"
    }
  };

  const currentContent = content[language] || content.en;

  const modules = [
    { title: "Smart Symptom Checker", desc: "AI-powered risk assessment", icon: FaHeartbeat },
    { title: "Multilingual AI Chatbot", desc: "Support in English, Hindi, Telugu", icon: FaRobot },
    { title: "Image Analysis", desc: "Upload photos for AI analysis", icon: FaCamera },
    { title: "Voice Interaction", desc: "Speak in your language", icon: FaMicrophone },
    { title: "Village Intelligence", desc: "Village-wise health monitoring", icon: FaMapMarkedAlt },
    { title: "ASHA Worker Support", desc: "Tools for community health workers", icon: FaHandHoldingHeart }
  ];

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0B3C5D] via-[#00A896] to-[#F4F9FB]">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-[#00A896] rounded-full mix-blend-multiply filter blur-xl opacity-35 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-[#FF7A00] rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        
        <div className="relative container mx-auto px-6 py-24 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center text-white"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-shadow">
              GramaRaksha AI
            </h1>
            <p className="text-xl md:text-2xl mb-4 text-[#F4F9FB]">
              {currentContent.tagline}
            </p>
            <h2 className="text-3xl md:text-5xl font-bold mb-8 max-w-4xl mx-auto">
              {currentContent.hero}
            </h2>
            <p className="text-lg md:text-xl mb-12 text-[#F4F9FB]/90">
              {currentContent.description}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/symptom-checker">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-[#00A896] text-white rounded-xl font-semibold text-lg shadow-2xl hover:bg-[#0B3C5D] transition-all"
                >
                  {currentContent.startScreening}
                </motion.button>
              </Link>
              
              <Link to="/chatbot">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-[#FF7A00] text-white rounded-xl font-semibold text-lg shadow-2xl hover:bg-[#e66e00] transition-all"
                >
                  {currentContent.chatWithAI}
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-[#F4F9FB]">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-[#0B3C5D] mb-16">
            {currentContent.features}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {modules.map((module, index) => {
              const Icon = module.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="glass-panel p-8 rounded-2xl cursor-pointer hover:shadow-2xl transition-all"
                >
                  <Icon className="text-4xl text-[#00A896] mb-4" />
                  <h3 className="text-2xl font-bold text-[#0B3C5D] mb-2">
                    {module.title}
                  </h3>
                  <p className="text-[#1B1B1B]/80">
                    {module.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-[#0B3C5D] to-[#00A896] text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-8">Why Choose GramaRaksha AI?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-8 bg-white/10 backdrop-blur rounded-xl"
            >
              <div className="text-5xl mb-4">📱</div>
              <h3 className="text-2xl font-bold mb-4">Mobile First</h3>
              <p>Optimized for all devices, works offline too</p>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-8 bg-white/10 backdrop-blur rounded-xl"
            >
              <div className="text-5xl mb-4">🤖</div>
              <h3 className="text-2xl font-bold mb-4">AI-Powered</h3>
              <p>Advanced algorithms for accurate health assessment</p>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-8 bg-white/10 backdrop-blur rounded-xl"
            >
              <div className="text-5xl mb-4">🌍</div>
              <h3 className="text-2xl font-bold mb-4">Multilingual</h3>
              <p>Support for English, Hindi, and Telugu</p>
            </motion.div>
          </div>
        </div>
      </section>

      <Link to="/emergency">
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-[#D90429] text-white rounded-full shadow-2xl hover:bg-[#b50322] transition-all duration-300 animate-pulse-slow flex items-center justify-center"
        >
          <span className="text-2xl">🚨</span>
        </motion.button>
      </Link>
    </div>
  );
};

export default Home;
