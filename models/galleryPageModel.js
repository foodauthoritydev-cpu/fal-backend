const mongoose = require('mongoose')

const galleryPageSchema = new mongoose.Schema({
  description: { type: String, default: '' },
  headerImage: { type: String, default: '' }
}, { timestamps: true })

module.exports = mongoose.model('GalleryPage', galleryPageSchema)
