const mongoose = require('mongoose')

const faActSchema = new mongoose.Schema({
  headerTag: { type: String, default: 'Guidelines' },
  title: { type: String, default: 'Food Authority Act' },
  brief: { type: String, default: '' },
  highlights: { type: [String], default: [] },
  pdfFile: { type: String, default: '' }, // file URL (e.g. https://host/uploads/pdf/*.pdf)
  pdfFileName: { type: String, default: '' }
}, { timestamps: true })

module.exports = mongoose.model('FAActContent', faActSchema)
