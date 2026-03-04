import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaRobot, FaUser, FaPaperPlane } from 'react-icons/fa';
import { useApp } from '../context/AppContext';
import toast from 'react-hot-toast';

const Chatbot = () => {
  const { language, setLanguage, sendChatMessage } = useApp();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [sessionId, setSessionId] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const welcomeMessages = {
      en: "Namaste! I am GramaRaksha AI, your rural health assistant. How can I help you today?",
      hi: "नमस्ते! मैं ग्रामरक्षा एआई, आपका ग्रामीण स्वास्थ्य सहायक हूं। आज मैं आपकी कैसे मदद कर सकता हूं?",
      te: "నమస్కారం! నేను గ్రామరక్ష AI, మీ గ్రామీణ ఆరోగ్య సహాయకుడిని. ఈరోజు నేను మీకు ఎలా సహాయపడగలను?"
    };
    
    setMessages([{
      role: 'bot',
      content: welcomeMessages[language] || welcomeMessages.en,
      timestamp: new Date()
    }]);
  }, [language]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = { role: 'user', content: inputMessage, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');

    try {
      const response = await sendChatMessage(inputMessage, sessionId);
      setSessionId(response.sessionId);
      
      setMessages(prev => [...prev, {
        role: 'bot',
        content: response.response,
        timestamp: new Date()
      }]);

      if (response.emergency) {
        toast.error('🚨 Emergency detected! Please call 108 immediately!', {
          duration: 10000,
          icon: '🚨'
        });
      }
    } catch (error) {
      toast.error('Error sending message');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sand-beige via-white to-soft-charcoal/5 py-20">
      <div className="container mx-auto px-6 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-panel rounded-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-forest-green to-electric-teal p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FaRobot className="w-8 h-8" />
                <div>
                  <h1 className="text-2xl font-bold">GramaRaksha AI</h1>
                  <p className="text-sm opacity-90">Your Rural Health Assistant</p>
                </div>
              </div>
              
              <div className="language-selector bg-white/20">
                {['en', 'hi', 'te'].map(lang => (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={`language-btn ${language === lang ? 'active' : ''}`}
                  >
                    {lang.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="h-96 overflow-y-auto p-6 space-y-4">
            <AnimatePresence>
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`chat-message ${message.role}`}>
                    <div className="flex items-start gap-3">
                      {message.role === 'bot' && <FaRobot className="w-5 h-5 mt-1" />}
                      <div className="flex-1">
                        <p className="whitespace-pre-line">{message.content}</p>
                        <span className="text-xs opacity-50 mt-2 block">
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      {message.role === 'user' && <FaUser className="w-5 h-5 mt-1" />}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 bg-sand-beige/30 border-t border-gray-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your message..."
                className="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:border-electric-teal focus:ring focus:ring-electric-teal/20 transition-all"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim()}
                className="p-3 bg-electric-teal text-white rounded-xl hover:bg-opacity-90 transition-all disabled:opacity-50"
              >
                <FaPaperPlane />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Chatbot;
