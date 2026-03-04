const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    unique: true,
    validate: {
      validator: function(v) {
        return /^[0-9]{10}$/.test(v);
      },
      message: 'Please enter a valid 10-digit phone number'
    }
  },
  age: {
    type: Number,
    required: [true, 'Age is required'],
    min: [0, 'Age cannot be negative'],
    max: [120, 'Age cannot exceed 120']
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: true
  },
  villageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Village',
    required: true
  },
  isAshaWorker: {
    type: Boolean,
    default: false
  },
  ashaWorkerId: {
    type: String,
    sparse: true
  },
  existingConditions: [{
    type: String,
    enum: ['diabetes', 'hypertension', 'asthma', 'heart_disease', 'none']
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastScreening: Date,
  preferredLanguage: {
    type: String,
    enum: ['en', 'hi', 'te'],
    default: 'en'
  }
}, {
  timestamps: true
});

// Indexes
userSchema.index({ phone: 1 });
userSchema.index({ villageId: 1, createdAt: -1 });

module.exports = mongoose.model('User', userSchema);
