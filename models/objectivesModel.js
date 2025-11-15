const mongoose = require('mongoose')

const objectiveItemSchema = new mongoose.Schema({
  title: { type: String, default: '' },
  description: { type: String, default: '' },
  image: { type: String, default: '' }
}, { _id: false })

const sectionSchema = new mongoose.Schema({
  title: { type: String, default: '' },
  content: { type: String, default: '' },
  type: { type: String, enum: ['text', 'list'], default: 'text' },
  image: { type: String, default: '' }
}, { _id: false })

const objectivesSchema = new mongoose.Schema({
  intro: { type: String, default: '' },
  objectives: { type: [objectiveItemSchema], default: [] },
  sections: { type: [sectionSchema], default: [] }
}, { timestamps: true })

module.exports = mongoose.model('ObjectivesContent', objectivesSchema)
