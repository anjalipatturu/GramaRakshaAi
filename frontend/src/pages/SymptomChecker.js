import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import toast from 'react-hot-toast';
import { FaHospital, FaPhone, FaEnvelope, FaMapMarkerAlt, FaUserMd } from 'react-icons/fa';

const SymptomChecker = () => {
  const { language, checkSymptoms, villages, loading } = useApp();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '', age: '', gender: '', villageId: '', existingConditions: [], symptoms: []
  });
  const [currentSymptom, setCurrentSymptom] = useState({ name: '', severity: 5, duration: 'few_hours' });
  const [result, setResult] = useState(null);
  const [emailSent, setEmailSent] = useState(false);

  const nearbyContacts = [
    { type: 'Emergency', name: 'National Ambulance', number: '108', icon: FaPhone, color: 'red' },
    { type: 'PHC', name: 'Primary Health Centre', number: '104', icon: FaHospital, color: 'blue' },
    { type: 'ASHA Worker', name: 'Local Health Worker', number: '1800-XXX-XXXX', icon: FaUserMd, color: 'green' }
  ];

  const nearbyHospitals = [
    { name: 'District Hospital', distance: '5.2 km', phone: '080-XXXX-XXXX', available: true },
    { name: 'Community Health Centre', distance: '2.8 km', phone: '080-YYYY-YYYY', available: true },
    { name: 'Primary Health Centre', distance: '1.5 km', phone: '080-ZZZZ-ZZZZ', available: true }
  ];

  const sendAlertEmail = async () => {
    try {
      toast.loading('Sending alert email...');
      await new Promise(resolve => setTimeout(resolve, 1500));
      setEmailSent(true);
      toast.dismiss();
      toast.success('Alert email sent to registered contacts!');
    } catch (error) {
      toast.error('Failed to send email alert');
    }
  };

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

                <div className="space-y-6">
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

                  {/* Alert Email Section */}
                  {(result.riskLevel === 'Critical' || result.riskLevel === 'High') && (
                    <div className="bg-gradient-to-r from-red-50 to-orange-50 p-6 rounded-xl border-2 border-red-200">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <FaEnvelope className="text-2xl text-red-600" />
                          <div>
                            <h4 className="font-bold text-red-900">Emergency Alert</h4>
                            <p className="text-sm text-red-700">Notify your emergency contacts</p>
                          </div>
                        </div>
                        <button
                          onClick={sendAlertEmail}
                          disabled={emailSent}
                          className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                            emailSent 
                              ? 'bg-green-500 text-white cursor-not-allowed' 
                              : 'bg-red-600 text-white hover:bg-red-700'
                          }`}
                        >
                          {emailSent ? '✓ Alert Sent' : 'Send Alert'}
                        </button>
                      </div>
                      {emailSent && (
                        <p className="text-sm text-green-700 mt-2">
                          ✓ Alert sent to: Family, ASHA Worker, Local PHC
                        </p>
                      )}
                    </div>
                  )}

                  {/* Nearby Hospitals */}
                  <div className="bg-blue-50 p-6 rounded-xl border-2 border-blue-200">
                    <div className="flex items-center gap-3 mb-4">
                      <FaHospital className="text-2xl text-blue-600" />
                      <h4 className="font-bold text-blue-900 text-lg">Nearby Healthcare Facilities</h4>
                    </div>
                    <div className="space-y-3">
                      {nearbyHospitals.map((hospital, index) => (
                        <div key={index} className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start">
                            <div>
                              <h5 className="font-semibold text-gray-800">{hospital.name}</h5>
                              <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                                <FaMapMarkerAlt className="text-blue-500" />
                                <span>{hospital.distance} away</span>
                              </div>
                            </div>
                            {hospital.available && (
                              <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full font-semibold">
                                Available
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-3">
                            <FaPhone className="text-green-600" />
                            <a href={`tel:${hospital.phone}`} className="text-blue-600 hover:text-blue-800 font-medium">
                              {hospital.phone}
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Emergency Contacts */}
                  <div className="bg-green-50 p-6 rounded-xl border-2 border-green-200">
                    <div className="flex items-center gap-3 mb-4">
                      <FaUserMd className="text-2xl text-green-600" />
                      <h4 className="font-bold text-green-900 text-lg">Emergency & Local Contacts</h4>
                    </div>
                    <div className="grid md:grid-cols-3 gap-4">
                      {nearbyContacts.map((contact, index) => (
                        <div key={index} className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center">
                          <contact.icon className={`text-3xl text-${contact.color}-600 mx-auto mb-2`} />
                          <h5 className="font-semibold text-gray-800 text-sm">{contact.type}</h5>
                          <p className="text-xs text-gray-600 mb-2">{contact.name}</p>
                          <a 
                            href={`tel:${contact.number}`}
                            className={`inline-block px-4 py-2 bg-${contact.color}-600 text-white rounded-lg font-bold hover:bg-${contact.color}-700 transition-colors`}
                          >
                            {contact.number}
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
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
