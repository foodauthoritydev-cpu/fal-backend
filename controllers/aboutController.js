const AboutContent = require('../models/aboutModel')

const getAbout = async (req, res) => {
  try {
    const doc = await AboutContent.findOne()
    if (!doc) return res.status(404).json({ message: 'About content not found' })
    res.json(doc)
  } catch (e) {
    res.status(500).json({ message: 'Server error' })
  }
}

const updateAbout = async (req, res) => {
  try {
    const payload = req.body
    let doc = await AboutContent.findOne()

    if (doc) {
      if (payload.bio !== undefined) doc.bio = payload.bio
      if (payload.mission !== undefined) doc.mission = payload.mission
      if (payload.vision !== undefined) doc.vision = payload.vision
      if (payload.goals !== undefined) doc.goals = payload.goals
      if (payload.images) {
        doc.images.bioImage = payload.images.bioImage ?? doc.images.bioImage
        doc.images.missionImage = payload.images.missionImage ?? doc.images.missionImage
        doc.images.visionImage = payload.images.visionImage ?? doc.images.visionImage
        doc.images.goalsImage = payload.images.goalsImage ?? doc.images.goalsImage
      }
      if (payload.additionalSections) {
        doc.additionalSections = payload.additionalSections
      }
      await doc.save()
    } else {
      doc = await AboutContent.create(payload)
    }

    res.json(doc)
  } catch (e) {
    res.status(500).json({ message: 'Server error' })
  }
}

// DELETE /api/about/image?field=bioImage|missionImage|visionImage|goalsImage
const deleteAboutImage = async (req, res) => {
  try {
    const { field } = req.query
    if (!['bioImage','missionImage','visionImage','goalsImage'].includes(field)) {
      return res.status(400).json({ message: 'Invalid field' })
    }
    const doc = await AboutContent.findOne()
    if (!doc) return res.status(404).json({ message: 'About content not found' })
    doc.images[field] = ''
    await doc.save()
    res.json({ success: true })
  } catch (e) {
    res.status(500).json({ message: 'Server error' })
  }
}

module.exports = { getAbout, updateAbout, deleteAboutImage }
