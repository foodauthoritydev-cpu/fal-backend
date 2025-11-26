const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['superAdmin', 'admin', 'foodBusiness', 'communications', 'dataEntry'], default: 'admin', required: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true })

module.exports = mongoose.model('User', userSchema)
