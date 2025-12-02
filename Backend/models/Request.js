const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  bloodGroup: { type: String, required: true, enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] },
  units: { type: Number, required: true, min: 1, max: 10 },
  hospital: { type: String, required: true, trim: true },
  city: { type: String, required: true, trim: true },
  urgency: { type: String, enum: ['high', 'medium', 'low'], required: true },
  contact: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
  details: { type: String, default: '' },
  created: { type: Date, default: Date.now },
  status: { type: String, enum: ['active', 'fulfilled', 'cancelled'], default: 'active' }
}, { timestamps: true });

module.exports = mongoose.model('Request', requestSchema);