const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth.middleware');
const Screening = require('../models/Screening');
const User = require('../models/User');
const Village = require('../models/Village');

// Get dashboard statistics
router.get('/dashboard/stats', protect, authorize(['super_admin', 'district_admin']), async (req, res) => {
  try {
    const now = new Date();
    const lastMonth = new Date(now.setMonth(now.getMonth() - 1));

    const totalScreenings = await Screening.countDocuments();
    const screeningsThisMonth = await Screening.countDocuments({
      createdAt: { $gte: lastMonth }
    });

    const riskDistribution = await Screening.aggregate([
      {
        $group: {
          _id: '$riskLevel',
          count: { $sum: 1 }
        }
      }
    ]);

    const villageStats = await Village.find()
      .select('name district healthStats')
      .sort({ 'healthStats.highRiskCases': -1 })
      .limit(10);

    const topSymptoms = await Screening.aggregate([
      { $unwind: '$symptoms' },
      {
        $group: {
          _id: '$symptoms.name',
          count: { $sum: 1 },
          avgSeverity: { $avg: '$symptoms.severity' }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    const highRiskAlerts = await Screening.find({
      riskLevel: { $in: ['High', 'Critical'] },
      createdAt: { $gte: lastMonth }
    })
    .populate('userId', 'name age gender villageId')
    .sort({ createdAt: -1 })
    .limit(20);

    const totalUsers = await User.countDocuments();
    const newUsersThisMonth = await User.countDocuments({
      createdAt: { $gte: lastMonth }
    });

    const emergencyCases = await Screening.countDocuments({
      emergencyDetected: true,
      createdAt: { $gte: lastMonth }
    });

    res.json({
      success: true,
      data: {
        overview: {
          totalScreenings,
          screeningsThisMonth,
          totalUsers,
          newUsersThisMonth,
          emergencyCases
        },
        riskDistribution: riskDistribution.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        villageStats,
        topSymptoms,
        highRiskAlerts
      }
    });

  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ message: 'Error fetching dashboard data', error: error.message });
  }
});

// Generate public health report
router.get('/reports/public-health', protect, async (req, res) => {
  try {
    const { startDate, endDate, villageId } = req.query;
    
    const dateFilter = {};
    if (startDate || endDate) {
      dateFilter.createdAt = {};
      if (startDate) dateFilter.createdAt.$gte = new Date(startDate);
      if (endDate) dateFilter.createdAt.$lte = new Date(endDate);
    }

    const villageFilter = villageId ? { villageId } : {};

    const screenings = await Screening.find(dateFilter)
      .populate({
        path: 'userId',
        match: villageFilter,
        populate: { path: 'villageId' }
      });

    const filteredScreenings = screenings.filter(s => s.userId !== null);

    const totalScreenings = filteredScreenings.length;
    const riskLevels = {
      Low: filteredScreenings.filter(s => s.riskLevel === 'Low').length,
      Moderate: filteredScreenings.filter(s => s.riskLevel === 'Moderate').length,
      High: filteredScreenings.filter(s => s.riskLevel === 'High').length,
      Critical: filteredScreenings.filter(s => s.riskLevel === 'Critical').length
    };

    const villages = [...new Set(filteredScreenings.map(s => s.userId.villageId?.name))].filter(Boolean);

    const allSymptoms = filteredScreenings.flatMap(s => s.symptoms);
    const symptomCounts = {};
    allSymptoms.forEach(s => {
      symptomCounts[s.name] = (symptomCounts[s.name] || 0) + 1;
    });

    const topSymptoms = Object.entries(symptomCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));

    res.json({
      success: true,
      data: {
        reportPeriod: {
          start: startDate || 'All time',
          end: endDate || 'Present'
        },
        summary: {
          totalScreenings,
          villagesCovered: villages.length,
          villages: villages
        },
        riskDistribution: riskLevels,
        topSymptoms,
        recommendations: [
          'Increase awareness campaigns in high-risk villages',
          'Conduct regular health checkup camps',
          'Strengthen ASHA worker network',
          'Focus on maternal and child health programs'
        ]
      }
    });

  } catch (error) {
    console.error('Report generation error:', error);
    res.status(500).json({ message: 'Error generating report', error: error.message });
  }
});

// Export data
router.get('/export/:type', protect, authorize(['super_admin']), async (req, res) => {
  try {
    const { type } = req.params;
    const { format = 'json' } = req.query;

    let data;
    switch(type) {
      case 'screenings':
        data = await Screening.find().populate('userId').lean();
        break;
      case 'users':
        data = await User.find().populate('villageId').lean();
        break;
      case 'villages':
        data = await Village.find().lean();
        break;
      default:
        return res.status(400).json({ message: 'Invalid export type' });
    }

    if (format === 'csv') {
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=${type}-${Date.now()}.csv`);
      
      if (data.length > 0) {
        const headers = Object.keys(data[0]).join(',');
        const rows = data.map(item => Object.values(item).join(',')).join('\n');
        res.send(`${headers}\n${rows}`);
      } else {
        res.send('No data');
      }
    } else {
      res.json({
        success: true,
        data,
        count: data.length
      });
    }

  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({ message: 'Error exporting data', error: error.message });
  }
});

module.exports = router;
