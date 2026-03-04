class ChatbotService {
  constructor() {
    this.languages = ['en', 'hi', 'te'];
    this.emergencyKeywords = {
      en: ['chest pain', 'breathless', 'heart attack', 'unconscious', 'severe bleeding', 'stroke'],
      hi: ['सीने में दर्द', 'सांस फूलना', 'हार्ट अटैक', 'बेहोश', 'गंभीर रक्तस्राव', 'लकवा'],
      te: ['గుండె నొప్పి', 'ఊపిరి ఆడకపోవడం', 'గుండెపోటు', 'స్పృహ తప్పడం', 'తీవ్ర రక్తస్రావం', 'పక్షవాతం']
    };
    
    this.responses = {
      en: this.getEnglishResponses(),
      hi: this.getHindiResponses(),
      te: this.getTeluguResponses()
    };
  }

  getEnglishResponses() {
    return {
      greeting: 'Namaste! I am GramaRaksha AI, your rural health assistant. How can I help you today?',
      schemes: 'Government health schemes you can benefit from:\n• Ayushman Bharat\n• PMJAY\n• Janani Suraksha Yojana\n• Rashtriya Bal Swasthya Karyakram',
      phc: 'Your nearest Primary Health Centre is in {village}. Distance: {distance}km. Contact: {phone}',
      maternal: 'Maternal health services available:\n• Free checkups\n• Vaccination\n• Nutrition support\n• 108 ambulance for emergencies',
      child: 'Child health services:\n• Vaccination schedule\n• Growth monitoring\n• Nutrition supplements',
      elderly: 'Elderly care:\n• Regular health checkups\n• Medicine delivery\n• Home care guidance',
      emergency: '🚨 EMERGENCY DETECTED! Please call 108 immediately or contact your ASHA worker.',
      disclaimer: '⚠️ I am an AI assistant. For medical emergencies, please contact healthcare professionals.'
    };
  }

  getHindiResponses() {
    return {
      greeting: 'नमस्ते! मैं ग्रामरक्षा एआई, आपका ग्रामीण स्वास्थ्य सहायक हूं। आज मैं आपकी कैसे मदद कर सकता हूं?',
      schemes: 'सरकारी स्वास्थ्य योजनाएं:\n• आयुष्मान भारत\n• पीएमजेएवाई\n• जननी सुरक्षा योजना\n• राष्ट्रीय बाल स्वास्थ्य कार्यक्रम',
      phc: 'आपका निकटतम प्राथमिक स्वास्थ्य केंद्र {village} में है। दूरी: {distance}किमी। संपर्क: {phone}',
      maternal: 'मातृ स्वास्थ्य सेवाएं:\n• मुफ्त जांच\n• टीकाकरण\n• पोषण सहायता\n• आपातकालीन 108 एंबुलेंस',
      child: 'बाल स्वास्थ्य सेवाएं:\n• टीकाकरण कार्यक्रम\n• विकास निगरानी\n• पोषण पूरक',
      elderly: 'वरिष्ठ नागरिक देखभाल:\n• नियमित स्वास्थ्य जांच\n• दवा वितरण\n• घरेलू देखभाल मार्गदर्शन',
      emergency: '🚨 आपातकाल! कृपया तुरंत 108 पर कॉल करें या अपनी आशा कार्यकर्ता से संपर्क करें।',
      disclaimer: '⚠️ मैं एक एआई सहायक हूं। चिकित्सा आपात स्थिति के लिए कृपया स्वास्थ्य पेशेवरों से संपर्क करें।'
    };
  }

  getTeluguResponses() {
    return {
      greeting: 'నమస్కారం! నేను గ్రామరక్ష AI, మీ గ్రామీణ ఆరోగ్య సహాయకుడిని. ఈరోజు నేను మీకు ఎలా సహాయపడగలను?',
      schemes: 'ప్రభుత్వ ఆరోగ్య పథకాలు:\n• ఆయుష్మాన్ భారత్\n• PMJAY\n• జననీ సురక్ష యోజన\n• రాష్ట్రీయ బాల స్వాస్థ్య కార్యక్రమ్',
      phc: 'మీ సమీప ప్రాథమిక ఆరోగ్య కేంద్రం {village}లో ఉంది. దూరం: {distance}కి.మీ. సంప్రదించండి: {phone}',
      maternal: 'మాతృ ఆరోగ్య సేవలు:\n• ఉచిత పరీక్షలు\n• టీకాలు\n• పోషకాహార సహాయం\n• అత్యవసర 108 యాంబులెన్స్',
      child: 'శిశు ఆరోగ్య సేవలు:\n• టీకా షెడ్యూల్\n• పెరుగుదల పర్యవేక్షణ\n• పోషకాహార సప్లిమెంట్స్',
      elderly: 'వృద్ధుల సంరక్షణ:\n• క్రమ ఆరోగ్య పరీక్షలు\n• మందుల డెలివరీ\n• ఇంటి సంరక్షణ మార్గదర్శనం',
      emergency: '🚨 అత్యవసర పరిస్థితి! వెంటనే 108కు కాల్ చేయండి లేదా మీ ఆశా వర్కర్ను సంప్రదించండి.',
      disclaimer: '⚠️ నేను AI సహాయకుడిని. వైద్య అత్యవసర పరిస్థితులకు, దయచేసి ఆరోగ్య నిపుణులను సంప్రదించండి.'
    };
  }

  async processMessage(message, language = 'en', userId = null, context = {}) {
    try {
      if (!language) {
        language = this.detectLanguage(message);
      }

      const emergencyDetected = this.checkEmergency(message, language);
      
      if (emergencyDetected) {
        return {
          response: this.responses[language].emergency,
          emergency: true,
          action: 'call_108',
          language
        };
      }

      const intent = this.detectIntent(message, language);
      let response = this.generateResponse(intent, language, context);

      if (intent !== 'greeting' && intent !== 'emergency') {
        response += '\n\n' + this.responses[language].disclaimer;
      }

      return {
        response,
        intent,
        language,
        emergency: false
      };

    } catch (error) {
      console.error('Chatbot error:', error);
      return {
        response: 'I apologize, I encountered an error. Please try again or contact your ASHA worker.',
        error: true,
        language
      };
    }
  }

  detectLanguage(message) {
    const devanagari = /[\u0900-\u097F]/;
    const telugu = /[\u0C00-\u0C7F]/;
    
    if (devanagari.test(message)) return 'hi';
    if (telugu.test(message)) return 'te';
    return 'en';
  }

  checkEmergency(message, language) {
    const keywords = this.emergencyKeywords[language] || this.emergencyKeywords.en;
    const lowerMessage = message.toLowerCase();
    
    return keywords.some(keyword => 
      lowerMessage.includes(keyword.toLowerCase())
    );
  }

  detectIntent(message, language) {
    const lowerMessage = message.toLowerCase();
    const intents = {
      greeting: ['hello', 'hi', 'namaste', 'नमस्ते', 'హాయ్', 'namaskaram'],
      schemes: ['scheme', 'yojana', 'योजना', 'పథకం', 'government', 'sarkari'],
      phc: ['phc', 'hospital', 'clinic', 'dispensary', 'अस्पताल', 'ఆసుపత్రి'],
      maternal: ['pregnancy', 'pregnant', 'mother', 'maternal', 'गर्भवती', 'గర్భిణీ'],
      child: ['child', 'baby', 'vaccination', 'बच्चा', 'పిల్లలు'],
      elderly: ['elderly', 'old', 'aged', 'बुजुर्ग', 'వృద్ధులు'],
      symptom: ['symptom', 'fever', 'cough', 'pain', 'लक्षण', 'రోగలక్షణం']
    };

    for (const [intent, keywords] of Object.entries(intents)) {
      if (keywords.some(keyword => lowerMessage.includes(keyword))) {
        return intent;
      }
    }

    return 'general';
  }

  generateResponse(intent, language, context) {
    const responses = this.responses[language] || this.responses.en;
    
    switch(intent) {
      case 'greeting':
        return responses.greeting;
      case 'schemes':
        return responses.schemes;
      case 'phc':
        if (context.village) {
          return responses.phc
            .replace('{village}', context.village.name)
            .replace('{distance}', context.village.phcDistance || '5')
            .replace('{phone}', context.village.phcPhone || '108');
        }
        return 'Please share your village name to get PHC details.';
      case 'maternal':
        return responses.maternal;
      case 'child':
        return responses.child;
      case 'elderly':
        return responses.elderly;
      default:
        return 'I understand you have a health query. Could you please provide more details or use the symptom checker for better assistance?';
    }
  }
}

module.exports = new ChatbotService();
