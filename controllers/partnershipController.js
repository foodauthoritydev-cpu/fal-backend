const PartnershipPage = require('../models/partnershipPageModel')
const Partner = require('../models/partnerModel')

const getPage = async (req, res) => {
  try {
    const doc = await PartnershipPage.findOne()
    if (!doc) return res.status(404).json({ message: 'Partnership page not found' })
    res.json(doc)
  } catch (e) {
    res.status(500).json({ message: 'Server error' })
  }
}

const updatePage = async (req, res) => {
  try {
    const payload = req.body
    let doc = await PartnershipPage.findOne()
    if (doc) {
      if (payload.title !== undefined) doc.title = payload.title
      if (payload.description !== undefined) doc.description = payload.description
      if (payload.image !== undefined) doc.image = payload.image
      await doc.save()
    } else {
      doc = await PartnershipPage.create(payload)
    }
    res.json(doc)
  } catch (e) {
    res.status(500).json({ message: 'Server error' })
  }
}

const createPartner = async (req, res) => {
  try {
    const { name, image, link } = req.body
    if (!name) return res.status(400).json({ message: 'Name is required' })
    const doc = await Partner.create({ name, image, link })
    res.status(201).json(doc)
  } catch (e) {
    res.status(500).json({ message: 'Server error' })
  }
}

const listPartners = async (req, res) => {
  try {
    const items = await Partner.find({}).sort({ createdAt: -1 })
    res.json(items)
  } catch (e) {
    res.status(500).json({ message: 'Server error' })
  }
}

const updatePartner = async (req, res) => {
  try {
    const { name, image, link } = req.body
    const doc = await Partner.findById(req.params.id)
    if (!doc) return res.status(404).json({ message: 'Not found' })
    if (name !== undefined) doc.name = name
    if (image !== undefined) doc.image = image
    if (link !== undefined) doc.link = link
    await doc.save()
    res.json(doc)
  } catch (e) {
    res.status(500).json({ message: 'Server error' })
  }
}

const deletePartner = async (req, res) => {
  try {
    const doc = await Partner.findByIdAndDelete(req.params.id)
    if (!doc) return res.status(404).json({ message: 'Not found' })
    res.json({ success: true })
  } catch (e) {
    res.status(500).json({ message: 'Server error' })
  }
}

module.exports = { getPage, updatePage, createPartner, listPartners, updatePartner, deletePartner }
