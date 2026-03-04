import React from 'react';
import { motion } from 'framer-motion';
import { FaAmbulance, FaPhone } from 'react-icons/fa';

const Emergency = () => {
  const emergencyNumbers = [
    { name: 'Ambulance', number: '108', icon: FaAmbulance },
    { name: 'Police', number: '100', icon: FaPhone },
    { name: 'Fire', number: '101', icon: FaPhone },
    { name: 'Women Helpline', number: '181', icon: FaPhone },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-100 py-20">
      <div className="container mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-red-600 mb-4 animate-pulse">🚨 EMERGENCY</h1>
            <p className="text-xl text-gray-700">Quick access to emergency services</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {emergencyNumbers.map((service, index) => (
              <motion.a
                key={index}
                href={`tel:${service.number}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="glass-panel rounded-2xl p-8 hover:shadow-2xl transition-all cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-red-600 text-white rounded-full flex items-center justify-center">
                    <service.icon className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{service.name}</h3>
                    <p className="text-3xl font-bold text-red-600">{service.number}</p>
                  </div>
                </div>
              </motion.a>
            ))}
          </div>

          <div className="mt-12 glass-panel rounded-2xl p-6">
            <h3 className="text-xl font-bold mb-4">Important Instructions:</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• Stay calm and speak clearly</li>
              <li>• Provide your exact location</li>
              <li>• Describe the emergency situation</li>
              <li>• Follow operator instructions</li>
              <li>• Stay on the line until help arrives</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Emergency;
