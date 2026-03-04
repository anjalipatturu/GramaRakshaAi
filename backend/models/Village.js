const mongoose = require('mongoose');

const villageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  district: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true,
    default: 'Telangana'
  },
  pincode: String,
  population: Number,
  householdCount: Number,
  phcName: String,
  phcDistance: Number,
  ashaWorkers: [{
    name: String,
    phone: String,
    workerId: String
  }],
  coordinates: {
    latitude: Number,
    longitude: Number
  },
  healthStats: {
    totalScreenings: { type: Number, default: 0 },
    highRiskCases: { type: Number, default: 0 },
    criticalCases: { type: Number, default: 0 },
    lastUpdated: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes
villageSchema.index({ name: 1, district: 1 });
villageSchema.index({ 'healthStats.highRiskCases': -1 });

module.exports = mongoose.model('Village', villageSchema);
