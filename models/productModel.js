const mongoose = require('mongoose')

const productRegistrationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  application: { type: mongoose.Schema.Types.ObjectId, ref: 'FoodPremisesApp', required: true },
  premiseName: { type: String, required: true },
  productName: { type: String, required: true },
  brandName: { type: String, default: '' },
  manufacturerImporter: { type: String, default: '' },
  countryOfOrigin: { type: String, default: '' },
  packagingTypes: [{ type: String }], // Bottle, Jar, Box, Can, etc.
  otherPackagingType: { type: String, default: '' },
  netWeightVolume: { type: String, required: true },
  productCategories: [{ type: String }],
  otherProductCategory: { type: String, default: '' },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  certificate: { type: String } // B2 URL of the issued certificate
}, { timestamps: true })

module.exports = mongoose.model('ProductRegistration', productRegistrationSchema)
