const express = require('express');
const router = express.Router();
const Village = require('../models/Village');

// Get all villages
router.get('/', async (req, res) => {
  try {
    const villages = await Village.find().sort({ name: 1 });
    res.json(villages);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching villages', error: error.message });
  }
});

// Get village by ID
router.get('/:id', async (req, res) => {
  try {
    const village = await Village.findById(req.params.id);
    
    if (!village) {
      return res.status(404).json({ message: 'Village not found' });
    }

    res.json(village);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching village', error: error.message });
  }
});

// Create new village (admin only)
router.post('/', async (req, res) => {
  try {
    const village = new Village(req.body);
    await village.save();

    res.status(201).json({
      message: 'Village created successfully',
      village
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating village', error: error.message });
  }
});

// Update village
router.put('/:id', async (req, res) => {
  try {
    const village = await Village.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!village) {
      return res.status(404).json({ message: 'Village not found' });
    }

    res.json({
      message: 'Village updated successfully',
      village
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating village', error: error.message });
  }
});

module.exports = router;
