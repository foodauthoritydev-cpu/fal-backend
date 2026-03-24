const mongoose = require('mongoose')

const applicationSchema = new mongoose.Schema({
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Career', required: true },
  applicantName: { type: String, required: true },
  applicantEmail: { type: String, required: true },
  applicantPhone: { type: String, default: '' },
  coverLetter: { type: String, default: '' },
  resume: { type: String },
  resumeFileName: { type: String, default: '' },
  status: { type: String, enum: ['pending', 'reviewed', 'shortlisted', 'rejected'], default: 'pending' }
}, { timestamps: true })

module.exports = mongoose.model('Application', applicationSchema)
