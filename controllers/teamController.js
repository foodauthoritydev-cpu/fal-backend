const TeamPage = require('../models/teamPageModel')
const TeamMember = require('../models/teamMemberModel')

const getTeamPage = async (req, res) => {
  try {
    const doc = await TeamPage.findOne()
    if (!doc) return res.status(404).json({ message: 'Team page not found' })
    res.json(doc)
  } catch (e) {
    res.status(500).json({ message: 'Server error' })
  }
}

const updateTeamPage = async (req, res) => {
  try {
    const payload = req.body
    let doc = await TeamPage.findOne()
    if (doc) {
      if (payload.description !== undefined) doc.description = payload.description
      if (payload.headerImage !== undefined) doc.headerImage = payload.headerImage
      await doc.save()
    } else {
      doc = await TeamPage.create(payload)
    }
    res.json(doc)
  } catch (e) {
    res.status(500).json({ message: 'Server error' })
  }
}

const createMember = async (req, res) => {
  try {
    const { name, role, bio, image } = req.body
    if (!name) return res.status(400).json({ message: 'Name is required' })
    const doc = await TeamMember.create({ name, role, bio, image })
    res.status(201).json(doc)
  } catch (e) {
    res.status(500).json({ message: 'Server error' })
  }
}

const listMembers = async (req, res) => {
  try {
    const items = await TeamMember.find({}).sort({ createdAt: -1 })
    res.json(items)
  } catch (e) {
    res.status(500).json({ message: 'Server error' })
  }
}

const getMember = async (req, res) => {
  try {
    const doc = await TeamMember.findById(req.params.id)
    if (!doc) return res.status(404).json({ message: 'Not found' })
    res.json(doc)
  } catch (e) {
    res.status(500).json({ message: 'Server error' })
  }
}

const updateMember = async (req, res) => {
  try {
    const { name, role, bio, image } = req.body
    const doc = await TeamMember.findById(req.params.id)
    if (!doc) return res.status(404).json({ message: 'Not found' })
    if (name !== undefined) doc.name = name
    if (role !== undefined) doc.role = role
    if (bio !== undefined) doc.bio = bio
    if (image !== undefined) doc.image = image
    await doc.save()
    res.json(doc)
  } catch (e) {
    res.status(500).json({ message: 'Server error' })
  }
}

const deleteMember = async (req, res) => {
  try {
    const doc = await TeamMember.findByIdAndDelete(req.params.id)
    if (!doc) return res.status(404).json({ message: 'Not found' })
    res.json({ success: true })
  } catch (e) {
    res.status(500).json({ message: 'Server error' })
  }
}

module.exports = { getTeamPage, updateTeamPage, createMember, listMembers, getMember, updateMember, deleteMember }
