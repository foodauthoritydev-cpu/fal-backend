const mongoose = require('mongoose')

const sectionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true }, // HTML or text
  pdfFile: { type: String } // Base64 string for the PDF
})

const foodPremisesPageSchema = new mongoose.Schema({
  header: {
    title: { type: String, default: 'Food Premises' },
    description: { type: String, default: '' },
    image: { type: String, default: '' } // Base64
  },
  foodLaws: [sectionSchema],
  feeSchedule: [sectionSchema]
}, { timestamps: true })

module.exports = mongoose.model('FoodPremisesPage', foodPremisesPageSchema)
