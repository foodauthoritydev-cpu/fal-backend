const ProductRegistration = require('../models/productModel')
const FoodPremisesApp = require('../models/foodPremisesAppModel')
const { deleteFile } = require('../utils/b2Storage')

// Business User: Register a product under their premise
exports.submitProduct = async (req, res) => {
  try {
    const userId = req.session?.user?.id
    if (!userId) return res.status(401).json({ message: 'Unauthorized' })

    const app = await FoodPremisesApp.findOne({ user: userId })
    if (!app) {
      return res.status(400).json({ message: 'You must register a food premise before registering products.' })
    }

    const {
      productName,
      brandName,
      manufacturerImporter,
      countryOfOrigin,
      packagingTypes,
      otherPackagingType,
      netWeightVolume,
      productCategories,
      otherProductCategory
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

    const product = await ProductRegistration.create({
      user: userId,
      application: app._id,
      premiseName: app.premisesName,
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

    res.status(201).json(product)
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
      .populate('user', 'username')
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
