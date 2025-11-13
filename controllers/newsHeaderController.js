const NewsPageHeader = require('../models/newsHeaderModel')

const getHeader = async (req, res) => {
  try {
    const doc = await NewsPageHeader.findOne()
    if (!doc) return res.status(404).json({ message: 'News page header not found' })
    res.json(doc)
  } catch {
    res.status(500).json({ message: 'Server error' })
  }
}

const updateHeader = async (req, res) => {
  try {
    const payload = req.body
    let doc = await NewsPageHeader.findOne()
    if (doc) {
      if (payload.title !== undefined) doc.title = payload.title
      if (payload.description !== undefined) doc.description = payload.description
      if (payload.image !== undefined) doc.image = payload.image
      await doc.save()
    } else {
      doc = await NewsPageHeader.create(payload)
    }
    res.json(doc)
  } catch {
    res.status(500).json({ message: 'Server error' })
  }
}

module.exports = { getHeader, updateHeader }
