const mongoose = require('mongoose');

const chatLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  sessionId: {
    type: String,
    required: true
  },
  messages: [{
    role: {
      type: String,
      enum: ['user', 'bot', 'system'],
      required: true
    },
    content: String,
    language: {
      type: String,
      enum: ['en', 'hi', 'te']
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    metadata: {
      type: Map,
      of: mongoose.Schema.Types.Mixed
    }
  }],
  emergencyDetected: {
    type: Boolean,
    default: false
  },
  emergencyDetails: String,
  duration: Number,
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes
chatLogSchema.index({ userId: 1, createdAt: -1 });
chatLogSchema.index({ sessionId: 1 });
chatLogSchema.index({ emergencyDetected: 1 });

module.exports = mongoose.model('ChatLog', chatLogSchema);
