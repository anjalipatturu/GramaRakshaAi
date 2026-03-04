# Quick Test Guide - Medical Triage Chatbot

## Test Scenarios

### 1. Test LOW Risk (Score 0-25)
**Input**: "I have a mild headache"

**Expected Output**:
- Risk Level: LOW
- Risk Score: 15-25
- No emergency flag
- Recommendations for rest, hydration
- Follow-up questions about duration, other symptoms

---

### 2. Test MODERATE Risk (Score 26-50)
**Input**: "I have fever and body pain for 2 days"

**Expected Output**:
- Risk Level: MODERATE
- Risk Score: 30-45
- Possible conditions: Viral fever, Flu, etc.
- Recommendations for monitoring temperature, rest, hydration
- Advice on when to see a doctor

---

### 3. Test HIGH Risk (Score 51-75)
**Input**: "I have high fever (103°F) for 5 days with severe body pain"

**Expected Output**:
- Risk Level: HIGH
- Risk Score: 55-70
- Possible conditions: Dengue, Malaria, Severe infection
- Urgent doctor consultation recommended
- Multiple follow-up questions about other symptoms

---

### 4. Test CRITICAL/Emergency (Score 76-100)
**Input**: "I have chest pain and difficulty breathing"

**Expected Output**:
- Risk Level: CRITICAL
- Risk Score: 85-100
- Emergency: TRUE
- 🚨 Emergency alert displayed
- Immediate instruction to call 108
- Possible conditions: Heart attack, Pulmonary embolism
- Do NOT drive yourself message

---

### 5. Test Follow-up Questions
**Step 1**: "I have fever"
**Expected**: Follow-up questions about:
- How long?
- How high?
- Other symptoms?

**Step 2**: Click on a follow-up question or answer manually
**Expected**: Updated risk assessment with more information

---

### 6. Test Multi-language (Hindi)
**Input (Hindi)**: "मुझे बुखार है"

**Expected Output**:
- Same triage assessment
- Language detection working
- Proper Hindi character support

---

### 7. Test Voice Input
1. Click microphone button
2. Speak: "I have severe headache and vomiting"
3. **Expected**: 
   - Speech recognized
   - Triage assessment provided
   - Possible conditions: Migraine, Meningitis
   - High risk assessment

---

## Verification Checklist

- [ ] Risk score displays correctly (0-100)
- [ ] Risk level color coding works:
  - 🟢 Green for LOW
  - 🟡 Yellow for MODERATE
  - 🟠 Orange for HIGH
  - 🔴 Red for CRITICAL
- [ ] Emergency symptoms trigger immediate alert
- [ ] Follow-up questions are clickable
- [ ] Medical disclaimer appears on all responses
- [ ] No prescription drug names are provided
- [ ] Voice input works in all supported languages
- [ ] Quick reply buttons work for common symptoms
- [ ] Chat history is maintained in session

---

## Running the Tests

### Backend
```bash
cd backend
npm start
```
Server should start on port 5000

### Frontend (Development Mode)
```bash
cd frontend
npm run dev
```

### Frontend (Production Build)
```bash
cd frontend
npm run build
cd ../backend
npm start
```
Access at: http://localhost:5000

---

## Common Test Inputs

### Emergency Symptoms
- "chest pain radiating to left arm"
- "severe bleeding that won't stop"
- "unconscious person"
- "seizure happening now"
- "can't breathe properly"
- "stroke symptoms - face drooping"

### Non-Emergency Symptoms
- "cough and cold for 2 days"
- "stomach upset after eating"
- "back pain when sitting"
- "mild fever 99°F"
- "runny nose and sneezing"

### Incomplete Information (Should ask follow-ups)
- "not feeling well"
- "pain"
- "fever"
- "feeling dizzy"

---

## Expected JSON Structure

Every bot response should include:
```json
{
  "symptom_summary": "string",
  "predicted_conditions": [
    {
      "condition": "string",
      "probability_estimate": "High/Medium/Low"
    }
  ],
  "risk_score": 0-100,
  "risk_level": "LOW|MODERATE|HIGH|CRITICAL",
  "emergency": boolean,
  "recommendations": ["string"],
  "follow_up_questions": ["string"],
  "disclaimer": "string",
  "language": "en|hi|te",
  "sessionId": "uuid"
}
```

---

## Troubleshooting

### If AI doesn't respond:
1. Check GEMINI_API_KEY in backend/.env
2. Verify backend console for errors
3. Check network tab in browser DevTools

### If emergency detection fails:
- Backend has keyword matching as backup
- Keywords are language-specific
- Check console logs for emergency detection

### If UI doesn't update:
- Clear browser cache
- Rebuild frontend
- Check React DevTools for state updates

---

## Success Criteria

✅ All risk levels display correctly  
✅ Emergency symptoms trigger alerts  
✅ Follow-up questions are intelligent and contextual  
✅ No prescription drugs mentioned  
✅ Disclaimer always present  
✅ Multi-language support works  
✅ Voice input functional  
✅ UI is responsive and clear
