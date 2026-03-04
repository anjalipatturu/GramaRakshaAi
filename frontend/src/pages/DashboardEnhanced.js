import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import toast from 'react-hot-toast';
import { FaUsers, FaHeartbeat, FaMapMarkedAlt, FaChartBar } from 'react-icons/fa';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const DashboardEnhanced = () => {
  const { api, language } = useApp();
  const [dashboardData, setDashboardData] = useState({
    totalScreenings: 0,
    totalUsers: 0,
    emergencyAlerts: 0,
    avgRiskScore: 0,
    riskDistribution: { Low: 0, Moderate: 0, High: 0, Critical: 0 },
    villageStats: [],
    recentScreenings: [],
    trendData: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await api.get('/admin/dashboard');
        setDashboardData(response.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    if (api) {
      fetchDashboardData();
    }
  }, []);

  const translations = {
    en: {
      dashboard: 'Public Health Dashboard',
      totalScreenings: 'Total Screenings',
      totalUsers: 'Active Users',
      emergencyAlerts: 'Emergency Alerts',
      avgRisk: 'Avg Risk Score',
      riskDistribution: 'Risk Distribution',
      villageStats: 'Village-wise Statistics',
      recentScreenings: 'Recent Screenings',
      riskTrends: 'Risk Trends',
      selectVillage: 'Select Village'
    },
    hi: {
      dashboard: 'जनता स्वास्थ्य डैशबोर्ड',
      totalScreenings: 'कुल स्क्रीनिंग',
      totalUsers: 'सक्रिय उपयोगकर्ता',
      emergencyAlerts: 'आपातकाल सतर्कताएं',
      avgRisk: 'औसत जोखिम स्कोर',
      riskDistribution: 'जोखिम वितरण',
      villageStats: 'गांव-वार आंकड़े',
      recentScreenings: 'हाल की स्क्रीनिंग',
      riskTrends: 'जोखिम प्रवृत्तियां',
      selectVillage: 'गांव चुनें'
    },
    te: {
      dashboard: 'ప్రజా ఆరోగ్య డ్యాష్‌బోర్డ్',
      totalScreenings: 'మొత్తం స్క్రీనింగ్‌లు',
      totalUsers: 'క్రియాశీల వినియోగదారులు',
      emergencyAlerts: 'ఎమర్జెన్సీ అలర్టులు',
      avgRisk: 'సగటు ఝుందా స్కోర్',
      riskDistribution: 'ఝుందా వితరణ',
      villageStats: 'గ్రామ-వారు గణాంకాలు',
      recentScreenings: 'ఇటీవల స్క్రీనింగ్‌లు',
      riskTrends: 'ఝుందా ధోరణులు',
      selectVillage: 'గ్రామాన్ని ఎంచుకోండి'
    }
  };

  const t = translations[language] || translations.en;

  const stats = [
    {
      icon: FaHeartbeat,
      label: t.totalScreenings,
      value: dashboardData.totalScreenings,
      color: 'from-red-500 to-pink-500'
    },
    {
      icon: FaUsers,
      label: t.totalUsers,
      value: dashboardData.totalUsers,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: FaChartBar,
      label: t.emergencyAlerts,
      value: dashboardData.emergencyAlerts,
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: FaMapMarkedAlt,
      label: t.avgRisk,
      value: `${dashboardData.avgRiskScore.toFixed(1)}/100`,
      color: 'from-green-500 to-emerald-500'
    }
  ];

  const riskChartData = {
    labels: ['Low', 'Moderate', 'High', 'Critical'],
    datasets: [
      {
        data: [
          dashboardData.riskDistribution.Low,
          dashboardData.riskDistribution.Moderate,
          dashboardData.riskDistribution.High,
          dashboardData.riskDistribution.Critical,
        ],
        backgroundColor: [
          'rgba(34, 197, 94, 0.7)',
          'rgba(234, 179, 8, 0.7)',
          'rgba(249, 115, 22, 0.7)',
          'rgba(239, 68, 68, 0.7)',
        ],
        borderColor: [
          'rgb(34, 197, 94)',
          'rgb(234, 179, 8)',
          'rgb(249, 115, 22)',
          'rgb(239, 68, 68)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const villageChartData = {
    labels: dashboardData.villageStats.map((v) => v.villageName),
    datasets: [
      {
        label: 'Screenings',
        data: dashboardData.villageStats.map((v) => v.screeningCount),
        backgroundColor: 'rgba(20, 184, 166, 0.7)',
        borderColor: 'rgb(20, 184, 166)',
        borderWidth: 2,
      },
      {
        label: 'High Risk',
        data: dashboardData.villageStats.map((v) => v.highRiskCount),
        backgroundColor: 'rgba(239, 68, 68, 0.7)',
        borderColor: 'rgb(239, 68, 68)',
        borderWidth: 2,
      },
    ],
  };

  const trendChartData = {
    labels: dashboardData.trendData.map((d) => d.date),
    datasets: [
      {
        label: 'Avg Risk Score',
        data: dashboardData.trendData.map((d) => d.avgRisk),
        borderColor: 'rgb(20, 184, 166)',
        backgroundColor: 'rgba(20, 184, 166, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
      },
    ],
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sand-beige via-white to-soft-charcoal/5 py-20 flex items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity }} className="text-4xl">
          ⏳
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sand-beige via-white to-soft-charcoal/5 py-20">
      <div className="container mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-forest-green mb-4">
              {t.dashboard}
            </h1>
            <p className="text-xl text-soft-charcoal/80">Real-time health analytics and monitoring</p>
          </div>

          {/* Key Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className={`glass-panel rounded-2xl p-6 bg-gradient-to-br ${stat.color} text-white overflow-hidden`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm opacity-90">{stat.label}</p>
                      <p className="text-3xl md:text-4xl font-bold mt-2">{stat.value}</p>
                    </div>
                    <Icon className="text-5xl opacity-30" />
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Risk Distribution */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-panel rounded-2xl p-8"
            >
              <h2 className="text-2xl font-bold text-forest-green mb-6">{t.riskDistribution}</h2>
              <div className="flex justify-center">
                <div className="w-80 h-80">
                  <Doughnut data={riskChartData} options={{ responsive: true, maintainAspectRatio: true }} />
                </div>
              </div>
            </motion.div>

            {/* Risk Trends */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-panel rounded-2xl p-8"
            >
              <h2 className="text-2xl font-bold text-forest-green mb-6">{t.riskTrends}</h2>
              {dashboardData.trendData.length > 0 ? (
                <Line data={trendChartData} options={{ responsive: true, maintainAspectRatio: true }} />
              ) : (
                <div className="h-96 flex items-center justify-center text-gray-500">No trend data available</div>
              )}
            </motion.div>
          </div>

          {/* Village Stats */}
          {dashboardData.villageStats.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel rounded-2xl p-8"
            >
              <h2 className="text-2xl font-bold text-forest-green mb-6">{t.villageStats}</h2>
              <div className="h-96">
                <Bar
                  data={villageChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: true,
                        position: 'top',
                      },
                    },
                  }}
                />
              </div>
            </motion.div>
          )}

          {/* Recent Screenings */}
          {dashboardData.recentScreenings.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel rounded-2xl p-8"
            >
              <h2 className="text-2xl font-bold text-forest-green mb-6">{t.recentScreenings}</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b-2 border-gray-300">
                    <tr>
                      <th className="text-left py-3 px-4">User</th>
                      <th className="text-left py-3 px-4">Risk Level</th>
                      <th className="text-left py-3 px-4">Score</th>
                      <th className="text-left py-3 px-4">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardData.recentScreenings.map((screening, idx) => (
                      <motion.tr
                        key={idx}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: idx * 0.05 }}
                        className="border-b hover:bg-gray-50"
                      >
                        <td className="py-3 px-4">{screening.userName}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-semibold ${
                              screening.riskLevel === 'Critical'
                                ? 'bg-red-100 text-red-800'
                                : screening.riskLevel === 'High'
                                ? 'bg-orange-100 text-orange-800'
                                : screening.riskLevel === 'Moderate'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-green-100 text-green-800'
                            }`}
                          >
                            {screening.riskLevel}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-bold">{screening.riskScore}/100</td>
                        <td className="py-3 px-4 text-gray-600">
                          {new Date(screening.date).toLocaleDateString(language === 'en' ? 'en-IN' : 'hi-IN')}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardEnhanced;
