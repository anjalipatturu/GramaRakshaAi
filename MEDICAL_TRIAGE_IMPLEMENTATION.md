# Medical Triage Assistant Implementation

## Overview
The chatbot has been upgraded to a **Smart Medical Triage Assistant** powered by Google's Gemini AI, capable of analyzing symptoms and providing intelligent health assessments.

## Key Features Implemented

### 1. **Symptom Analysis**
- Analyzes user symptoms from text or voice input
- Asks intelligent follow-up questions when information is incomplete
- Provides comprehensive symptom summaries

### 2. **Medical Predictions**
- Predicts top 3 most likely medical conditions
- Provides probability estimates for each condition
- Uses AI-powered inference based on symptom combinations

### 3. **Risk Assessment**
- **Risk Score**: 0-100 scale based on symptom severity
- **Risk Levels**:
  - **LOW** (0-25): Mild symptoms, minimal concern
  - **MODERATE** (26-50): Requires attention
  - **HIGH** (51-75): Urgent medical consultation needed
  - **CRITICAL** (76-100): Emergency medical care required

### 4. **Emergency Detection**
Automatically detects life-threatening symptoms:
- Chest pain
- Difficulty breathing
- Severe bleeding
- Unconsciousness
- Stroke symptoms
- Seizures

When detected:
- Risk score automatically set above 85
- Emergency flag set to `true`
- User alerted to call 108 immediately

### 5. **Intelligent Recommendations**
Provides:
- Immediate next steps
- Home care guidance (when safe)
- When to see a doctor
- Preventive advice

### 6. **Safety Features**
- Never provides prescription medication names or dosages
- Never claims to give confirmed diagnoses
- Always includes medical disclaimer
- Multi-language support (English, Hindi, Telugu)

## Response Format

```json
{
  "symptom_summary": "Brief description of reported symptoms",
  "predicted_conditions": [
    {
      "condition": "Condition name",
      "probability_estimate": "High/Medium/Low"
    }
  ],
  "risk_score": 0-100,
  "risk_level": "LOW|MODERATE|HIGH|CRITICAL",
  "emergency": true/false,
  "recommendations": [
    "Actionable recommendation 1",
    "Actionable recommendation 2"
  ],
  "follow_up_questions": [
    "Intelligent follow-up question 1",
    "Intelligent follow-up question 2"
  ],
  "disclaimer": "This tool provides preliminary health information and is not a substitute for professional medical advice."
}
```

## UI Features

### Visual Risk Indicators
- **Color-coded risk levels**:
  - 🟢 Green: LOW risk
  - 🟡 Yellow: MODERATE risk
  - 🟠 Orange: HIGH risk
  - 🔴 Red: CRITICAL risk

### Interactive Elements
- Clickable follow-up questions for easy response
- Emergency alerts with visual warnings
- Symptom quick-reply buttons for common conditions
- Voice input support with multilingual recognition

### Information Display
- 📋 Symptom Summary section
- 🔍 Possible Conditions with likelihood
- 🏥 Recommendations with actionable steps
- ❓ Follow-up Questions as clickable buttons
- ⚠️ Medical Disclaimer prominently displayed

## Risk Scoring Logic

- **Mild symptoms** (no fever, no pain) → Score below 25
- **Fever + mild pain** → 30-45
- **Persistent symptoms >3 days** → Add +15
- **Severe pain, breathing issues, chest discomfort** → 60+
- **Life-threatening symptoms** → 85-100

## Files Modified

### Backend
1. **`backend/services/ai/chatbotService.js`**
   - Integrated Google Gemini AI
   - Implemented medical triage system prompt
   - Added risk scoring logic
   - Enhanced emergency detection

2. **`backend/routes/chatbot.routes.js`**
   - Updated to handle triage response format
   - Stores full triage data in chat logs
   - Enhanced emergency logging

### Frontend
3. **`frontend/src/pages/ChatbotEnhanced.js`**
   - Complete UI redesign for triage display
   - Risk-level color coding
   - Interactive follow-up questions
   - Enhanced emergency alerts
   - Updated quick replies to common symptoms

## Usage Example

**User**: "I have chest pain and difficulty breathing"

**AI Response**:
```
Risk Level: CRITICAL
Risk Score: 95/100

Symptom Summary: Patient reports chest pain with difficulty breathing

Possible Conditions:
1. Acute Coronary Syndrome - High likelihood
2. Pulmonary Embolism - Medium likelihood
3. Panic Attack - Low likelihood

Recommendations:
• 🚨 EMERGENCY: Call 108 immediately or visit nearest emergency room!
• Do not drive yourself
• Sit upright and try to stay calm
• Have someone with you at all times

Follow-up Questions:
• Is the chest pain radiating to your arm or jaw?
• Did this start suddenly or gradually?
• Do you have any history of heart disease?
```

## Testing

To test the implementation:

1. **Build frontend**:
   ```bash
   cd frontend
   npm run build
   ```

2. **Start backend**:
   ```bash
   cd backend
   npm start
   ```

3. **Access chatbot**:
   - Navigate to `http://localhost:5000`
   - Click on "AI Chatbot" in navigation
   - Try sample symptoms like:
     - "I have fever for 3 days"
     - "Chest pain"
     - "Headache and nausea"

## Disclaimer
This is a preliminary health assessment tool. It does not replace professional medical advice, diagnosis, or treatment. Always consult healthcare professionals for medical concerns.
