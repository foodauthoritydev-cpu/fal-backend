const mongoose = require('mongoose')

const partnerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, default: '' },
  link: { type: String, default: '' },
  section: { type: String, enum: ['advisory', 'scientific'], default: 'advisory' }
}, { timestamps: true })

module.exports = mongoose.model('Partner', partnerSchema)
