const mongoose = require('mongoose')

const complaintSchema = new mongoose.Schema({
  type: { type: String, enum: ['report-unsafe-food', 'complaint'], default: 'complaint' },
  name: { type: String, default: '' },
  email: { type: String, default: '' },
  phone: { type: String, default: '' },
  subject: { type: String, required: true },
  location: { type: String, default: '' },
  description: { type: String, required: true },
  status: { type: String, enum: ['new', 'in-progress', 'resolved', 'closed'], default: 'new' }
}, { timestamps: true })

module.exports = mongoose.model('Complaint', complaintSchema)
