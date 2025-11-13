const GalleryItem = require('../models/galleryItemModel')

const createItem = async (req, res) => {
  try {
    const { image, caption, category } = req.body
    if (!image) return res.status(400).json({ message: 'Image is required' })
    const doc = await GalleryItem.create({ image, caption, category })
    res.status(201).json(doc)
  } catch (e) {
    res.status(500).json({ message: 'Server error' })
  }
}

const listItems = async (req, res) => {
  try {
    const items = await GalleryItem.find({}).sort({ createdAt: -1 })
    res.json(items)
  } catch (e) {
    res.status(500).json({ message: 'Server error' })
  }
}

const bulkCreate = async (req, res) => {
  try {
    const items = Array.isArray(req.body.items) ? req.body.items : []
    if (!items.length) return res.status(400).json({ message: 'No items' })
    const docs = await GalleryItem.insertMany(items)
    res.status(201).json(docs)
  } catch (e) {
    res.status(500).json({ message: 'Server error' })
  }
}

const updateItem = async (req, res) => {
  try {
    const { image, caption, category } = req.body
    const doc = await GalleryItem.findById(req.params.id)
    if (!doc) return res.status(404).json({ message: 'Not found' })
    if (image !== undefined) doc.image = image
    if (caption !== undefined) doc.caption = caption
    if (category !== undefined) doc.category = category
    await doc.save()
    res.json(doc)
  } catch (e) {
    res.status(500).json({ message: 'Server error' })
  }
}

const deleteItem = async (req, res) => {
  try {
    const doc = await GalleryItem.findByIdAndDelete(req.params.id)
    if (!doc) return res.status(404).json({ message: 'Not found' })
    res.json({ success: true })
  } catch (e) {
    res.status(500).json({ message: 'Server error' })
  }
}

module.exports = { createItem, listItems, bulkCreate, updateItem, deleteItem }
