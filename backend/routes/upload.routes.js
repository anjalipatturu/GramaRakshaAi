const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const UploadedImage = require('../models/UploadedImage');
const User = require('../models/User');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'));
  }
};

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: fileFilter
});

const analyzeImage = async (imagePath, imageType) => {
  await new Promise(resolve => setTimeout(resolve, 2000));

  const analyses = {
    rash: {
      possibleIssue: 'Possible allergic reaction or skin infection',
      confidence: 0.75,
      urgencyLevel: 'medium',
      advice: [
        'Keep the area clean and dry',
        'Avoid scratching',
        'Apply calamine lotion if itchy',
        'Consult doctor if rash spreads or worsens'
      ],
      categories: ['skin', 'allergy']
    },
    wound: {
      possibleIssue: 'Minor cut or abrasion',
      confidence: 0.85,
      urgencyLevel: 'low',
      advice: [
        'Clean wound with clean water',
        'Apply antiseptic',
        'Cover with sterile bandage',
        'Watch for signs of infection'
      ],
      categories: ['injury', 'wound']
    },
    swelling: {
      possibleIssue: 'Localized inflammation',
      confidence: 0.70,
      urgencyLevel: 'medium',
      advice: [
        'Apply cold compress',
        'Elevate the area if possible',
        'Rest the affected area',
        'Seek medical attention if swelling increases'
      ],
      categories: ['inflammation']
    }
  };

  return analyses[imageType] || {
    possibleIssue: 'Unable to analyze clearly',
    confidence: 0.5,
    urgencyLevel: 'low',
    advice: [
      'Please consult a healthcare provider for proper diagnosis',
      'Monitor the area for changes',
      'Keep the area clean'
    ],
    categories: ['unknown']
  };
};

router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { userId, imageType } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'No image uploaded' });
    }

    if (!userId) {
      return res.status(400).json({ message: 'User ID required' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const imageUrl = `/uploads/${req.file.filename}`;
    const analysis = await analyzeImage(req.file.path, imageType);

    const uploadedImage = new UploadedImage({
      userId,
      imageUrl,
      imageType: imageType || 'other',
      aiAnalysis: analysis
    });

    await uploadedImage.save();

    res.status(201).json({
      message: 'Image uploaded and analyzed successfully',
      image: {
        id: uploadedImage._id,
        url: uploadedImage.imageUrl,
        analysis: uploadedImage.aiAnalysis,
        disclaimer: '⚠️ This is an AI-based assistive analysis. Not a medical diagnosis.'
      }
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Error uploading image', error: error.message });
  }
});

router.get('/user/:userId', async (req, res) => {
  try {
    const images = await UploadedImage.find({ userId: req.params.userId })
      .sort({ createdAt: -1 })
      .limit(50);
    
    res.json(images);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching images', error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const image = await UploadedImage.findById(req.params.id)
      .populate('userId', 'name age villageId');
    
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }

    res.json(image);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching image', error: error.message });
  }
});

module.exports = router;
