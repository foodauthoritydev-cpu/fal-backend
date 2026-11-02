const FoodPremisesPage = require('../models/foodPremisesPageModel')
const FoodPremisesApp = require('../models/foodPremisesAppModel')
const User = require('../models/userModel')
const { hashPassword } = require('../utils/encryption')
const { deleteFile } = require('../utils/b2Storage')
const { sendVerificationEmail, setVerificationCode } = require('../utils/emailService')

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
    let verificationSent = false

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
        isActive: true,
        email: email || ''
      })

      if (email) {
        const code = setVerificationCode(newUser)
        await newUser.save()
        verificationSent = await sendVerificationEmail({ email, name: businessOwnerName, code })
      }

      userId = newUser._id
      credentials = { username, password: rawPassword }
    } else {
      // Check if user already has an app?
      const existingApp = await FoodPremisesApp.findOne({ user: userId })
      if (existingApp) {
        return res.status(400).json({ message: 'You have already submitted an application.' })
      }

      // Keep the account email in sync and (re)send verification if needed
      const account = await User.findById(userId)
      if (account && email && (account.email !== email || !account.emailVerified)) {
        account.email = email
        account.emailVerified = false
        const code = setVerificationCode(account)
        await account.save()
        verificationSent = await sendVerificationEmail({ email, name: businessOwnerName, code })
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
      applicationId: newApp._id,
      verificationSent
    })

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: error.message })
  }
}

// Admin: Create Business Account
exports.createBusinessAccount = async (req, res) => {
  try {
    const { username, password, email } = req.body
    if (!username || !password) return res.status(400).json({ message: 'Username and password required' })

    const exists = await User.findOne({ username })
    if (exists) return res.status(400).json({ message: 'User already exists' })

    const hashedPassword = await hashPassword(password)
    const user = await User.create({
      username,
      password: hashedPassword,
      role: 'foodBusiness',
      isActive: true,
      email: email || ''
    })

    let verificationSent = false
    if (email) {
      const code = setVerificationCode(user)
      await user.save()
      verificationSent = await sendVerificationEmail({ email, name: username, code })
    }

    res.status(201).json({ message: 'Business account created', user, verificationSent })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Public: Verify account email with the code sent via EmailJS
exports.verifyEmail = async (req, res) => {
  try {
    const { email, code } = req.body
    if (!email || !code) {
      return res.status(400).json({ message: 'Email and verification code are required' })
    }
    const user = await User.findOne({ email: String(email).trim() })
    if (!user || !user.verificationCode) {
      return res.status(400).json({ message: 'No pending verification for that email' })
    }
    if (user.verificationExpires && user.verificationExpires < new Date()) {
      return res.status(400).json({ message: 'Verification code has expired. Request a new one.' })
    }
    if (user.verificationCode !== String(code).trim()) {
      return res.status(400).json({ message: 'Incorrect verification code' })
    }
    user.emailVerified = true
    user.verificationCode = ''
    user.verificationExpires = undefined
    await user.save()

    if (req.session?.user?.id === user._id.toString()) {
      req.session.user.emailVerified = true
    }

    res.json({ success: true, message: 'Email verified successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Public: Resend the verification code
exports.resendVerification = async (req, res) => {
  try {
    const { email } = req.body
    if (!email) {
      return res.status(400).json({ message: 'Email is required' })
    }
    const user = await User.findOne({ email: String(email).trim() })
    if (user && !user.emailVerified) {
      const code = setVerificationCode(user)
      await user.save()
      await sendVerificationEmail({ email: user.email, name: user.username, code })
    }
    // Always report success so the endpoint can't be used to enumerate accounts
    res.json({ success: true, message: 'If an unverified account exists for that email, a new code has been sent.' })
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

// Public: Verify a premises certificate / registration
exports.verifyCertificate = async (req, res) => {
  try {
    const { code } = req.query
    if (!code || !code.trim()) {
      return res.status(400).json({ message: 'A premises code or registration number is required' })
    }
    const q = code.trim()
    const app = await FoodPremisesApp.findOne({
      status: 'approved',
      $or: [{ falPremisesCode: q }, { businessRegistrationNumber: q }]
    })
    if (!app) {
      return res.status(404).json({ message: 'No valid FAL certificate found for that code' })
    }
    res.json({
      valid: true,
      premisesName: app.premisesName,
      county: app.county,
      typeOfPremises: app.typeOfPremises,
      falPremisesCode: app.falPremisesCode || '',
      hasCertificate: !!app.certificate
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Public: Track an application by email + business registration number
exports.trackApplication = async (req, res) => {
  try {
    const { email, reg } = req.query
    if (!email || !reg) {
      return res.status(400).json({ message: 'Email and business registration number are required' })
    }
    const app = await FoodPremisesApp.findOne({
      email: email.trim(),
      businessRegistrationNumber: reg.trim()
    })
    if (!app) {
      return res.status(404).json({ message: 'No application found for those details' })
    }
    res.json({
      premisesName: app.premisesName,
      status: app.status,
      submittedAt: app.createdAt,
      falPremisesCode: app.falPremisesCode || ''
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Public: List approved premises for the public registry
exports.listPublicRegistry = async (req, res) => {
  try {
    const filter = { status: 'approved' }
    if (req.query.q) {
      const q = req.query.q.trim()
      filter.$or = [
        { premisesName: new RegExp(q, 'i') },
        { county: new RegExp(q, 'i') },
        { falPremisesCode: new RegExp(q, 'i') }
      ]
    }
    const apps = await FoodPremisesApp.find(filter)
      .select('premisesName county district typeOfPremises falPremisesCode createdAt')
      .sort({ createdAt: -1 })
    res.json(apps)
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
    if (certificate && certificate !== app.certificate) {
      await deleteFile(app.certificate)
      app.certificate = certificate
    }

    await app.save()
    res.json(app)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
