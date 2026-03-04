import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaRobot, FaPaperPlane, FaMicrophone, FaStopCircle, FaSmile } from 'react-icons/fa';
import { useApp } from '../context/AppContext';
import toast from 'react-hot-toast';

const ChatbotEnhanced = () => {
  const { language, setLanguage, sendChatMessage } = useApp();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [sessionId, setSessionId] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const quickReplies = {
    en: ['Symptoms', 'Health Schemes', 'Emergency', 'Nearest Hospital', 'Medicines'],
    hi: ['लक्षण', 'स्वास्थ्य योजनाएं', 'आपातकाल', 'निकटतम अस्पताल', 'दवाएं'],
    te: ['లక్షణాలు', 'ఆరోగ్య పథకాలు', 'ఎమర్జెన్సీ', 'సమీప ఆసుపత్రి', 'ఔషధాలు']
  };

  const translations = {
    en: {
      welcome: "Namaste! I am GramaRaksha AI, your rural health assistant. How can I help you today?",
      typing: "Bot is typing...",
      voiceError: "Microphone access denied or not available",
      quickReplies: "Quick Replies:"
    },
    hi: {
      welcome: "नमस्ते! मैं ग्रामरक्षा एआई, आपका ग्रामीण स्वास्थ्य सहायक हूं। आज मैं आपकी कैसे मदद कर सकता हूं?",
      typing: "बॉट टाइप कर रहा है...",
      voiceError: "माइक्रोफोन एक्सेस नहीं दिया गया या उपलब्ध नहीं है",
      quickReplies: "त्वरित उत्तर:"
    },
    te: {
      welcome: "నమస్కారం! నేను గ్రామరక్ష AI, మీ గ్రామీణ ఆరోగ్య సహాయకుడిని. ఈరోజు నేను మీకు ఎలా సహాయపడగలను?",
      typing: "బాట్ టైప్ చేస్తోంది...",
      voiceError: "మైక్రోఫోన్ ప్రాప్యత లేదా అందుబాటులో లేనిది",
      quickReplies: "త్వరిత సమాధానాలు:"
    }
  };

  const t = translations[language] || translations.en;

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        role: 'bot',
        content: t.welcome,
        timestamp: new Date()
      }]);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (messageText = inputMessage) => {
    if (!messageText.trim()) return;

    const userMessage = { 
      role: 'user', 
      content: messageText, 
      timestamp: new Date() 
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setLoading(true);

    try {
      const response = await sendChatMessage(messageText, sessionId);
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
    } finally {
      setLoading(false);
    }
  };

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast.error('Speech recognition not supported in your browser');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.language = language === 'hi' ? 'hi-IN' : language === 'te' ? 'te-IN' : 'en-IN';
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onstart = () => {
      setIsListening(true);
      toast.success('Listening...');
    };

    recognition.onresult = (event) => {
      let interimTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          setInputMessage(transcript);
        }
      }
    };

    recognition.onerror = (event) => {
      toast.error(t.voiceError);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sand-beige via-white to-soft-charcoal/5 py-20">
      <div className="container mx-auto px-6 max-w-4xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="glass-panel rounded-2xl overflow-hidden shadow-2xl"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-forest-green via-emerald-600 to-electric-teal p-6 text-white">
            <div className="flex items-center justify-between">
              <motion.div 
                className="flex items-center gap-3"
                whileHover={{ scale: 1.02 }}
              >
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity }}>
                  <FaRobot className="w-8 h-8" />
                </motion.div>
                <div>
                  <h1 className="text-2xl font-bold">GramaRaksha AI</h1>
                  <p className="text-sm opacity-90">Your Rural Health Assistant</p>
                </div>
              </motion.div>
              
              <div className="flex gap-2">
                {['en', 'hi', 'te'].map(lang => (
                  <motion.button
                    key={lang}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setLanguage(lang)}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                      language === lang
                        ? 'bg-white text-forest-green'
                        : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
                  >
                    {lang.toUpperCase()}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>

          {/* Messages Container */}
          <div className="h-96 overflow-y-auto p-6 space-y-4 bg-white/50">
            <AnimatePresence>
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-xs lg:max-w-md xl:max-w-lg px-4 py-3 rounded-2xl ${
                      message.role === 'user'
                        ? 'bg-electric-teal text-white rounded-br-none'
                        : 'bg-gray-200 text-gray-800 rounded-bl-none'
                    }`}
                  >
                    <p className="whitespace-pre-line break-words">{message.content}</p>
                    <span className={`text-xs mt-2 block ${
                      message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {new Date(message.timestamp).toLocaleTimeString(language === 'en' ? 'en-IN' : 'hi-IN', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </motion.div>
              ))}
              
              {loading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="px-4 py-3 rounded-2xl rounded-bl-none bg-gray-200">
                    <motion.div className="flex gap-2">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          animate={{ y: [0, -10, 0] }}
                          transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.2 }}
                          className="w-2 h-2 bg-gray-600 rounded-full"
                        />
                      ))}
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies */}
          {messages.length <= 1 && (
            <div className="px-6 py-4 bg-sand-beige/50 border-t border-gray-200">
              <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <FaSmile className="text-electric-teal" /> {t.quickReplies}
              </p>
              <div className="flex flex-wrap gap-2">
                {(quickReplies[language] || quickReplies.en).map((reply, idx) => (
                  <motion.button
                    key={idx}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSendMessage(reply)}
                    className="px-4 py-2 bg-gradient-to-r from-forest-green to-electric-teal text-white rounded-full text-sm font-semibold hover:shadow-lg transition-all"
                  >
                    {reply}
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="p-4 bg-gradient-to-r from-sand-beige/30 to-white border-t border-gray-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your message..."
                disabled={loading}
                className="flex-1 px-4 py-3 rounded-full border-2 border-gray-300 focus:border-electric-teal focus:ring focus:ring-electric-teal/20 transition-all disabled:opacity-50"
              />
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleVoiceInput}
                disabled={loading}
                className={`p-3 rounded-full transition-all ${
                  isListening
                    ? 'bg-red-500 text-white animate-pulse'
                    : 'bg-orange-500 text-white hover:bg-orange-600'
                } disabled:opacity-50`}
              >
                {isListening ? <FaStopCircle /> : <FaMicrophone />}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSendMessage()}
                disabled={!inputMessage.trim() || loading}
                className="p-3 bg-electric-teal text-white rounded-full hover:bg-opacity-90 transition-all disabled:opacity-50"
              >
                <FaPaperPlane />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ChatbotEnhanced;
