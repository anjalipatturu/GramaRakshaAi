import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';

const FOLLOW_UP_QUESTIONS = {
  fever: [
    { id: 'high_temp', text: 'Is your temperature very high (103°F / 39.4°C or more)?' },
    { id: 'fever_days', text: 'Has the fever lasted more than 3 days?' },
    { id: 'dehydration', text: 'Are you unable to drink fluids or urinate normally?' }
  ],
  cough: [
    { id: 'blood_cough', text: 'Are you coughing up blood?' },
    { id: 'breathless', text: 'Do you feel short of breath while resting?' },
    { id: 'chest_tightness', text: 'Do you have chest tightness with cough?' }
  ],
  chest_pain: [
    { id: 'radiating_pain', text: 'Does pain spread to jaw/left arm/back?' },
    { id: 'sweating', text: 'Are you sweating, nauseated, or feeling faint?' },
    { id: 'rest_pain', text: 'Does pain continue even at rest for 10+ minutes?' }
  ],
  difficulty_breathing: [
    { id: 'can_not_speak', text: 'Are you unable to speak full sentences?' },
    { id: 'blue_lips', text: 'Do lips/face look blue or gray?' },
    { id: 'sudden_onset', text: 'Did breathing difficulty start suddenly?' }
  ],
  headache: [
    { id: 'worst_headache', text: 'Is this the worst headache of your life?' },
    { id: 'vision_change', text: 'Any vision changes, confusion, or weakness?' },
    { id: 'stiff_neck', text: 'Do you have stiff neck with fever?' }
  ],
  abdominal_pain: [
    { id: 'persistent_vomit', text: 'Are you vomiting repeatedly?' },
    { id: 'blood_stool', text: 'Any blood in stool or black stool?' },
    { id: 'severe_localized', text: 'Is the pain severe and localized (one side)?' }
  ]
};

const SYMPTOMS = [
  { value: 'fever', label: 'Fever' },
  { value: 'cough', label: 'Cough' },
  { value: 'chest_pain', label: 'Chest Pain' },
  { value: 'difficulty_breathing', label: 'Difficulty Breathing' },
  { value: 'headache', label: 'Headache' },
  { value: 'abdominal_pain', label: 'Abdominal Pain' }
];

const SymptomCheckerAI = () => {
  const { language } = useApp();
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [diseaseName, setDiseaseName] = useState('');
  const [primarySymptom, setPrimarySymptom] = useState('');
  const [severity, setSeverity] = useState(5);
  const [durationDays, setDurationDays] = useState('1');
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  const followUps = useMemo(() => FOLLOW_UP_QUESTIONS[primarySymptom] || [], [primarySymptom]);

  const evaluateRisk = () => {
    if (!primarySymptom) return;

    const yesCount = Object.values(answers).filter((v) => v === 'yes').length;
    const ageNum = Number(age) || 0;
    const days = Number(durationDays) || 1;

    const emergencyDetected = ['blue_lips', 'can_not_speak', 'rest_pain', 'radiating_pain', 'blood_cough', 'worst_headache']
      .some((key) => answers[key] === 'yes');

    let score = severity * 8 + yesCount * 10;
    if (ageNum >= 60) score += 10;
    if (days >= 3) score += 10;
    if (primarySymptom === 'chest_pain' || primarySymptom === 'difficulty_breathing') score += 8;
    if (emergencyDetected) score = 95;

    const riskScore = Math.min(100, Math.max(0, score));

    let riskLevel = 'Low';
    if (riskScore >= 75) riskLevel = 'Critical';
    else if (riskScore >= 55) riskLevel = 'High';
    else if (riskScore >= 30) riskLevel = 'Moderate';

    const nextSteps =
      riskLevel === 'Critical'
        ? [
            'Call emergency services (108) immediately.',
            'Do not travel alone. Keep someone with you.',
            'Go to the nearest emergency department now.'
          ]
        : riskLevel === 'High'
        ? [
            'Visit a doctor or PHC today for urgent evaluation.',
            'Monitor symptoms every 2–4 hours.',
            'Escalate to emergency care if symptoms worsen.'
          ]
        : riskLevel === 'Moderate'
        ? [
            'Book a clinical check-up within 24 hours.',
            'Rest, hydrate, and track symptom changes.',
            'Seek urgent care if new red-flag symptoms appear.'
          ]
        : [
            'Continue home monitoring and hydration.',
            'Take rest and avoid heavy physical activity.',
            'Consult a clinician if symptoms persist or worsen.'
          ];

    setResult({ riskLevel, riskScore, emergencyDetected, nextSteps });
  };

  const riskColor =
    result?.riskLevel === 'Critical'
      ? 'text-red-600'
      : result?.riskLevel === 'High'
      ? 'text-orange-600'
      : result?.riskLevel === 'Moderate'
      ? 'text-yellow-600'
      : 'text-green-600';

  return (
    <div className="min-h-screen bg-gradient-to-br from-sand-beige via-white to-soft-charcoal/5 py-20">
      <div className="container mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold text-forest-green mb-3">AI Symptom Checker</h1>
            <p className="text-soft-charcoal/80">Follow-up questions • Emergency detection • Risk level • Next-step guidance</p>
            <p className="text-xs text-soft-charcoal/60 mt-2">Language: {language?.toUpperCase?.() || 'EN'}</p>
          </div>

          <div className="glass-panel rounded-2xl p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Name</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="Enter your name"
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-electric-teal focus:outline-none" 
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Age</label>
                <input 
                  type="number" 
                  min="0" 
                  value={age} 
                  onChange={(e) => setAge(e.target.value)} 
                  placeholder="Enter age"
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-electric-teal focus:outline-none" 
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Disease Name (if known)</label>
                <input 
                  type="text" 
                  value={diseaseName} 
                  onChange={(e) => setDiseaseName(e.target.value)} 
                  placeholder="e.g., Diabetes"
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-electric-teal focus:outline-none" 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Primary Symptom</label>
                <select 
                  value={primarySymptom} 
                  onChange={(e) => { setPrimarySymptom(e.target.value); setAnswers({}); setResult(null); }} 
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-electric-teal focus:outline-none"
                >
                  <option value="">Select symptom</option>
                  {SYMPTOMS.map((item) => (
                    <option key={item.value} value={item.value}>{item.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Duration (days)</label>
                <input 
                  type="number" 
                  min="1" 
                  value={durationDays} 
                  onChange={(e) => setDurationDays(e.target.value)} 
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-electric-teal focus:outline-none" 
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Severity: {severity}/10</label>
              <input 
                type="range" 
                min="1" 
                max="10" 
                value={severity} 
                onChange={(e) => setSeverity(Number(e.target.value))} 
                className="w-full accent-electric-teal" 
              />
            </div>

            {followUps.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-forest-green">AI Follow-up Questions</h3>
                {followUps.map((q) => (
                  <div key={q.id} className="border border-gray-200 rounded-xl p-4 bg-white/70">
                    <p className="font-medium mb-3">{q.text}</p>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="radio" 
                          name={q.id} 
                          value="yes" 
                          checked={answers[q.id] === 'yes'} 
                          onChange={(e) => setAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))} 
                          className="accent-electric-teal" 
                        />
                        <span>Yes</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="radio" 
                          name={q.id} 
                          value="no" 
                          checked={answers[q.id] === 'no'} 
                          onChange={(e) => setAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))} 
                          className="accent-electric-teal" 
                        />
                        <span>No</span>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-end">
              <button 
                onClick={evaluateRisk} 
                className="px-7 py-3 bg-electric-teal text-white rounded-lg font-semibold hover:opacity-90"
              >
                Evaluate Risk
              </button>
            </div>

            {result && (
              <div className="mt-6 border-t pt-6 space-y-5">
                {result.emergencyDetected && (
                  <div className="p-4 bg-red-600 text-white rounded-xl">
                    🚨 Emergency symptoms detected. Please call 108 immediately.
                  </div>
                )}

                <div className="text-center">
                  <p className="text-sm text-soft-charcoal/70">Risk Score</p>
                  <p className="text-4xl font-bold">{result.riskScore}</p>
                  <p className={`text-2xl font-bold ${riskColor}`}>{result.riskLevel}</p>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-forest-green mb-2">Suggested Next Steps</h3>
                  <ul className="space-y-2 list-disc pl-5">
                    {result.nextSteps.map((step, idx) => (
                      <li key={idx}>{step}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-yellow-50 border border-yellow-300 text-sm">
                  <p className="font-semibold mb-1">Medical Disclaimer</p>
                  <p>This tool is for preliminary guidance only and is not a medical diagnosis. Always consult a licensed healthcare professional for proper evaluation.</p>
                </div>

                <div className="p-4 rounded-xl bg-blue-50 border border-blue-300 text-sm">
                  <p className="font-semibold mb-1">Safety Policy</p>
                  <p>This AI does not provide prescription drug recommendations, dosages, or treatment prescriptions.</p>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SymptomCheckerAI;
