const express = require('express')
const router = express.Router()
const { getHome, getHeroImage, updateHome, deleteHeroImage } = require('../controllers/homeController')

router.get('/', getHome)
router.get('/hero/:index', getHeroImage)
router.put('/', updateHome)
router.delete('/hero/:index', deleteHeroImage)

module.exports = router
