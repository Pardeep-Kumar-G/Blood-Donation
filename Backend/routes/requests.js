const express = require('express');
const router = express.Router();
const Request = require('../models/Request');

// Get all requests (with filters)
router.get('/', async (req, res) => {
  try {
    const { bloodGroup, city, urgency } = req.query;
    let query = {};
    if (bloodGroup) query.bloodGroup = bloodGroup;
    if (city) query.city = { $regex: city, $options: 'i' };
    if (urgency) query.urgency = urgency;
    const requests = await Request.find(query).sort({ created: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new request
router.post('/', async (req, res) => {
  try {
    const request = new Request(req.body);
    await request.save();
    res.status(201).json(request);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get single request by ID
router.get('/:id', async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);
    if (!request) return res.status(404).json({ error: 'Request not found' });
    res.json(request);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update request
router.put('/:id', async (req, res) => {
  try {
    const request = await Request.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!request) return res.status(404).json({ error: 'Request not found' });
    res.json(request);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete request
router.delete('/:id', async (req, res) => {
  try {
    const request = await Request.findByIdAndDelete(req.params.id);
    if (!request) return res.status(404).json({ error: 'Request not found' });
    res.json({ message: 'Request deleted successfully', request });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;