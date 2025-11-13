const express = require('express')
const page = express.Router()
const partners = express.Router()
const { getPage, updatePage, createPartner, listPartners, updatePartner, deletePartner } = require('../controllers/partnershipController')

page.get('/', getPage)
page.put('/', updatePage)

partners.get('/', listPartners)
partners.post('/', createPartner)
partners.put('/:id', updatePartner)
partners.delete('/:id', deletePartner)

module.exports = { page, partners }
