const ContactPage = require('../models/contactPageModel')
const Message = require('../models/messageModel')

const getPage = async (req, res) => {
  try {
    const doc = await ContactPage.findOne()
    if (!doc) return res.status(404).json({ message: 'Contact page not found' })
    res.json(doc)
  } catch (e) {
    res.status(500).json({ message: 'Server error' })
  }
}

const updatePage = async (req, res) => {
  try {
    const payload = req.body
    let doc = await ContactPage.findOne()
    if (doc) {
      if (payload.title !== undefined) doc.title = payload.title
      if (payload.description !== undefined) doc.description = payload.description
      if (payload.image !== undefined) doc.image = payload.image
      if (payload.address !== undefined) doc.address = payload.address
      if (payload.email !== undefined) doc.email = payload.email
      if (payload.phone !== undefined) doc.phone = payload.phone
      await doc.save()
    } else {
      doc = await ContactPage.create(payload)
    }
    res.json(doc)
  } catch (e) {
    res.status(500).json({ message: 'Server error' })
  }
}

const createMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body
    if (!name || !email || !message) return res.status(400).json({ message: 'Missing fields' })
    const doc = await Message.create({ name, email, message })
    res.status(201).json({ id: doc._id })
  } catch (e) {
    res.status(500).json({ message: 'Server error' })
  }
}

const listMessages = async (req, res) => {
  try {
    const items = await Message.find({}).sort({ createdAt: -1 })
    res.json(items)
  } catch (e) {
    res.status(500).json({ message: 'Server error' })
  }
}

module.exports = { getPage, updatePage, createMessage, listMessages }
