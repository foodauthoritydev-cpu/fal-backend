const mongoose = require('mongoose')

const careerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  department: { type: String, default: '' },
  description: { type: String, required: true },
  requirements: [{ type: String }],
  responsibilities: [{ type: String }],
  type: { type: String, default: 'Full Time' },
  location: { type: String, default: 'Monrovia' },
  deadline: { type: Date },
  image: { type: String },
  isActive: { type: Boolean, default: true }
}, { timestamps: true })

module.exports = mongoose.model('Career', careerSchema)
