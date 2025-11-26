const mongoose = require('mongoose')

const careerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, default: 'Full Time' },
  location: { type: String, default: 'Monrovia' },
  deadline: { type: Date },
  image: { type: String }, // Base64 or URL
  isActive: { type: Boolean, default: true }
}, { timestamps: true })

module.exports = mongoose.model('Career', careerSchema)
