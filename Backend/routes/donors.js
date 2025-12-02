const express = require('express');
const router = express.Router();
const Donor = require('../models/Donor');

// Get all donors (with filters)
router.get('/', async (req, res) => {
  try {
    const { bloodGroup, city, availability } = req.query;
    let query = {};
    if (bloodGroup) query.bloodGroup = bloodGroup;
    if (city) query.city = { $regex: city, $options: 'i' };
    if (availability === 'available') {
      query.lastDonation = { $lt: new Date(Date.now() - 56 * 24 * 60 * 60 * 1000) };
    }
    const donors = await Donor.find(query).sort({ lastDonation: -1 });
    res.json(donors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new donor
router.post('/', async (req, res) => {
  try {
    const donor = new Donor(req.body);
    await donor.save();
    res.status(201).json(donor);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get single donor by ID
router.get('/:id', async (req, res) => {
  try {
    const donor = await Donor.findById(req.params.id);
    if (!donor) return res.status(404).json({ error: 'Donor not found' });
    res.json(donor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update donor
router.put('/:id', async (req, res) => {
  try {
    const donor = await Donor.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!donor) return res.status(404).json({ error: 'Donor not found' });
    res.json(donor);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete donor
router.delete('/:id', async (req, res) => {
  try {
    const donor = await Donor.findByIdAndDelete(req.params.id);
    if (!donor) return res.status(404).json({ error: 'Donor not found' });
    res.json({ message: 'Donor deleted successfully', donor });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;