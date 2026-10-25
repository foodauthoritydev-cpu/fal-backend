const SectionContent = require('../models/sectionModel')

const getSection = async (req, res) => {
  try {
    const { key } = req.params
    let doc = await SectionContent.findOne({ key })
    if (!doc) doc = await SectionContent.create({ key })
    res.json(doc)
  } catch (e) {
    res.status(500).json({ message: 'Server error' })
  }
}

const updateSection = async (req, res) => {
  try {
    const { key } = req.params
    const payload = req.body || {}
    let doc = await SectionContent.findOne({ key })
    if (!doc) doc = new SectionContent({ key })

    if (payload.title !== undefined) doc.title = payload.title
    if (payload.subtitle !== undefined) doc.subtitle = payload.subtitle
    if (payload.heroImage !== undefined) doc.heroImage = payload.heroImage
    if (payload.intro !== undefined) doc.intro = payload.intro
    if (payload.blocks !== undefined) doc.blocks = payload.blocks

    await doc.save()
    res.json(doc)
  } catch (e) {
    res.status(500).json({ message: 'Server error' })
  }
}

const deleteSectionImage = async (req, res) => {
  try {
    const { key } = req.params
    const doc = await SectionContent.findOne({ key })
    if (!doc) return res.status(404).json({ message: 'Section not found' })
    doc.heroImage = ''
    await doc.save()
    res.json({ success: true })
  } catch (e) {
    res.status(500).json({ message: 'Server error' })
  }
}

module.exports = { getSection, updateSection, deleteSectionImage }
