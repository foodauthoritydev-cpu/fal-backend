const express = require('express')
const router = express.Router()
const { getGalleryPage, updateGalleryPage, createItem, listItems, bulkCreate, updateItem, deleteItem } = require('../controllers/galleryController')

router.get('/page', getGalleryPage)
router.put('/page', updateGalleryPage)
router.get('/', listItems)
router.post('/', createItem)
router.post('/bulk', bulkCreate)
router.put('/:id', updateItem)
router.delete('/:id', deleteItem)

module.exports = router
