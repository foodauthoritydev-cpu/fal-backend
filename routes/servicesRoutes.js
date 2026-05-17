const express = require('express')
const router = express.Router()
const { getPage, updatePage } = require('../controllers/servicesController')
const { requireAuth, requireRole } = require('../middleware/auth')

router.get('/', getPage)
router.put('/', requireAuth, requireRole(['superAdmin', 'admin']), updatePage)

module.exports = router
