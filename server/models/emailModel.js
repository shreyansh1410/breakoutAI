const mongoose = require('mongoose');

const emailSchema = new mongoose.Schema({
  company: { type: String, required: true },
  location: { type: String, required: true },
  email: { type: String, required: true },
  products: { type: String, required: true },
  status: { type: String, default: 'pending' },
  deliveryStatus: { type: String, default: 'pending' },
  sentAt: { type: Date, default: Date.now },
  scheduledAt: { type: Date },
});

module.exports = mongoose.model('Email', emailSchema);