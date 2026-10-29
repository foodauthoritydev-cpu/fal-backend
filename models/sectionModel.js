const mongoose = require('mongoose')

const sectionItemSchema = new mongoose.Schema({
  title: { type: String, default: '' },
  description: { type: String, default: '' },
  image: { type: String, default: '' }, // base64 data URI
  fileUrl: { type: String, default: '' }, // downloadable document
  fileName: { type: String, default: '' },
  mimeType: { type: String, default: '' },
  link: { type: String, default: '' },
  date: { type: String, default: '' },
  tag: { type: String, default: '' },
  status: { type: String, default: '' }
}, { _id: false })

const sectionBlockSchema = new mongoose.Schema({
  type: { type: String, enum: ['text', 'list', 'cards', 'documents', 'pdf', 'word', 'powerpoint', 'faq', 'table'], default: 'text' },
  heading: { type: String, default: '' },
  text: { type: String, default: '' },
  items: { type: [sectionItemSchema], default: [] }
}, { _id: false })

sectionBlockSchema.add({ children: { type: [sectionBlockSchema], default: [] } })

const sectionSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true, index: true },
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  heroImage: { type: String, default: '' },
  intro: { type: String, default: '' },
  blocks: { type: [sectionBlockSchema], default: [] }
}, { timestamps: true })

module.exports = mongoose.model('SectionContent', sectionSchema)
