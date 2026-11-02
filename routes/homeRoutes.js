const express = require('express')
const router = express.Router()
const { getHome, updateHome, deleteHeroImage } = require('../controllers/homeController')

router.get('/', getHome)
router.put('/', updateHome)
router.delete('/hero/:index', deleteHeroImage)

module.exports = router
