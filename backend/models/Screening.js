const mongoose = require('mongoose');

const symptomSchema = new mongoose.Schema({
  name: String,
  severity: {
    type: Number,
    min: 1,
    max: 10
  },
  duration: String
});

const screeningSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  symptoms: [symptomSchema],
  riskScore: {
    type: Number,
    min: 0,
    max: 100,
    required: true
  },
  riskLevel: {
    type: String,
    enum: ['Low', 'Moderate', 'High', 'Critical'],
    required: true
  },
  riskBreakdown: {
    ageRisk: Number,
    genderRisk: Number,
    symptomRisk: Number,
    conditionRisk: Number
  },
  recommendations: [String],
  emergencyDetected: {
    type: Boolean,
    default: false
  },
  emergencyType: String,
  referredToPHC: {
    type: Boolean,
    default: false
  },
  phcName: String,
  ashaNotified: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes
screeningSchema.index({ userId: 1, createdAt: -1 });
screeningSchema.index({ riskLevel: 1, createdAt: -1 });

module.exports = mongoose.model('Screening', screeningSchema);
