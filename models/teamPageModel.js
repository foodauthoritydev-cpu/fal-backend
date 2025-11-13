const mongoose = require('mongoose')

const teamPageSchema = new mongoose.Schema({
  description: { type: String, default: '' },
  headerImage: { type: String, default: '' }
}, { timestamps: true })

module.exports = mongoose.model('TeamPage', teamPageSchema)
