const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Screening = require('../models/Screening');
const User = require('../models/User');
const Village = require('../models/Village');
const riskEngine = require('../services/ai/riskEngine');

// Create new screening
router.post('/', [
  body('userId').notEmpty().withMessage('User ID required'),
  body('symptoms').isArray().withMessage('Symptoms must be an array'),
  body('symptoms.*.name').notEmpty(),
  body('symptoms.*.severity').isInt({ min: 1, max: 10 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { userId, symptoms } = req.body;

    const user = await User.findById(userId).populate('villageId');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const riskResult = riskEngine.calculateRisk(user, symptoms);
    const recommendations = riskEngine.generateRecommendations(
      riskResult.level, 
      symptoms, 
      user
    );

    const screening = new Screening({
      userId,
      symptoms,
      riskScore: riskResult.score,
      riskLevel: riskResult.level,
      riskBreakdown: riskResult.breakdown,
      recommendations,
      emergencyDetected: riskResult.emergencyDetected,
      emergencyType: riskResult.emergencyType
    });

    await screening.save();

    await Village.findByIdAndUpdate(user.villageId, {
      $inc: { 
        'healthStats.totalScreenings': 1,
        'healthStats.highRiskCases': riskResult.level === 'High' ? 1 : 0,
        'healthStats.criticalCases': riskResult.level === 'Critical' ? 1 : 0
      },
      'healthStats.lastUpdated': new Date()
    });

    user.lastScreening = new Date();
    await user.save();

    if (riskResult.level === 'High' || riskResult.level === 'Critical') {
      screening.ashaNotified = true;
      await screening.save();
    }

    res.status(201).json({
      message: 'Screening completed successfully',
      screening: {
        id: screening._id,
        riskScore: screening.riskScore,
        riskLevel: screening.riskLevel,
        riskBreakdown: screening.riskBreakdown,
        recommendations: screening.recommendations,
        emergencyDetected: screening.emergencyDetected,
        emergencyType: screening.emergencyType,
        createdAt: screening.createdAt
      }
    });

  } catch (error) {
    console.error('Screening error:', error);
    res.status(500).json({ message: 'Error processing screening', error: error.message });
  }
});

// Get user's screening history
router.get('/user/:userId', async (req, res) => {
  try {
    const screenings = await Screening.find({ userId: req.params.userId })
      .sort({ createdAt: -1 })
      .limit(20);
    
    res.json(screenings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching screenings', error: error.message });
  }
});

// Get screening by ID
router.get('/:id', async (req, res) => {
  try {
    const screening = await Screening.findById(req.params.id)
      .populate('userId', 'name age gender villageId');
    
    if (!screening) {
      return res.status(404).json({ message: 'Screening not found' });
    }
    
    res.json(screening);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching screening', error: error.message });
  }
});

module.exports = router;
