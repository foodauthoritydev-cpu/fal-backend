const mongoose = require('mongoose')

const faActSchema = new mongoose.Schema({
  headerTag: { type: String, default: 'Guidelines' },
  title: { type: String, default: 'Food Authority Act' },
  brief: { type: String, default: '' },
  highlights: { type: [String], default: [] },
  pdfFile: { type: String, default: '' }, // B2 file URL (legacy records may hold data URIs)
  pdfFileName: { type: String, default: '' }
}, { timestamps: true })

module.exports = mongoose.model('FAActContent', faActSchema)
