import React from 'react';
import { motion } from 'framer-motion';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sand-beige via-white to-soft-charcoal/5 py-20">
      <div className="container mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-bold text-forest-green mb-8">Health Dashboard</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-panel rounded-2xl p-6">
              <h3 className="text-lg font-semibold mb-2">Total Screenings</h3>
              <p className="text-4xl font-bold text-electric-teal">1,234</p>
            </div>
            <div className="glass-panel rounded-2xl p-6">
              <h3 className="text-lg font-semibold mb-2">High Risk Cases</h3>
              <p className="text-4xl font-bold text-orange-600">56</p>
            </div>
            <div className="glass-panel rounded-2xl p-6">
              <h3 className="text-lg font-semibold mb-2">Villages Covered</h3>
              <p className="text-4xl font-bold text-forest-green">23</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
