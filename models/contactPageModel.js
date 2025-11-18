const mongoose = require('mongoose')

const contactPageSchema = new mongoose.Schema({
  title: { type: String, default: '' },
  description: { type: String, default: '' },
  image: { type: String, default: '' },
  address: { type: String, default: '' },
  email: { type: String, default: '' },
  phone: { type: String, default: '' },
  socialLinks: {
    type: [{
      platform: { type: String, default: '' },
      url: { type: String, default: '' },
      label: { type: String, default: '' }
    }],
    default: []
  }
}, { timestamps: true })

module.exports = mongoose.model('ContactPage', contactPageSchema)
