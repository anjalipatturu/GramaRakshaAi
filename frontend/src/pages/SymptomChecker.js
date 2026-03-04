import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import toast from 'react-hot-toast';

const SymptomChecker = () => {
  const { language, checkSymptoms, villages, loading } = useApp();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '', age: '', gender: '', villageId: '', existingConditions: [], symptoms: []
  });
  const [currentSymptom, setCurrentSymptom] = useState({ name: '', severity: 5, duration: 'few_hours' });
  const [result, setResult] = useState(null);

  const symptomOptions = [
    { value: 'fever', label: { en: 'Fever', hi: 'बुखार', te: 'జ్వరం' } },
    { value: 'cough', label: { en: 'Cough', hi: 'खांसी', te: 'దగ్గు' } },
    { value: 'difficulty_breathing', label: { en: 'Difficulty Breathing', hi: 'सांस लेने में कठिनाई', te: 'ఊపిరి ఆడకపోవడం' } },
    { value: 'chest_pain', label: { en: 'Chest Pain', hi: 'सीने में दर्द', te: 'గుండె నొప్పి' } },
    { value: 'headache', label: { en: 'Headache', hi: 'सिरदर्द', te: 'తలనొప్పి' } },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.symptoms.length === 0) {
      toast.error('Please add at least one symptom');
      return;
    }
    try {
      const response = await checkSymptoms(formData);
      setResult(response.screening);
      setStep(3);
    } catch (error) {
      toast.error('Error checking symptoms');
    }
  };

  const getRiskColor = (level) => {
    switch(level) {
      case 'Low': return 'text-green-600';
      case 'Moderate': return 'text-yellow-600';
      case 'High': return 'text-orange-600';
      case 'Critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sand-beige via-white to-soft-charcoal/5 py-20">
      <div className="container mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-forest-green mb-4">
              Smart Symptom Checker
            </h1>
            <p className="text-xl text-soft-charcoal/80">AI-powered health risk assessment</p>
          </div>

          <AnimatePresence mode="wait">
            {step === 3 && result && (
              <motion.div key="step3" className="glass-panel rounded-2xl p-8">
                {result.emergencyDetected && (
                  <div className="mb-6 p-4 bg-red-600 text-white rounded-xl animate-pulse">
                    <p className="text-xl font-bold text-center">
                      🚨 EMERGENCY: {result.emergencyType}
                    </p>
                  </div>
                )}
                
                <h2 className="text-2xl font-bold mb-6 text-center">Your Risk Level</h2>
                
                <div className="text-center mb-8">
                  <div className="relative inline-block">
                    <svg className="w-32 h-32">
                      <circle className="text-gray-300" strokeWidth="5" stroke="currentColor" fill="transparent" r="56" cx="64" cy="64" />
                      <circle
                        className={`${getRiskColor(result.riskLevel)} transition-all duration-1000`}
                        strokeWidth="5"
                        strokeDasharray={360}
                        strokeDashoffset={360 - (360 * result.riskScore) / 100}
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        r="56"
                        cx="64"
                        cy="64"
                      />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-3xl font-bold">
                      {result.riskScore}
                    </span>
                  </div>
                  <p className={`text-2xl font-bold mt-4 ${getRiskColor(result.riskLevel)}`}>
                    {result.riskLevel}
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">Recommendations</h3>
                  <ul className="space-y-2">
                    {result.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-electric-teal mt-1">•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default SymptomChecker;
