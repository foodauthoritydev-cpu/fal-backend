const mongoose = require('mongoose')

const serviceItemSchema = new mongoose.Schema({
  title: { type: String, default: '' },
  description: { type: String, default: '' }
}, { _id: false })

const servicesPageSchema = new mongoose.Schema({
  title: { type: String, default: 'Our Services' },
  intro: { type: String, default: 'Learn about the core services provided by the Food Authority Liberia.' },
  services: { type: [serviceItemSchema], default: [] }
}, { timestamps: true })

module.exports = mongoose.model('ServicesPage', servicesPageSchema)
