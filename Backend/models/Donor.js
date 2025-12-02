const mongoose = require('mongoose');

const donorSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  bloodGroup: { type: String, required: true, enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] },
  city: { type: String, required: true, trim: true },
  lastDonation: { type: Date, default: () => Date.now() - 90*24*60*60*1000 }, // Default: 90 days ago
  age: { type: Number, required: true, min: 18, max: 65 },
  gender: { type: String, required: true, enum: ['Male', 'Female', 'Other'] },
  phone: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  notes: { type: String, default: '' },
  photo: { type: String, default: null },  // URL to photo
  registered: { type: Date, default: Date.now },
  distance: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Donor', donorSchema);