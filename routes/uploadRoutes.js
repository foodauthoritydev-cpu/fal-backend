const express = require('express')
const router = express.Router()
const { imageUpload, pdfUpload, documentUpload, videoUpload } = require('../middleware/upload')
const { requireAuth, requireRole } = require('../middleware/auth')
const { uploadSingleImage, uploadSinglePdf, uploadDocument, uploadResume, uploadVideo } = require('../controllers/uploadController')

router.post('/document', requireAuth, requireRole(['superAdmin', 'admin']), documentUpload.single('document'), uploadDocument)
router.post('/image', requireAuth, requireRole(['superAdmin', 'admin']), imageUpload.single('image'), uploadSingleImage)
router.post('/pdf', requireAuth, requireRole(['superAdmin', 'admin']), pdfUpload.single('pdf'), uploadSinglePdf)
router.post('/video', requireAuth, requireRole(['superAdmin', 'admin']), videoUpload.single('video'), uploadVideo)
router.post('/resume', documentUpload.single('resume'), uploadResume)

module.exports = router
