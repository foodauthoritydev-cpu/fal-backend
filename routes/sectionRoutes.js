const express = require('express')
const router = express.Router()
const { requireAuth, requireRole } = require('../middleware/auth')
const { getSection, updateSection, deleteSectionImage } = require('../controllers/sectionController')

router.get('/:key', getSection)
router.put('/:key', requireAuth, requireRole(['superAdmin', 'admin']), updateSection)
router.delete('/:key/hero-image', requireAuth, requireRole(['superAdmin', 'admin']), deleteSectionImage)

module.exports = router
