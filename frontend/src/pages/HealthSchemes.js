import React from 'react';
import { motion } from 'framer-motion';

const HealthSchemes = () => {
  const schemes = [
    {
      name: 'Ayushman Bharat',
      description: 'Health insurance coverage up to ₹5 lakh per family per year',
      benefits: ['Free hospitalization', 'Medicines covered', 'No restrictions on age']
    },
    {
      name: 'PMJAY',
      description: 'Pradhan Mantri Jan Arogya Yojana',
      benefits: ['Cashless treatment', '1,350+ procedures covered', 'Secondary & tertiary care']
    },
    {
      name: 'Janani Suraksha Yojana',
      description: 'Safe motherhood intervention under National Health Mission',
      benefits: ['Cash assistance for delivery', 'Free transport', 'Postnatal care']
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-sand-beige via-white to-soft-charcoal/5 py-20">
      <div className="container mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl md:text-5xl font-bold text-forest-green mb-8 text-center">
            Government Health Schemes
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {schemes.map((scheme, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-panel rounded-2xl p-6 hover:shadow-2xl transition-all"
              >
                <h3 className="text-2xl font-bold text-electric-teal mb-4">{scheme.name}</h3>
                <p className="text-gray-700 mb-4">{scheme.description}</p>
                <div className="space-y-2">
                  {scheme.benefits.map((benefit, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="text-forest-green">✓</span>
                      <span className="text-gray-600">{benefit}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HealthSchemes;
