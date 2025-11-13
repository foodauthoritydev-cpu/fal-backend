const express = require('express')
const router = express.Router()
const upload = require('../middleware/upload')
const { uploadSingleImage } = require('../controllers/uploadController')

router.post('/image', upload.single('image'), uploadSingleImage)

module.exports = router
