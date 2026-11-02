const ObjectivesContent = require('../models/objectivesModel')
const { deleteFile } = require('../utils/b2Storage')

const getObjectives = async (req, res) => {
  try {
    const doc = await ObjectivesContent.findOne()
    if (!doc) return res.status(404).json({ message: 'Objectives content not found' })
    res.json(doc)
  } catch (e) {
    res.status(500).json({ message: 'Server error' })
  }
}

const updateObjectives = async (req, res) => {
  try {
    const payload = req.body
    let doc = await ObjectivesContent.findOne()
    if (doc) {
      if (payload.intro !== undefined) doc.intro = payload.intro
      if (payload.objectives) doc.objectives = payload.objectives
      if (payload.sections) doc.sections = payload.sections
      await doc.save()
    } else {
      doc = await ObjectivesContent.create(payload)
    }
    res.json(doc)
  } catch (e) {
    res.status(500).json({ message: 'Server error' })
  }
}

const deleteObjectiveImage = async (req, res) => {
  try {
    const index = Number(req.params.index)
    const doc = await ObjectivesContent.findOne()
    if (!doc) return res.status(404).json({ message: 'Objectives content not found' })
    if (!Array.isArray(doc.objectives) || index < 0 || index >= doc.objectives.length) return res.status(400).json({ message: 'Index out of range' })
    const removed = doc.objectives[index].image
    doc.objectives[index].image = ''
    await doc.save()
    await deleteFile(removed)
    res.json({ success: true })
  } catch (e) {
    res.status(500).json({ message: 'Server error' })
  }
}

const deleteSectionImage = async (req, res) => {
  try {
    const index = Number(req.params.index)
    const doc = await ObjectivesContent.findOne()
    if (!doc) return res.status(404).json({ message: 'Objectives content not found' })
    if (!Array.isArray(doc.sections) || index < 0 || index >= doc.sections.length) return res.status(400).json({ message: 'Index out of range' })
    const removed = doc.sections[index].image
    doc.sections[index].image = ''
    await doc.save()
    await deleteFile(removed)
    res.json({ success: true })
  } catch (e) {
    res.status(500).json({ message: 'Server error' })
  }
}

module.exports = { getObjectives, updateObjectives, deleteObjectiveImage, deleteSectionImage }
