import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaRobot, FaPaperPlane, FaMicrophone, FaStopCircle, FaSmile, FaExclamationTriangle, FaHospital, FaQuestionCircle, FaHeartbeat } from 'react-icons/fa';
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
    en: ['I have fever', 'Chest pain', 'Difficulty breathing', 'Headache', 'Abdominal pain'],
    hi: ['मुझे बुखार है', 'सीने में दर्द', 'सांस लेने में कठिनाई', 'सिरदर्द', 'पेट दर्द'],
    te: ['నాకు జ్వరం ఉంది', 'గుండె నొప్పి', 'శ్వాస తీసుకోవడంలో ఇబ్బంది', 'తలనొప్పి', 'కడుపు నొప్పి']
  };

  const translations = {
    en: {
      welcome: "👋 Welcome to GramaRaksha Medical Triage Assistant! I can analyze your symptoms and provide health guidance. Please describe your symptoms in detail.",
      typing: "Analyzing symptoms...",
      voiceError: "Microphone access denied or not available",
      quickReplies: "Common Symptoms:"
    },
    hi: {
      welcome: "👋 ग्रामरक्षा मेडिकल ट्राइएज सहायक में आपका स्वागत है! मैं आपके लक्षणों का विश्लेषण कर सकता हूं और स्वास्थ्य मार्गदर्शन प्रदान कर सकता हूं। कृपया अपने लक्षणों का विस्तार से वर्णन करें।",
      typing: "लक्षणों का विश्लेषण...",
      voiceError: "माइक्रोफोन एक्सेस नहीं दिया गया या उपलब्ध नहीं है",
      quickReplies: "सामान्य लक्षण:"
    },
    te: {
      welcome: "👋 గ్రామరక్ష మెడికల్ ట్రయాజ్ అసిస్టెంట్‌కి స్వాగతం! నేను మీ లక్షణాలను విశ్లేషించి ఆరోగ్య మార్గదర్శకత్వం అందించగలను. దయచేసి మీ లక్షణాలను వివరంగా వివరించండి.",
      typing: "లక్షణాలను విశ్లేషిస్తోంది...",
      voiceError: "మైక్రోఫోన్ ప్రాప్యత లేదా అందుబాటులో లేనిది",
      quickReplies: "సాధారణ లక్షణాలు:"
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
      
      console.log('Chatbot response:', response);
      
      if (response && response.sessionId) {
        setSessionId(response.sessionId);
      }
      
      // Add bot message with triage data
      setMessages(prev => [...prev, {
        role: 'bot',
        content: response.response || '',
        triageData: response, // Store full triage assessment
        timestamp: new Date()
      }]);

      if (response.emergency) {
        toast.error('🚨 EMERGENCY DETECTED! Call 108 immediately!', {
          duration: 10000,
          icon: '🚨'
        });
      }
    } catch (error) {
      console.error('Chatbot error:', error);
      toast.error(`Error: ${error.response?.data?.message || error.message || 'Failed to send message'}`);
      
      // Remove the failed user message
      setMessages(prev => prev.slice(0, -1));
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
                  <h1 className="text-2xl font-bold">GramaRaksha Medical Triage</h1>
                  <p className="text-sm opacity-90">Smart AI Health Assistant</p>
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
                  {message.role === 'user' ? (
                    <div className="max-w-xs lg:max-w-md xl:max-w-lg px-4 py-3 rounded-2xl bg-electric-teal text-white rounded-br-none">
                      <p className="whitespace-pre-line break-words">{message.content}</p>
                      <span className="text-xs mt-2 block text-blue-100">
                        {new Date(message.timestamp).toLocaleTimeString(language === 'en' ? 'en-IN' : 'hi-IN', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  ) : (
                    <div className="max-w-2xl w-full">
                      {message.triageData ? (
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                          {/* Risk Level Header */}
                          <div className={`p-4 text-white ${
                            message.triageData.risk_level === 'CRITICAL' ? 'bg-red-600' :
                            message.triageData.risk_level === 'HIGH' ? 'bg-orange-600' :
                            message.triageData.risk_level === 'MODERATE' ? 'bg-yellow-600' :
                            'bg-green-600'
                          }`}>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <FaHeartbeat className="text-2xl" />
                                <div>
                                  <h3 className="font-bold text-lg">Risk Level: {message.triageData.risk_level}</h3>
                                  <p className="text-sm opacity-90">Risk Score: {message.triageData.risk_score}/100</p>
                                </div>
                              </div>
                              {message.triageData.emergency && (
                                <FaExclamationTriangle className="text-3xl animate-pulse" />
                              )}
                            </div>
                          </div>

                          {/* Predicted Conditions */}
                          {message.triageData.predicted_conditions?.length > 0 && (
                            <div className="p-4 border-b border-gray-200">
                              <h4 className="font-semibold text-gray-700 mb-3">🔍 Possible Conditions</h4>
                              <div className="space-y-2">
                                {message.triageData.predicted_conditions.map((condition, idx) => (
                                  <div key={idx} className="flex items-start gap-2 bg-blue-50 p-3 rounded-lg">
                                    <span className="font-bold text-blue-600">{idx + 1}.</span>
                                    <div className="flex-1">
                                      <p className="font-semibold text-gray-800">{condition.condition}</p>
                                      <p className="text-sm text-gray-600">Likelihood: {condition.probability_estimate}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Recommendations */}
                          {message.triageData.recommendations?.length > 0 && (
                            <div className="p-4 border-b border-gray-200">
                              <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                <FaHospital className="text-electric-teal" /> 
                                Recommendations
                              </h4>
                              <ul className="space-y-2">
                                {message.triageData.recommendations.map((rec, idx) => (
                                  <li key={idx} className="flex items-start gap-2">
                                    <span className="text-electric-teal mt-1">•</span>
                                    <span className="text-gray-700">{rec}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Disclaimer */}
                          <div className="p-4 bg-yellow-50">
                            <p className="text-xs text-gray-600 italic">{message.triageData.disclaimer}</p>
                          </div>

                          <span className="text-xs px-4 pb-2 block text-gray-500">
                            {new Date(message.timestamp).toLocaleTimeString(language === 'en' ? 'en-IN' : 'hi-IN', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                      ) : (
                        <div className="px-4 py-3 rounded-2xl rounded-bl-none bg-gray-200 text-gray-800">
                          <p className="whitespace-pre-line break-words">{message.content}</p>
                          <span className="text-xs mt-2 block text-gray-500">
                            {new Date(message.timestamp).toLocaleTimeString(language === 'en' ? 'en-IN' : 'hi-IN', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
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
                placeholder="Describe your symptoms (e.g., 'I have fever and cough for 3 days')"
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
