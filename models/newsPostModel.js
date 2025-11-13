const mongoose = require('mongoose')

const newsPostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  images: { type: [String], default: [] },
  publishedAt: { type: Date, default: Date.now }
}, { timestamps: true })

module.exports = mongoose.model('NewsPost', newsPostSchema)
