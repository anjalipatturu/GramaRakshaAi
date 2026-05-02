import React from 'react';
import { motion } from 'framer-motion';

const AdminPanel = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sand-beige via-white to-soft-charcoal/5 py-20">
      <div className="container mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-bold text-forest-green mb-8">Admin Panel</h1>
          <div className="glass-panel rounded-2xl p-8">
            <p className="text-lg text-gray-700">
              Admin dashboard for managing the GramaRaksha AI platform.
            </p>
            <p className="mt-4 text-sm text-gray-500">
              Login with admin credentials to access full features.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminPanel;
