const NewsPost = require('../models/newsPostModel')

const createPost = async (req, res) => {
  try {
    const { title, description, images } = req.body
    if (!title) return res.status(400).json({ message: 'Title is required' })
    const doc = await NewsPost.create({ title, description, images: Array.isArray(images) ? images : [] })
    res.status(201).json(doc)
  } catch {
    res.status(500).json({ message: 'Server error' })
  }
}

const listPosts = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page || '1', 10), 1)
    const limit = Math.min(Math.max(parseInt(req.query.limit || '10', 10), 1), 100)
    const skip = (page - 1) * limit
    const [items, total] = await Promise.all([
      NewsPost.find({}).sort({ createdAt: -1 }).skip(skip).limit(limit),
      NewsPost.countDocuments()
    ])
    res.json({ items, total, page, limit })
  } catch {
    res.status(500).json({ message: 'Server error' })
  }
}

const getPost = async (req, res) => {
  try {
    const doc = await NewsPost.findById(req.params.id)
    if (!doc) return res.status(404).json({ message: 'Not found' })
    res.json(doc)
  } catch {
    res.status(500).json({ message: 'Server error' })
  }
}

const updatePost = async (req, res) => {
  try {
    const { title, description, images } = req.body
    const doc = await NewsPost.findById(req.params.id)
    if (!doc) return res.status(404).json({ message: 'Not found' })
    if (title !== undefined) doc.title = title
    if (description !== undefined) doc.description = description
    if (images !== undefined && Array.isArray(images)) doc.images = images
    await doc.save()
    res.json(doc)
  } catch {
    res.status(500).json({ message: 'Server error' })
  }
}

const deletePost = async (req, res) => {
  try {
    const doc = await NewsPost.findByIdAndDelete(req.params.id)
    if (!doc) return res.status(404).json({ message: 'Not found' })
    res.json({ success: true })
  } catch {
    res.status(500).json({ message: 'Server error' })
  }
}

const deleteImage = async (req, res) => {
  try {
    const index = Number(req.params.index)
    const doc = await NewsPost.findById(req.params.id)
    if (!doc) return res.status(404).json({ message: 'Not found' })
    if (!Array.isArray(doc.images) || index < 0 || index >= doc.images.length) return res.status(400).json({ message: 'Index out of range' })
    doc.images.splice(index, 1)
    await doc.save()
    res.json({ success: true })
  } catch {
    res.status(500).json({ message: 'Server error' })
  }
}

module.exports = { createPost, listPosts, getPost, updatePost, deletePost, deleteImage }
