const mongoose = require('mongoose')

const foodPremisesAppSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  premisesName: { type: String, required: true },
  businessOwnerName: { type: String, required: true },
  contactNumbers: { type: String, required: true },
  email: { type: String, required: true },
  physicalAddress: { type: String, required: true },
  county: { type: String, required: true },
  district: { type: String, required: true },
  typeOfPremises: [{ type: String }], // Retailer, Wholesaler, etc.
  productCategories: [{ type: String }], // Dairy, Beverages, etc.
  otherProductCategory: { type: String },
  numberOfEmployees: { type: Number, required: true },
  businessRegistrationNumber: { type: String, required: true },
  falPremisesCode: { type: String }, // Optional, maybe assigned by admin
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  certificate: { type: String } // Base64 string of the uploaded certificate
}, { timestamps: true })

module.exports = mongoose.model('FoodPremisesApp', foodPremisesAppSchema)
