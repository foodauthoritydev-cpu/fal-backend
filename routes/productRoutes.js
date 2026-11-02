const express = require('express')
const router = express.Router()
const { requireAuth, requireRole } = require('../middleware/auth')
const {
  submitProduct,
  getMyProducts,
  getAllProducts,
  reviewProduct
} = require('../controllers/productController')

// Protected Routes (Food Business)
router.post('/', requireAuth, submitProduct)
router.get('/mine', requireAuth, getMyProducts)

// Admin Routes
router.get('/', requireAuth, requireRole(['superAdmin', 'admin']), getAllProducts)
router.put('/:id', requireAuth, requireRole(['superAdmin', 'admin']), reviewProduct)

module.exports = router
