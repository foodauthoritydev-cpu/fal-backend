const express = require('express')
const router = express.Router()
const { requireAuth, requireRole } = require('../middleware/auth')
const { getFAAct, updateFAAct } = require('../controllers/faActController')

router.get('/', getFAAct)
router.put('/', requireAuth, requireRole(['superAdmin', 'admin']), updateFAAct)

module.exports = router
