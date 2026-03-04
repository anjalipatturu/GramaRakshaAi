const mongoose = require('mongoose');

const uploadedImageSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  publicId: String,
  imageType: {
    type: String,
    enum: ['rash', 'wound', 'injury', 'swelling', 'other'],
    required: true
  },
  aiAnalysis: {
    possibleIssue: String,
    confidence: Number,
    urgencyLevel: {
      type: String,
      enum: ['low', 'medium', 'high', 'emergency']
    },
    advice: [String],
    categories: [String]
  },
  reviewedByAsha: {
    type: Boolean,
    default: false
  },
  ashaNotes: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes
uploadedImageSchema.index({ userId: 1, createdAt: -1 });
uploadedImageSchema.index({ 'aiAnalysis.urgencyLevel': 1 });

module.exports = mongoose.model('UploadedImage', uploadedImageSchema);
