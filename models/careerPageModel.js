const mongoose = require('mongoose')

const careerPageSchema = new mongoose.Schema({
  title: { type: String, default: 'Careers' },
  description: { type: String, default: 'Join our team' },
  headerImage: { type: String }
}, { timestamps: true })

module.exports = mongoose.model('CareerPage', careerPageSchema)
