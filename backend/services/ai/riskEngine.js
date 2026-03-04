class RiskEngine {
  constructor() {
    this.symptomWeights = {
      // Respiratory
      'cough': 5,
      'difficulty_breathing': 25,
      'chest_pain': 30,
      'wheezing': 15,
      
      // Cardiovascular
      'palpitations': 15,
      'chest_tightness': 25,
      'swollen_feet': 10,
      
      // Neurological
      'headache': 5,
      'dizziness': 10,
      'confusion': 25,
      'numbness': 15,
      
      // Gastrointestinal
      'nausea': 5,
      'vomiting': 10,
      'abdominal_pain': 15,
      'diarrhea': 10,
      
      // General
      'fever': 10,
      'fatigue': 5,
      'body_ache': 5,
      'loss_appetite': 5,
      
      // Critical
      'unconscious': 40,
      'seizure': 35,
      'severe_bleeding': 40,
      'severe_burn': 35
    };

    this.emergencyPatterns = [
      {
        symptoms: ['chest_pain', 'difficulty_breathing'],
        condition: 'Possible Heart Attack',
        urgency: 'emergency'
      },
      {
        symptoms: ['severe_headache', 'confusion', 'numbness'],
        condition: 'Possible Stroke',
        urgency: 'emergency'
      },
      {
        symptoms: ['unconscious', 'difficulty_breathing'],
        condition: 'Medical Emergency',
        urgency: 'emergency'
      },
      {
        symptoms: ['severe_bleeding', 'dizziness'],
        condition: 'Severe Blood Loss',
        urgency: 'emergency'
      }
    ];
  }

  calculateRisk(userData, symptoms) {
    let riskScore = 0;
    const breakdown = {
      ageRisk: 0,
      genderRisk: 0,
      symptomRisk: 0,
      conditionRisk: 0
    };

    // Age-based risk
    if (userData.age < 5) breakdown.ageRisk = 15;
    else if (userData.age > 60) breakdown.ageRisk = 20;
    else if (userData.age > 45) breakdown.ageRisk = 10;
    riskScore += breakdown.ageRisk;

    // Gender-specific risks
    if (userData.gender === 'female' && userData.age > 40) {
      breakdown.genderRisk = 5;
      riskScore += breakdown.genderRisk;
    }

    // Symptom-based scoring
    symptoms.forEach(symptom => {
      const baseWeight = this.symptomWeights[symptom.name] || 5;
      const severityMultiplier = (symptom.severity || 5) / 5;
      const durationMultiplier = this.getDurationMultiplier(symptom.duration);
      
      const symptomScore = baseWeight * severityMultiplier * durationMultiplier;
      breakdown.symptomRisk += symptomScore;
    });

    riskScore += Math.min(breakdown.symptomRisk, 50);

    // Pre-existing conditions
    if (userData.existingConditions && userData.existingConditions.length > 0) {
      userData.existingConditions.forEach(condition => {
        if (condition !== 'none') {
          breakdown.conditionRisk += 10;
        }
      });
      riskScore += Math.min(breakdown.conditionRisk, 25);
    }

    // Check for emergency patterns
    const emergencyDetected = this.checkEmergencyPatterns(symptoms);
    
    if (emergencyDetected) {
      riskScore = Math.max(riskScore, 75);
    }

    riskScore = Math.min(Math.max(riskScore, 0), 100);

    // Determine risk level
    let riskLevel;
    if (riskScore <= 25) riskLevel = 'Low';
    else if (riskScore <= 50) riskLevel = 'Moderate';
    else if (riskScore <= 75) riskLevel = 'High';
    else riskLevel = 'Critical';

    return {
      score: Math.round(riskScore),
      level: riskLevel,
      breakdown,
      emergencyDetected,
      emergencyType: emergencyDetected ? this.getEmergencyType(symptoms) : null
    };
  }

  getDurationMultiplier(duration) {
    const durations = {
      'few_hours': 1,
      'one_day': 1.2,
      'few_days': 1.5,
      'one_week': 1.8,
      'more_week': 2
    };
    return durations[duration] || 1;
  }

  checkEmergencyPatterns(symptoms) {
    const symptomNames = symptoms.map(s => s.name);
    
    return this.emergencyPatterns.some(pattern => 
      pattern.symptoms.every(s => symptomNames.includes(s))
    );
  }

  getEmergencyType(symptoms) {
    const symptomNames = symptoms.map(s => s.name);
    const pattern = this.emergencyPatterns.find(p => 
      p.symptoms.every(s => symptomNames.includes(s))
    );
    return pattern ? pattern.condition : 'Emergency Detected';
  }

  generateRecommendations(riskLevel, symptoms, userData) {
    const recommendations = [];

    if (riskLevel === 'Critical' || riskLevel === 'High') {
      recommendations.push('🚨 Immediate medical attention required');
      recommendations.push('📞 Call 108 ambulance immediately');
      recommendations.push('🏥 Nearest PHC: Please visit or call for guidance');
    }

    if (riskLevel === 'Moderate') {
      recommendations.push('👨‍⚕️ Consult a doctor within 24 hours');
      recommendations.push('💊 Follow symptomatic treatment');
      recommendations.push('📱 Contact your ASHA worker for guidance');
    }

    if (riskLevel === 'Low') {
      recommendations.push('🏠 Home care with monitoring');
      recommendations.push('💧 Stay hydrated and rest');
      recommendations.push('📞 Contact if symptoms worsen');
    }

    symptoms.forEach(symptom => {
      if (symptom.name === 'fever' && symptom.severity > 7) {
        recommendations.push('🌡️ Monitor temperature every 4 hours');
      }
      if (symptom.name === 'difficulty_breathing') {
        recommendations.push('💨 Sit upright, do not lie flat');
      }
    });

    if (userData.age > 60) {
      recommendations.push('👴 Elderly care: Ensure family member present');
    }

    return [...new Set(recommendations)];
  }
}

module.exports = new RiskEngine();
