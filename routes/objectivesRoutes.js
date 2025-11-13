const express = require('express')
const router = express.Router()
const { getObjectives, updateObjectives, deleteObjectiveImage, deleteSectionImage } = require('../controllers/objectivesController')

router.get('/', getObjectives)
router.put('/', updateObjectives)
router.delete('/objective/:index/image', deleteObjectiveImage)
router.delete('/section/:index/image', deleteSectionImage)

module.exports = router
