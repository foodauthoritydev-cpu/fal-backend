const express = require('express')
const router = express.Router()
const { getPage, updatePage, createMessage, listMessages } = require('../controllers/contactController')

router.get('/', getPage)
router.put('/', updatePage)
router.post('/messages', createMessage)
router.get('/messages', listMessages)

module.exports = router
