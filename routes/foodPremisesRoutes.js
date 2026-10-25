const express = require('express')
const router = express.Router()
const { requireAuth, requireRole } = require('../middleware/auth')
const {
  getPageContent,
  updatePageContent,
  submitApplication,
  getMyApplication,
  getAllApplications,
  reviewApplication,
  createBusinessAccount,
  verifyCertificate,
  trackApplication,
  listPublicRegistry
} = require('../controllers/foodPremisesController')

// Public Routes
router.get('/content', getPageContent)
router.post('/apply', submitApplication)
router.get('/verify', verifyCertificate)
router.get('/track', trackApplication)
router.get('/registry', listPublicRegistry)

// Protected Routes (Food Business)
router.get('/my-application', requireAuth, getMyApplication)

// Admin Routes
router.post('/create-account', requireAuth, requireRole(['superAdmin', 'admin']), createBusinessAccount)
router.put('/content', requireAuth, requireRole(['superAdmin', 'admin']), updatePageContent)
router.get('/applications', requireAuth, requireRole(['superAdmin', 'admin']), getAllApplications)
router.put('/applications/:id', requireAuth, requireRole(['superAdmin', 'admin']), reviewApplication)

module.exports = router
