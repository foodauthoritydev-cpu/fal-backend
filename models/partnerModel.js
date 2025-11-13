const mongoose = require('mongoose')

const partnerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, default: '' },
  link: { type: String, default: '' }
}, { timestamps: true })

module.exports = mongoose.model('Partner', partnerSchema)
