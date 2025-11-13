const mongoose = require('mongoose')

const galleryItemSchema = new mongoose.Schema({
  image: { type: String, required: true },
  caption: { type: String, default: '' },
  category: { type: String, default: '' }
}, { timestamps: true })

module.exports = mongoose.model('GalleryItem', galleryItemSchema)
