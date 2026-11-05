const ProductRegistration = require('../models/productModel')
const FoodPremisesApp = require('../models/foodPremisesAppModel')
const User = require('../models/userModel')
const { hashPassword } = require('../utils/encryption')
const { deleteFile } = require('../utils/b2Storage')
const { sendVerificationEmail, setVerificationCode } = require('../utils/emailService')

// Public: Register a product — creates an account for anonymous users, like food premises apply
exports.submitProduct = async (req, res) => {
  try {
    const {
      premiseName,
      productName,
      brandName,
      manufacturerImporter,
      countryOfOrigin,
      packagingTypes,
      otherPackagingType,
      netWeightVolume,
      productCategories,
      otherProductCategory,
      contactNumbers,
      email
    } = req.body

    if (!productName || !netWeightVolume) {
      return res.status(400).json({ message: 'Product name and net weight/volume are required' })
    }
    if (!Array.isArray(packagingTypes) || !packagingTypes.length) {
      return res.status(400).json({ message: 'Select at least one packaging type' })
    }
    if (!Array.isArray(productCategories) || !productCategories.length) {
      return res.status(400).json({ message: 'Select at least one product category' })
    }

    let userId = req.session?.user?.id
    let credentials = null
    let verificationSent = false
    let applicationId = null
    let resolvedPremiseName = premiseName

    if (!userId) {
      // Anonymous submission — create an account keyed on the telephone number
      if (!contactNumbers || !contactNumbers.trim()) {
        return res.status(400).json({ message: 'A telephone number is required to create your account' })
      }
      const username = contactNumbers.trim()

      const existingUser = await User.findOne({ username })
      if (existingUser) {
        return res.status(400).json({ message: 'An account with this phone number already exists. Please login to submit.' })
      }

      const rawPassword = Math.floor(10000 + Math.random() * 90000).toString()
      const hashedPassword = await hashPassword(rawPassword)

      const newUser = await User.create({
        username,
        password: hashedPassword,
        role: 'foodBusiness',
        isActive: true,
        email: email || ''
      })

      if (email) {
        const code = setVerificationCode(newUser)
        await newUser.save()
        verificationSent = await sendVerificationEmail({ email, name: premiseName || username, code })
      }

      userId = newUser._id
      credentials = { username, password: rawPassword }
    } else {
      // Logged-in users can pick one of their registered premises
      const app = await FoodPremisesApp.findOne({ user: userId })
      if (app) {
        applicationId = app._id
        resolvedPremiseName = app.premisesName
      } else if (email) {
        // Keep the account email in sync and (re)send verification if needed
        const account = await User.findById(userId)
        if (account && (account.email !== email || !account.emailVerified)) {
          account.email = email
          account.emailVerified = false
          const code = setVerificationCode(account)
          await account.save()
          verificationSent = await sendVerificationEmail({ email, name: account.username, code })
        }
      }
    }

    if (!resolvedPremiseName || !resolvedPremiseName.trim()) {
      return res.status(400).json({ message: 'Premise name is required' })
    }

    const product = await ProductRegistration.create({
      user: userId,
      application: applicationId,
      premiseName: resolvedPremiseName.trim(),
      productName,
      brandName: brandName || '',
      manufacturerImporter: manufacturerImporter || '',
      countryOfOrigin: countryOfOrigin || '',
      packagingTypes,
      otherPackagingType: otherPackagingType || '',
      netWeightVolume,
      productCategories,
      otherProductCategory: otherProductCategory || '',
      status: 'pending'
    })

    res.status(201).json({
      message: 'Product registration submitted successfully.',
      product,
      credentials, // Will be null if authenticated
      email: email || '',
      verificationSent
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: error.message })
  }
}

// Business User: List own products
exports.getMyProducts = async (req, res) => {
  try {
    const userId = req.session?.user?.id
    if (!userId) return res.status(401).json({ message: 'Unauthorized' })
    const products = await ProductRegistration.find({ user: userId }).sort({ createdAt: -1 })
    res.json(products)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Admin: List all product registrations
exports.getAllProducts = async (req, res) => {
  try {
    const products = await ProductRegistration.find()
      .populate('user', 'username email')
      .populate('application', 'premisesName businessOwnerName falPremisesCode')
      .sort({ createdAt: -1 })
    res.json(products)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Admin: Review product registration (Approve/Reject + optional certificate)
exports.reviewProduct = async (req, res) => {
  try {
    const { id } = req.params
    const { status, certificate } = req.body

    const product = await ProductRegistration.findById(id)
    if (!product) {
      return res.status(404).json({ message: 'Product registration not found' })
    }

    if (status) product.status = status
    if (certificate && certificate !== product.certificate) {
      await deleteFile(product.certificate)
      product.certificate = certificate
    }

    await product.save()
    res.json(product)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
