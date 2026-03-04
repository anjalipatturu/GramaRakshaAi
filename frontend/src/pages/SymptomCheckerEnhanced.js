import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import toast from 'react-hot-toast';
import { FaPlus, FaTrash, FaCheck, FaArrowLeft } from 'react-icons/fa';

const SymptomCheckerEnhanced = () => {
  const { language, checkSymptoms, villages, loading } = useApp();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    villageId: '',
    existingConditions: [],
    symptoms: []
  });
  const [currentSymptom, setCurrentSymptom] = useState({
    name: '',
    severity: 5,
    duration: 'few_hours'
  });
  const [result, setResult] = useState(null);
  const [expandedSymptom, setExpandedSymptom] = useState(null);

  const symptomOptions = [
    { value: 'fever', label: { en: 'Fever', hi: 'बुखार', te: 'జ్వరం' } },
    { value: 'cough', label: { en: 'Cough', hi: 'खांसी', te: 'దగ్గు' } },
    { value: 'difficulty_breathing', label: { en: 'Difficulty Breathing', hi: 'सांस लेने में कठिनाई', te: 'ఊపిరి ఆడకపోవడం' } },
    { value: 'chest_pain', label: { en: 'Chest Pain', hi: 'सीने में दर्द', te: 'గుండె నొప్పి' } },
    { value: 'headache', label: { en: 'Headache', hi: 'सिरदर्द', te: 'తలనొప్పి' } },
    { value: 'nausea', label: { en: 'Nausea', hi: 'मतली', te: 'వికారం' } },
    { value: 'vomiting', label: { en: 'Vomiting', hi: 'उल्टी', te: 'వాంతి' } },
    { value: 'diarrhea', label: { en: 'Diarrhea', hi: 'दस्त', te: 'విరేచనాలు' } },
    { value: 'body_ache', label: { en: 'Body Ache', hi: 'शरीर में दर्द', te: 'శరీర నొప్పి' } },
    { value: 'rash', label: { en: 'Rash', hi: 'चकत्ते', te: 'దద్దరు' } },
  ];

  const conditionOptions = [
    { value: 'diabetes', label: { en: 'Diabetes', hi: 'मधुमेह', te: 'డయాబెటిస్' } },
    { value: 'hypertension', label: { en: 'Hypertension', hi: 'उच्च रक्तचाप', te: 'రక్తపోటు' } },
    { value: 'asthma', label: { en: 'Asthma', hi: 'अस्थमा', te: 'ఆస్తమా' } },
    { value: 'heart_disease', label: { en: 'Heart Disease', hi: 'हृदय रोग', te: 'హృదయ వ్యాధి' } },
  ];

  const translations = {
    en: {
      title: 'Smart Symptom Checker',
      subtitle: 'AI-powered health risk assessment',
      step1: 'Personal Information',
      step2: 'Add Symptoms',
      step3: 'Review & Submit',
      name: 'Full Name',
      age: 'Age',
      gender: 'Gender',
      village: 'Select Village',
      conditions: 'Existing Conditions',
      symptoms: 'Symptoms',
      addSymptom: 'Add Symptom',
      severity: 'Severity (1-10)',
      duration: 'Duration',
      next: 'Next',
      back: 'Back',
      submit: 'Submit',
      results: 'Your Results',
      riskLevel: 'Risk Level',
      recommendations: 'Recommendations',
      emergency: 'EMERGENCY DETECTED'
    },
    hi: {
      title: 'स्मार्ट लक्षण परीक्षक',
      subtitle: 'एआई-संचालित स्वास्थ्य जोखिम आकलन',
      step1: 'व्यक्तिगत जानकारी',
      step2: 'लक्षण जोड़ें',
      step3: 'समीक्षा करें और जमा करें',
      name: 'पूरा नाम',
      age: 'उम्र',
      gender: 'लिंग',
      village: 'गांव चुनें',
      conditions: 'मौजूदा स्थितियां',
      symptoms: 'लक्षण',
      addSymptom: 'लक्षण जोड़ें',
      severity: 'गंभीरता (1-10)',
      duration: 'अवधि',
      next: 'अगला',
      back: 'पीछे',
      submit: 'जमा करें',
      results: 'आपके परिणाम',
      riskLevel: 'जोखिम स्तर',
      recommendations: 'सिफारिशें',
      emergency: 'आपातकाल का पता चला'
    },
    te: {
      title: 'స్మార్ట్ సిम్‌ప్టమ్ చెకర్',
      subtitle: 'AI-శక్తితో పూర్తి ఆరోగ్య ఝుందా మూల్యాంకనం',
      step1: 'వ్యక్తిగత సమాచారం',
      step2: 'సిమ్‌ప్టమ్‌లను జోడించండి',
      step3: 'సమీక్ష చేసి సమర్పించండి',
      name: 'పూర్తి పేరు',
      age: 'వయస్సు',
      gender: 'లింగం',
      village: 'గ్రామాన్ని ఎంచుకోండి',
      conditions: 'ఉన్న పరిస్థితులు',
      symptoms: 'సిమ్‌ప్టమ్‌లు',
      addSymptom: 'సిమ్‌ప్టమ్‌ను జోడించండి',
      severity: 'తీవ్రత (1-10)',
      duration: 'సమయకాలం',
      next: 'తరువాత',
      back: 'వెనుకకు',
      submit: 'సమర్పించండి',
      results: 'మీ ఫలితాలు',
      riskLevel: 'ఝుందా స్థితి',
      recommendations: 'సిఫారసులు',
      emergency: 'ఎమర్జెన్సీ కనుగొనబడింది'
    }
  };

  const t = translations[language] || translations.en;

  const addSymptom = () => {
    if (!currentSymptom.name) {
      toast.error('Please select a symptom');
      return;
    }
    const exists = formData.symptoms.some(s => s.name === currentSymptom.name);
    if (exists) {
      toast.error('Symptom already added');
      return;
    }
    setFormData({
      ...formData,
      symptoms: [...formData.symptoms, { ...currentSymptom }]
    });
    setCurrentSymptom({ name: '', severity: 5, duration: 'few_hours' });
  };

  const removeSymptom = (index) => {
    setFormData({
      ...formData,
      symptoms: formData.symptoms.filter((_, i) => i !== index)
    });
  };

  const toggleCondition = (condition) => {
    setFormData({
      ...formData,
      existingConditions: formData.existingConditions.includes(condition)
        ? formData.existingConditions.filter(c => c !== condition)
        : [...formData.existingConditions, condition]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.symptoms.length === 0) {
      toast.error('Please add at least one symptom');
      return;
    }
    try {
      const response = await checkSymptoms(formData);
      setResult(response.screening);
      setStep(4);
    } catch (error) {
      toast.error('Error checking symptoms');
    }
  };

  const getRiskColor = (level) => {
    switch (level) {
      case 'Low':
        return 'text-green-600 bg-green-50';
      case 'Moderate':
        return 'text-yellow-600 bg-yellow-50';
      case 'High':
        return 'text-orange-600 bg-orange-50';
      case 'Critical':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sand-beige via-white to-soft-charcoal/5 py-20">
      <div className="container mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-forest-green mb-4">
              {t.title}
            </h1>
            <p className="text-xl text-soft-charcoal/80">{t.subtitle}</p>
            <div className="flex justify-center gap-2 mt-6">
              {[1, 2, 3, 4].map((s) => (
                <motion.div
                  key={s}
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all ${
                    s <= step
                      ? 'bg-electric-teal text-white'
                      : 'bg-gray-300 text-white'
                  }`}
                >
                  {s}
                </motion.div>
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {/* Step 1: Personal Info */}
            {step === 1 && (
              <motion.div key="step1" className="glass-panel rounded-2xl p-8 space-y-6">
                <h2 className="text-2xl font-bold text-forest-green mb-6">{t.step1}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <input
                    type="text"
                    placeholder={t.name}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-electric-teal focus:outline-none"
                  />
                  <input
                    type="number"
                    placeholder={t.age}
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-electric-teal focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-electric-teal focus:outline-none"
                  >
                    <option value="">{t.gender}</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  <select
                    value={formData.villageId}
                    onChange={(e) => setFormData({ ...formData, villageId: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-electric-teal focus:outline-none"
                  >
                    <option value="">{t.village}</option>
                    {villages.map((v) => (
                      <option key={v._id} value={v._id}>
                        {v.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">{t.conditions}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {conditionOptions.map((cond) => (
                      <label key={cond.value} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.existingConditions.includes(cond.value)}
                          onChange={() => toggleCondition(cond.value)}
                          className="w-5 h-5 rounded accent-electric-teal"
                        />
                        <span>{cond.label[language] || cond.label.en}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setStep(2)}
                    className="px-8 py-3 bg-electric-teal text-white rounded-lg font-semibold"
                  >
                    {t.next} →
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Symptoms */}
            {step === 2 && (
              <motion.div key="step2" className="glass-panel rounded-2xl p-8 space-y-6">
                <h2 className="text-2xl font-bold text-forest-green mb-6">{t.step2}</h2>

                <div className="space-y-4">
                  <select
                    value={currentSymptom.name}
                    onChange={(e) => setCurrentSymptom({ ...currentSymptom, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-electric-teal focus:outline-none"
                  >
                    <option value="">Select a symptom</option>
                    {symptomOptions.map((sym) => (
                      <option key={sym.value} value={sym.value}>
                        {sym.label[language] || sym.label.en}
                      </option>
                    ))}
                  </select>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">{t.severity}: {currentSymptom.severity}</label>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={currentSymptom.severity}
                        onChange={(e) => setCurrentSymptom({ ...currentSymptom, severity: e.target.value })}
                        className="w-full accent-electric-teal"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">{t.duration}</label>
                      <select
                        value={currentSymptom.duration}
                        onChange={(e) => setCurrentSymptom({ ...currentSymptom, duration: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 focus:border-electric-teal"
                      >
                        <option value="few_hours">Few hours</option>
                        <option value="1_day">1 day</option>
                        <option value="few_days">Few days</option>
                        <option value="1_week">1 week</option>
                        <option value="more">More than 1 week</option>
                      </select>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={addSymptom}
                    className="w-full py-3 bg-electric-teal text-white rounded-lg font-semibold flex items-center justify-center gap-2"
                  >
                    <FaPlus /> {t.addSymptom}
                  </motion.button>
                </div>

                {formData.symptoms.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold mb-4">{t.symptoms} ({formData.symptoms.length})</h3>
                    <div className="space-y-3">
                      {formData.symptoms.map((symptom, idx) => (
                        <motion.div
                          key={idx}
                          className="flex items-center justify-between p-4 bg-gray-100 rounded-lg"
                          onClick={() => setExpandedSymptom(expandedSymptom === idx ? null : idx)}
                        >
                          <div className="flex-1 cursor-pointer">
                            <p className="font-semibold">
                              {symptomOptions.find(s => s.value === symptom.name)?.label[language] || symptom.name}
                            </p>
                            {expandedSymptom === idx && (
                              <div className="mt-2 text-sm text-gray-600">
                                <p>Severity: {symptom.severity}/10</p>
                                <p>Duration: {symptom.duration}</p>
                              </div>
                            )}
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              removeSymptom(idx);
                            }}
                            className="ml-4 p-2 text-red-600 hover:bg-red-100 rounded-lg"
                          >
                            <FaTrash />
                          </motion.button>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-between">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setStep(1)}
                    className="px-8 py-3 bg-gray-300 text-gray-800 rounded-lg font-semibold flex items-center gap-2"
                  >
                    <FaArrowLeft /> {t.back}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setStep(3)}
                    disabled={formData.symptoms.length === 0}
                    className="px-8 py-3 bg-electric-teal text-white rounded-lg font-semibold disabled:opacity-50"
                  >
                    {t.next} →
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Review */}
            {step === 3 && (
              <motion.div key="step3" className="glass-panel rounded-2xl p-8 space-y-6">
                <h2 className="text-2xl font-bold text-forest-green mb-6">{t.step3}</h2>

                <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="text-lg font-semibold">{formData.name}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Age</p>
                      <p className="text-lg font-semibold">{formData.age}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Gender</p>
                      <p className="text-lg font-semibold capitalize">{formData.gender}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Symptoms</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.symptoms.map((sym, idx) => (
                        <span key={idx} className="px-3 py-1 bg-electric-teal text-white rounded-full text-sm">
                          {symptomOptions.find(s => s.value === sym.name)?.label[language] || sym.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setStep(2)}
                    className="px-8 py-3 bg-gray-300 text-gray-800 rounded-lg font-semibold flex items-center gap-2"
                  >
                    <FaArrowLeft /> {t.back}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSubmit}
                    disabled={loading}
                    className="px-8 py-3 bg-electric-teal text-white rounded-lg font-semibold disabled:opacity-50"
                  >
                    {loading ? 'Analyzing...' : t.submit}
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* Step 4: Results */}
            {step === 4 && result && (
              <motion.div key="step4" className="glass-panel rounded-2xl p-8 space-y-6">
                {result.emergencyDetected && (
                  <motion.div
                    animate={{ backgroundColor: ['rgb(255,0,0,0.1)', 'rgb(255,0,0,0.2)'] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="p-6 border-4 border-red-600 rounded-2xl"
                  >
                    <p className="text-2xl font-bold text-red-600 text-center animate-pulse">
                      🚨 {t.emergency}: {result.emergencyType}
                    </p>
                  </motion.div>
                )}

                <div className="text-center space-y-4">
                  <h2 className="text-3xl font-bold text-forest-green">{t.results}</h2>

                  <div className="relative inline-block">
                    <svg className="w-40 h-40">
                      <circle className="text-gray-300" strokeWidth="5" stroke="currentColor" fill="transparent" r="70" cx="80" cy="80" />
                      <circle
                        className={`${getRiskColor(result.riskLevel)} transition-all duration-1000`}
                        strokeWidth="5"
                        strokeDasharray={440}
                        strokeDashoffset={440 - (440 * result.riskScore) / 100}
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        r="70"
                        cx="80"
                        cy="80"
                      />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-4xl font-bold">
                      {result.riskScore}
                    </span>
                  </div>

                  <div className={`inline-block px-6 py-3 rounded-full text-2xl font-bold ${getRiskColor(result.riskLevel)}`}>
                    {result.riskLevel}
                  </div>
                </div>

                <div className="mt-8 space-y-4">
                  <h3 className="text-xl font-semibold text-forest-green">{t.recommendations}</h3>
                  {result.recommendations.map((rec, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-start gap-3 p-4 bg-green-50 rounded-lg"
                    >
                      <FaCheck className="text-green-600 mt-1" />
                      <p className="text-gray-800">{rec}</p>
                    </motion.div>
                  ))}
                </div>

                <div className="flex justify-center gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setStep(1);
                      setFormData({
                        name: '',
                        age: '',
                        gender: '',
                        villageId: '',
                        existingConditions: [],
                        symptoms: []
                      });
                      setResult(null);
                    }}
                    className="px-8 py-3 bg-electric-teal text-white rounded-lg font-semibold"
                  >
                    Check Again
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default SymptomCheckerEnhanced;
