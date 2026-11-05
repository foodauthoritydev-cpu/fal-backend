const mongoose = require('mongoose')

const foodPremisesAppSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  premisesName: { type: String, required: true },
  businessOwnerName: { type: String, required: true },
  contactNumbers: { type: String, required: true },
  contactNumbers2: { type: String, default: '' },
  email: { type: String, default: '' },
  physicalAddress: { type: String, default: '' },
  county: { type: String, default: '' },
  district: { type: String, default: '' },
  typeOfPremises: [{ type: String }], // Retailer, Wholesaler, etc.
  otherPremiseType: { type: String, default: '' },
  productCategories: [{ type: String }], // Food, Beverages, etc.
  otherProductCategory: { type: String },
  numberOfEmployees: { type: Number },
  businessRegistrationNumber: { type: String },
  falPremisesCode: { type: String }, // Optional, maybe assigned by admin
  dateOfListing: { type: String },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  certificate: { type: String } // B2 URL of the uploaded certificate
}, { timestamps: true })

module.exports = mongoose.model('FoodPremisesApp', foodPremisesAppSchema)
