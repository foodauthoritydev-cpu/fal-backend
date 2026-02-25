const express = require('express')
const router = express.Router()
const { imageUpload, pdfUpload } = require('../middleware/upload')
const { requireAuth, requireRole } = require('../middleware/auth')
const { uploadSingleImage, uploadSinglePdf } = require('../controllers/uploadController')

router.post('/image', imageUpload.single('image'), uploadSingleImage)
router.post('/pdf', requireAuth, requireRole(['superAdmin', 'admin']), pdfUpload.single('pdf'), uploadSinglePdf)

module.exports = router
