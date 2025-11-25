const FoodPremisesPage = require('../models/foodPremisesPageModel')
const FoodPremisesApp = require('../models/foodPremisesAppModel')
const User = require('../models/userModel')
const { hashPassword } = require('../utils/encryption')

// Public: Get Page Content
exports.getPageContent = async (req, res) => {
  try {
    let page = await FoodPremisesPage.findOne()
    if (!page) {
      page = await FoodPremisesPage.create({})
    }
    res.json(page)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Admin: Update Page Content
exports.updatePageContent = async (req, res) => {
  try {
    const { header, foodLaws, feeSchedule } = req.body
    let page = await FoodPremisesPage.findOne()
    if (!page) {
      page = new FoodPremisesPage()
    }

    if (header) page.header = header
    if (foodLaws) page.foodLaws = foodLaws
    if (feeSchedule) page.feeSchedule = feeSchedule

    await page.save()
    res.json(page)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Public: Submit Application
exports.submitApplication = async (req, res) => {
  try {
    const {
      premisesName,
      businessOwnerName,
      contactNumbers,
      email,
      physicalAddress,
      county,
      district,
      typeOfPremises,
      productCategories,
      otherProductCategory,
      numberOfEmployees,
      businessRegistrationNumber,
      falPremisesCode
    } = req.body

    let userId = req.session?.user?.id
    let credentials = null

    // If not logged in, create user
    if (!userId) {
      // 1. Check if user exists (by phone/username)
      const username = contactNumbers.trim() 
      
      const existingUser = await User.findOne({ username })
      if (existingUser) {
        return res.status(400).json({ message: 'An account with this phone number already exists. Please login to submit.' })
      }

      // 2. Generate Password
      const rawPassword = Math.floor(10000 + Math.random() * 90000).toString()
      const hashedPassword = await hashPassword(rawPassword)

      // 3. Create User
      const newUser = await User.create({
        username,
        password: hashedPassword,
        role: 'foodBusiness',
        isActive: true
      })
      
      userId = newUser._id
      credentials = { username, password: rawPassword }
    } else {
      // Check if user already has an app?
      const existingApp = await FoodPremisesApp.findOne({ user: userId })
      if (existingApp) {
        return res.status(400).json({ message: 'You have already submitted an application.' })
      }
    }

    // 4. Create Application
    const newApp = await FoodPremisesApp.create({
      user: userId,
      premisesName,
      businessOwnerName,
      contactNumbers,
      email,
      physicalAddress,
      county,
      district,
      typeOfPremises,
      productCategories,
      otherProductCategory,
      numberOfEmployees,
      businessRegistrationNumber,
      falPremisesCode,
      status: 'pending'
    })

    res.status(201).json({
      message: 'Application submitted successfully.',
      credentials, // Will be null if authenticated
      applicationId: newApp._id
    })

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: error.message })
  }
}

// Admin: Create Business Account
exports.createBusinessAccount = async (req, res) => {
  try {
    const { username, password } = req.body
    if (!username || !password) return res.status(400).json({ message: 'Username and password required' })
    
    const exists = await User.findOne({ username })
    if (exists) return res.status(400).json({ message: 'User already exists' })

    const hashedPassword = await hashPassword(password)
    const user = await User.create({
      username,
      password: hashedPassword,
      role: 'foodBusiness',
      isActive: true
    })

    res.status(201).json({ message: 'Business account created', user })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Business User: Get My Application
exports.getMyApplication = async (req, res) => {
  try {
    const userId = req.session?.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const app = await FoodPremisesApp.findOne({ user: userId })
    if (!app) {
      return res.status(404).json({ message: 'Application not found' })
    }
    res.json(app)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Admin: Get All Applications
exports.getAllApplications = async (req, res) => {
  try {
    const apps = await FoodPremisesApp.find().populate('user', 'username')
    res.json(apps)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Admin: Review Application (Approve/Reject + Upload Certificate)
exports.reviewApplication = async (req, res) => {
  try {
    const { id } = req.params
    const { status, certificate } = req.body

    const app = await FoodPremisesApp.findById(id)
    if (!app) {
      return res.status(404).json({ message: 'Application not found' })
    }

    if (status) app.status = status
    if (certificate) app.certificate = certificate

    await app.save()
    res.json(app)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
