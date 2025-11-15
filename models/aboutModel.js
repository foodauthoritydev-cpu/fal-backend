const mongoose = require('mongoose')

const additionalSectionSchema = new mongoose.Schema({
  title: { type: String, default: '' },
  content: { type: String, default: '' },
  type: { type: String, enum: ['text', 'list'], default: 'text' },
  image: { type: String, default: '' } // base64 data URI
}, { _id: false })

const aboutSchema = new mongoose.Schema({
  bio: { type: String, default: '' },
  mission: { type: String, default: '' },
  vision: { type: String, default: '' },
  goals: { type: String, default: '' },
  images: {
    bioImage: { type: String, default: '' },
    missionImage: { type: String, default: '' },
    visionImage: { type: String, default: '' },
    goalsImage: { type: String, default: '' }
  },
  additionalSections: { type: [additionalSectionSchema], default: [] }
}, { timestamps: true })

module.exports = mongoose.model('AboutContent', aboutSchema)
