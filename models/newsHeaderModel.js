const mongoose = require('mongoose')

const newsHeaderSchema = new mongoose.Schema({
  title: { type: String, default: '' },
  description: { type: String, default: '' },
  image: { type: String, default: '' }
}, { timestamps: true })

module.exports = mongoose.model('NewsPageHeader', newsHeaderSchema)
