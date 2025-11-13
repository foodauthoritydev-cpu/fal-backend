const express = require('express')
const router = express.Router()
const { createItem, listItems, bulkCreate, updateItem, deleteItem } = require('../controllers/galleryController')

router.get('/', listItems)
router.post('/', createItem)
router.post('/bulk', bulkCreate)
router.put('/:id', updateItem)
router.delete('/:id', deleteItem)

module.exports = router
