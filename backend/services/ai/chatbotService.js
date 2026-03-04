const { GoogleGenerativeAI } = require("@google/generative-ai");

class ChatbotService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
    
    this.languages = ['en', 'hi', 'te'];
    this.emergencyKeywords = {
      en: ['chest pain', 'breathless', 'heart attack', 'unconscious', 'severe bleeding', 'stroke', 'seizure', 'difficulty breathing'],
      hi: ['सीने में दर्द', 'सांस फूलना', 'हार्ट अटैक', 'बेहोश', 'गंभीर रक्तस्राव', 'लकवा', 'दौरा'],
      te: ['గుండె నొప్పి', 'ఊపిరి ఆడకపోవడం', 'గుండెపోటు', 'స్పృహ తప్పడం', 'తీవ్ర రక్తస్రావం', 'పక్షవాతం', 'మూర్ఛ']
    };
    
    this.systemPrompt = `You are an AI-powered Smart Medical Triage Assistant integrated into a healthcare website chatbot.

Your responsibilities:

1. Analyze user symptoms provided via text or voice input.
2. Ask intelligent follow-up questions if symptom information is incomplete.
3. Predict multiple possible medical conditions (top 3 most likely).
4. Calculate a Risk Score between 0–100 based on severity and symptom combination.
5. Classify Risk Level into one of:
   - LOW (0–25)
   - MODERATE (26–50)
   - HIGH (51–75)
   - CRITICAL (76–100)
6. Detect emergency symptoms immediately:
   - Chest pain
   - Difficulty breathing
   - Severe bleeding
   - Unconsciousness
   - Stroke symptoms
   - Seizures
If emergency symptoms are detected:
   - Set risk score above 85
   - Mark emergency as true
   - Clearly instruct the user to seek immediate medical care.

7. Provide intelligent recommendations including:
   - Immediate next steps
   - Home care guidance (if safe)
   - When to see a doctor
   - Preventive advice

8. Never provide prescription medication names or dosages.
9. Never claim to give a confirmed diagnosis.
10. Always include this disclaimer at the end:
   "This tool provides preliminary health information and is not a substitute for professional medical advice."

Respond STRICTLY in the following JSON format:

{
  "symptom_summary": "",
  "predicted_conditions": [
    {
      "condition": "",
      "probability_estimate": ""
    }
  ],
  "risk_score": 0,
  "risk_level": "",
  "emergency": false,
  "recommendations": [
    ""
  ],
  "follow_up_questions": [
    ""
  ],
  "disclaimer": "This tool provides preliminary health information and is not a substitute for professional medical advice."
}

Risk scoring logic guidelines:
- Mild symptoms (no fever, no pain) → score below 25
- Fever + mild pain → 30–45
- Persistent symptoms >3 days → add +15
- Severe pain, breathing issues, chest discomfort → 60+
- Life-threatening symptoms → 85–100`;
    
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

      // Quick emergency check
      const emergencyDetected = this.checkEmergency(message, language);
      
      // Try AI processing with timeout
      let triageData;
      try {
        const prompt = `${this.systemPrompt}

User message: "${message}"
Language: ${language}

Analyze the symptoms and provide a medical triage assessment in JSON format.`;

        // Set timeout for AI call
        const aiPromise = this.model.generateContent(prompt);
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('AI timeout')), 10000)
        );
        
        const result = await Promise.race([aiPromise, timeoutPromise]);
        const response = await result.response;
        const text = response.text();
        
        // Extract JSON from response
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          triageData = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('No JSON found in response');
        }
      } catch (aiError) {
        console.error('AI processing error:', aiError.message);
        // Use fallback logic-based triage
        triageData = this.generateFallbackTriage(message, emergencyDetected, language);
      }

      // Override emergency if detected by keywords
      if (emergencyDetected && triageData.risk_score < 85) {
        triageData.emergency = true;
        triageData.risk_score = Math.max(triageData.risk_score, 90);
        triageData.risk_level = "CRITICAL";
        triageData.recommendations.unshift("🚨 EMERGENCY: Call 108 immediately or visit the nearest emergency room!");
      }

      return {
        ...triageData,
        language
      };

    } catch (error) {
      console.error('Chatbot error:', error);
      return this.generateFallbackTriage(message, false, language);
    }
  }

  generateFallbackTriage(message, emergencyDetected, language) {
    const lowerMessage = message.toLowerCase();
    
    // Initialize with baseline score
    let riskScore = 0;
    let conditions = [];
    let recommendations = [];
    let followUpQuestions = [];
    let severity = {};

    // SYMPTOM DETECTION AND SCORING
    
    // Fever symptoms (contributes 10-20 points)
    if (lowerMessage.includes('fever') || lowerMessage.includes('temperature')) {
      riskScore += 10;
      severity.fever = true;
      conditions.push({ condition: "Viral Fever", probability_estimate: "Moderate" });
      conditions.push({ condition: "Flu", probability_estimate: "Moderate" });
      
      if (lowerMessage.includes('high fever') || lowerMessage.includes('103') || lowerMessage.includes('104')) {
        riskScore += 10;
        severity.highFever = true;
      }
      followUpQuestions.push("What is your body temperature?");
      followUpQuestions.push("How many days have you had fever?");
    }
    
    // Cough symptoms (contributes 5-15 points)
    if (lowerMessage.includes('cough')) {
      riskScore += 5;
      severity.cough = true;
      if (!conditions.some(c => c.condition.includes('Viral'))) {
        conditions.push({ condition: "Respiratory Infection", probability_estimate: "Moderate" });
      }
      if (lowerMessage.includes('severe cough') || lowerMessage.includes('blood cough')) {
        riskScore += 10;
        severity.severeCough = true;
      }
      followUpQuestions.push("Is the cough dry or with mucus?");
      followUpQuestions.push("How long have you been coughing?");
    }
    
    // Headache symptoms (contributes 3-12 points)
    if (lowerMessage.includes('headache') || lowerMessage.includes('head pain')) {
      riskScore += 3;
      severity.headache = true;
      if (lowerMessage.includes('severe headache') || lowerMessage.includes('worst headache')) {
        riskScore += 9;
        severity.severeHeadache = true;
      }
      followUpQuestions.push("Where is the pain located?");
      followUpQuestions.push("On a scale of 1-10, how severe is the headache?");
    }
    
    // Body pain/ache symptoms (contributes 5-15 points)
    if (lowerMessage.includes('body pain') || lowerMessage.includes('ache') || lowerMessage.includes('muscle pain')) {
      riskScore += 5;
      severity.bodyPain = true;
      if (lowerMessage.includes('severe') || lowerMessage.includes('unbearable')) {
        riskScore += 10;
        severity.severeBodyPain = true;
      }
      followUpQuestions.push("Which parts of your body are affected?");
    }
    
    // Throat symptoms (contributes 3-8 points)
    if (lowerMessage.includes('sore throat') || lowerMessage.includes('throat pain')) {
      riskScore += 3;
      severity.throatPain = true;
      conditions.push({ condition: "Pharyngitis", probability_estimate: "Moderate" });
      if (lowerMessage.includes('difficulty swallowing') || lowerMessage.includes('severe')) {
        riskScore += 5;
      }
    }
    
    // Nausea/Vomiting (contributes 8-15 points)
    if (lowerMessage.includes('nausea') || lowerMessage.includes('vomiting') || lowerMessage.includes('feel sick')) {
      riskScore += 8;
      severity.nausea = true;
      if (lowerMessage.includes('severe') || lowerMessage.includes('continuous')) {
        riskScore += 7;
        severity.severeNausea = true;
      }
      followUpQuestions.push("How many times have you vomited?");
    }
    
    // Diarrhea (contributes 5-12 points)
    if (lowerMessage.includes('diarrhea') || lowerMessage.includes('loose motion')) {
      riskScore += 5;
      severity.diarrhea = true;
      if (lowerMessage.includes('bloody') || lowerMessage.includes('severe')) {
        riskScore += 7;
        severity.severeDiarrhea = true;
      }
      followUpQuestions.push("How many times per day?");
    }
    
    // CRITICAL SYMPTOMS (Immediate high scoring)
    
    // Chest pain (contributes 40-50 points)
    if (lowerMessage.includes('chest pain') || lowerMessage.includes('chest discomfort')) {
      riskScore += 50;
      emergencyDetected = true;
      severity.chestPain = true;
      conditions = [
        { condition: "Acute Coronary Syndrome", probability_estimate: "High" },
        { condition: "Angina", probability_estimate: "Moderate" }
      ];
      followUpQuestions = [
        "Is the pain radiating to your arm or jaw?",
        "How long has the pain been lasting?"
      ];
    }
    
    // Difficulty breathing (contributes 35-45 points)
    if (lowerMessage.includes('difficulty breathing') || lowerMessage.includes('breathless') || lowerMessage.includes('shortness of breath')) {
      riskScore += 40;
      emergencyDetected = true;
      severity.difficultyBreathing = true;
      conditions.push({ condition: "Respiratory Distress", probability_estimate: "High" });
      followUpQuestions.push("Did this start suddenly?");
    }
    
    // Severe bleeding (contributes 45-50 points)
    if (lowerMessage.includes('bleeding') || lowerMessage.includes('blood loss')) {
      riskScore += 45;
      emergencyDetected = true;
      severity.bleeding = true;
      followUpQuestions.push("How much blood loss?");
    }
    
    // Unconsciousness/Fainting (contributes 45-50 points)
    if (lowerMessage.includes('unconscious') || lowerMessage.includes('fainted') || lowerMessage.includes('passed out')) {
      riskScore += 50;
      emergencyDetected = true;
      severity.unconscious = true;
      conditions.push({ condition: "Loss of Consciousness", probability_estimate: "High" });
    }
    
    // Seizures (contributes 45-50 points)
    if (lowerMessage.includes('seizure') || lowerMessage.includes('convulsion')) {
      riskScore += 50;
      emergencyDetected = true;
      severity.seizure = true;
      conditions.push({ condition: "Seizure Disorder", probability_estimate: "High" });
    }
    
    // DURATION MODIFIER
    if (lowerMessage.match(/\d+\s*(day|days|week|weeks|month|months)/)) {
      const match = lowerMessage.match(/(\d+)\s*(day|days|week|weeks|month|months)/);
      if (match) {
        const duration = parseInt(match[1]);
        const unit = match[2];
        
        // Persistent symptoms increase risk
        if ((unit.includes('day') && duration > 3) || unit.includes('week') || unit.includes('month')) {
          riskScore += 10;
        }
        if (unit.includes('week') || unit.includes('month')) {
          riskScore += 5;
        }
      }
    }
    
    // Cap the score at 100
    riskScore = Math.min(100, Math.max(0, riskScore));
    
    // DEFAULT CONDITIONS if none detected
    if (conditions.length === 0) {
      conditions.push({ condition: "General Illness", probability_estimate: "Low" });
      if (followUpQuestions.length < 2) {
        followUpQuestions.push("Can you describe your symptoms in detail?");
        followUpQuestions.push("When did these symptoms start?");
      }
    }
    
    // GENERATE RECOMMENDATIONS BASED ON RISK LEVEL
    let riskLevel;
    
    if (riskScore >= 76) {
      // CRITICAL (76-100): Need urgent medical care
      riskLevel = "CRITICAL";
      recommendations = [
        "🚨 CRITICAL: You need immediate medical attention!",
        "Call 108 (Emergency) or go to nearest hospital immediately",
        "Do not delay - seek emergency care right now",
        "If chest pain or breathing difficulty - call emergency immediately",
        "Have someone accompany you to hospital"
      ];
    } 
    else if (riskScore >= 51) {
      // HIGH (51-75): Need to consult doctor
      riskLevel = "HIGH";
      recommendations = [
        "⚠️ You need to consult a doctor soon",
        "Schedule a doctor appointment as soon as possible (within 24 hours)",
        "Do not ignore these symptoms",
        "Get medical evaluation to rule out serious conditions",
        "Avoid self-medication - consult qualified doctor",
        "Monitor your symptoms closely",
        "If symptoms worsen, seek immediate medical care"
      ];
    } 
    else if (riskScore >= 26) {
      // MODERATE (26-50): Take rest
      riskLevel = "MODERATE";
      recommendations = [
        "⚠️ Take adequate rest and monitor your condition",
        "Get 7-8 hours of sleep daily",
        "Stay hydrated - drink plenty of water",
        "Avoid strenuous activities",
        "Eat nutritious food",
        "If symptoms persist beyond 3 days, consult a doctor",
        "Consider OTC medication as needed (Paracetamol for fever/pain)"
      ];
    } 
    else {
      // LOW (0-25): No need to worry, take medication
      riskLevel = "LOW";
      recommendations = [
        "✅ No need to worry - appears to be mild",
        "Take OTC medication as needed",
        "Get adequate rest",
        "Stay hydrated",
        "Maintain hygiene",
        "Symptoms should improve in 2-3 days",
        "Consult doctor if symptoms persist"
      ];
    }
    
    // Ensure we have recommendations
    if (recommendations.length === 0) {
      recommendations.push("Monitor your condition closely");
    }
    
    // Ensure we have follow-up questions
    if (followUpQuestions.length === 0) {
      followUpQuestions = [
        "How long have you been experiencing these symptoms?",
        "Have you taken any medication?",
        "Do you have any chronic diseases?"
      ];
    }
    
    // Limit to 3 questions and 5 recommendations
    followUpQuestions = followUpQuestions.slice(0, 3);
    recommendations = recommendations.slice(0, 5);

    return {
      symptom_summary: message,
      predicted_conditions: conditions.slice(0, 3),
      risk_score: riskScore,
      risk_level: riskLevel,
      emergency: emergencyDetected || riskScore >= 85,
      recommendations: recommendations,
      follow_up_questions: followUpQuestions,
      disclaimer: "This tool provides preliminary health information and is not a substitute for professional medical advice.",
      language
    };
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
