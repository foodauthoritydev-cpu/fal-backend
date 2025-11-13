const express = require('express')
const router = express.Router()
const { getAbout, updateAbout, deleteAboutImage } = require('../controllers/aboutController')

router.get('/', getAbout)
router.put('/', updateAbout)
router.delete('/image', deleteAboutImage)

module.exports = router
