import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaRobot, FaPaperPlane, FaMicrophone, FaStopCircle, FaSmile, FaExclamationTriangle, FaHospital, FaQuestionCircle, FaHeartbeat, FaVolumeUp, FaVolumeMute, FaGlobe, FaImage } from 'react-icons/fa';
import { useApp } from '../context/AppContext';
import toast from 'react-hot-toast';

const ChatbotEnhanced = () => {
  const { language, setLanguage, sendChatMessage, uploadImage, user } = useApp();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [sessionId, setSessionId] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [loading, setLoading] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const messagesEndRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);
  const imageInputRef = useRef(null);

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

  // Text-to-Speech function
  const speakText = (text, isEmergency = false) => {
    if (!voiceEnabled || !text) return;
    
    // Cancel any ongoing speech
    synthRef.current.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Set language
    utterance.lang = language === 'hi' ? 'hi-IN' : language === 'te' ? 'te-IN' : 'en-IN';
    
    // Emergency voice settings
    if (isEmergency) {
      utterance.rate = 1.1; // Slightly faster
      utterance.pitch = 1.2; // Higher pitch for urgency
      utterance.volume = 1.0; // Max volume
    } else {
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      utterance.volume = 0.8;
    }
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    synthRef.current.speak(utterance);
  };

  // Stop speaking function
  const stopSpeaking = () => {
    synthRef.current.cancel();
    setIsSpeaking(false);
  };

  // Toggle voice assistant
  const toggleVoice = () => {
    const newState = !voiceEnabled;
    setVoiceEnabled(newState);
    if (!newState) {
      stopSpeaking();
    }
    toast.success(newState ? '🔊 Voice enabled' : '🔇 Voice disabled');
  };

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

      // Speak the response if voice is enabled
      if (voiceEnabled && response.recommendations && response.recommendations.length > 0) {
        const spokenText = `${response.risk_level} risk detected. ${response.recommendations[0]}`;
        speakText(spokenText, response.emergency);
      }

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

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!user?._id) {
      toast.error('Please login to upload an image');
      event.target.value = '';
      return;
    }

    try {
      setUploadingImage(true);
      const uploaded = await uploadImage(file, 'other');

      setMessages((prev) => [...prev, {
        role: 'user',
        content: `📷 Uploaded image: ${file.name}`,
        timestamp: new Date()
      }]);

      const analysisText = uploaded?.image?.analysis?.possibleIssue
        ? `Image uploaded successfully. Possible issue: ${uploaded.image.analysis.possibleIssue}`
        : 'Image uploaded successfully.';

      setMessages((prev) => [...prev, {
        role: 'bot',
        content: analysisText,
        timestamp: new Date()
      }]);

      toast.success('✅ Image uploaded successfully');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Image upload failed');
    } finally {
      setUploadingImage(false);
      event.target.value = '';
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
      setInputMessage(''); // Clear input when starting
      toast.success('🎤 Listening... Speak now!');
    };

    recognition.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }
      
      // Show text in real-time as user speaks (interim results)
      if (interimTranscript) {
        setInputMessage(interimTranscript);
      }
      
      // Set final transcribed text
      if (finalTranscript) {
        setInputMessage(finalTranscript);
        toast.success('✅ Voice captured: ' + finalTranscript.substring(0, 30) + '...');
      }
    };

    recognition.onerror = (event) => {
      toast.error(t.voiceError);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
      // Auto-send the message after voice input
      if (inputMessage.trim()) {
        setTimeout(() => {
          handleSendMessage();
        }, 500);
      }
    };

    recognition.start();
  };

  return (
    <div className="min-h-screen bg-[#F4F9FB] py-20">
      <div className="container mx-auto px-6 max-w-4xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="rounded-2xl overflow-hidden shadow-2xl border border-[#00A896]/20 bg-white"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#0B3C5D] via-[#00A896] to-[#0B3C5D] p-6 text-white">
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
                {/* Voice Toggle Button */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleVoice}
                  className={`px-3 py-2 rounded-lg font-semibold transition-all ${
                    voiceEnabled 
                      ? 'bg-white text-[#0B3C5D]' 
                      : 'bg-gray-300 text-gray-600'
                  }`}
                  title={voiceEnabled ? 'Voice Assistant On' : 'Voice Assistant Off'}
                >
                  {voiceEnabled ? <FaVolumeUp className="w-5 h-5" /> : <FaVolumeMute className="w-5 h-5" />}
                </motion.button>

                {/* Language Buttons */}
                {['en', 'hi', 'te'].map(lang => (
                  <motion.button
                    key={lang}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setLanguage(lang)}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                      language === lang
                        ? 'bg-white text-[#0B3C5D]'
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
          <div className="h-96 overflow-y-auto p-6 space-y-4 bg-[#F4F9FB]">
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
                    <div className="max-w-xs lg:max-w-md xl:max-w-lg px-4 py-3 rounded-2xl bg-gradient-to-r from-[#0B3C5D] to-[#00A896] text-white rounded-br-none shadow-lg">
                      <p className="whitespace-pre-line break-words">{message.content}</p>
                      <span className="text-xs mt-2 block text-white/80">
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
                            message.triageData.risk_level === 'CRITICAL' ? 'bg-[#D90429]' :
                            message.triageData.risk_level === 'HIGH' ? 'bg-[#FF7A00]' :
                            message.triageData.risk_level === 'MODERATE' ? 'bg-[#00A896]' :
                            'bg-[#0B3C5D]'
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
                              <h4 className="font-semibold text-[#1B1B1B] mb-3">🔍 Possible Conditions</h4>
                              <div className="space-y-2">
                                {message.triageData.predicted_conditions.map((condition, idx) => (
                                  <div key={idx} className="flex items-start gap-2 bg-[#F4F9FB] p-3 rounded-lg">
                                    <span className="font-bold text-[#00A896]">{idx + 1}.</span>
                                    <div className="flex-1">
                                      <p className="font-semibold text-[#1B1B1B]">{condition.condition}</p>
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
                              <h4 className="font-semibold text-[#1B1B1B] mb-3 flex items-center gap-2">
                                <FaHospital className="text-[#00A896]" /> 
                                Recommendations
                              </h4>
                              <ul className="space-y-2">
                                {message.triageData.recommendations.map((rec, idx) => (
                                  <li key={idx} className="flex items-start gap-2">
                                    <span className="text-[#00A896] mt-1">•</span>
                                    <span className="text-[#1B1B1B]">{rec}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Disclaimer */}
                          <div className="p-4 bg-[#FFF4E8] border-b border-[#FF7A00]/20">
                            <p className="text-xs text-gray-600 italic">{message.triageData.disclaimer}</p>
                          </div>

                          {/* Voice Control for this message */}
                          <div className="px-4 pb-2 pt-2 flex items-center justify-between">
                            <span className="text-xs text-gray-500">
                              {new Date(message.timestamp).toLocaleTimeString(language === 'en' ? 'en-IN' : 'hi-IN', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                            {voiceEnabled && (
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => {
                                  const text = `${message.triageData.risk_level} risk detected. ${message.triageData.recommendations[0]}`;
                                  speakText(text, message.triageData.emergency);
                                }}
                                className="text-[#00A896] hover:text-[#0B3C5D] transition-colors"
                                title="Read aloud"
                              >
                                <FaVolumeUp className="w-4 h-4" />
                              </motion.button>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="px-4 py-3 rounded-2xl rounded-bl-none bg-white border border-gray-200 text-[#1B1B1B]">
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
                  <div className="px-4 py-3 rounded-2xl rounded-bl-none bg-white border border-gray-200">
                    <motion.div className="flex gap-2">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          animate={{ y: [0, -10, 0] }}
                          transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.2 }}
                          className="w-2 h-2 bg-[#0B3C5D] rounded-full"
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
            <div className="px-6 py-4 bg-white border-t border-[#00A896]/20">
              <p className="text-sm font-semibold text-[#0B3C5D] mb-3 flex items-center gap-2">
                <FaSmile className="text-[#FF7A00]" /> {t.quickReplies}
              </p>
              <div className="flex flex-wrap gap-2">
                {(quickReplies[language] || quickReplies.en).map((reply, idx) => (
                  <motion.button
                    key={idx}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSendMessage(reply)}
                    className="px-4 py-2 bg-gradient-to-r from-[#0B3C5D] to-[#00A896] text-white rounded-full text-sm font-semibold hover:shadow-lg transition-all"
                  >
                    {reply}
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-[#00A896]/20">
            <div className="flex items-center justify-between mb-3 gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <FaGlobe className="text-[#0B3C5D]" />
                {['en', 'hi', 'te'].map((lang) => (
                  <motion.button
                    key={`chat-lang-${lang}`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setLanguage(lang)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                      language === lang
                        ? 'bg-[#0B3C5D] text-white shadow'
                        : 'bg-white text-[#0B3C5D] border border-[#0B3C5D]/20'
                    }`}
                  >
                    {lang.toUpperCase()}
                  </motion.button>
                ))}
              </div>

              <div>
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => imageInputRef.current?.click()}
                  disabled={uploadingImage || loading}
                  className="px-3 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-[#FF7A00] to-[#00A896] text-white disabled:opacity-50"
                  title="Upload image"
                >
                  <span className="inline-flex items-center gap-1">
                    <FaImage /> {uploadingImage ? 'Uploading...' : 'Upload Image'}
                  </span>
                </motion.button>
              </div>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Describe your symptoms (e.g., 'I have fever and cough for 3 days')"
                disabled={loading}
                className="flex-1 px-4 py-3 rounded-full border-2 border-[#00A896]/40 focus:border-[#0B3C5D] focus:ring focus:ring-[#00A896]/30 transition-all disabled:opacity-50 text-[#1B1B1B]"
              />
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleVoiceInput}
                disabled={loading}
                className={`p-3 rounded-full transition-all ${
                  isListening
                    ? 'bg-[#D90429] text-white animate-pulse'
                    : 'bg-gradient-to-r from-[#FF7A00] to-[#FF7A00] text-white'
                } disabled:opacity-50`}
                title="Voice input"
              >
                {isListening ? <FaStopCircle /> : <FaMicrophone />}
              </motion.button>

              {/* Stop Speaking Button */}
              {isSpeaking && (
                <motion.button
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={stopSpeaking}
                  className="p-3 bg-[#D90429] text-white rounded-full animate-pulse"
                  title="Stop speaking"
                >
                  <FaStopCircle />
                </motion.button>
              )}

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSendMessage()}
                disabled={!inputMessage.trim() || loading}
                className="p-3 bg-gradient-to-r from-[#0B3C5D] to-[#00A896] text-white rounded-full transition-all disabled:opacity-50"
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
