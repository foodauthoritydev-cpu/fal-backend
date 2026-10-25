const Complaint = require('../models/complaintModel')

const submitComplaint = async (req, res) => {
  try {
    const { type, name, email, phone, subject, location, description } = req.body || {}
    if (!subject || !description) {
      return res.status(400).json({ message: 'Subject and description are required' })
    }
    const doc = await Complaint.create({ type, name, email, phone, subject, location, description })
    res.status(201).json({ success: true, id: doc._id })
  } catch (e) {
    res.status(500).json({ message: 'Server error' })
  }
}

const listComplaints = async (req, res) => {
  try {
    const filter = {}
    if (req.query.type) filter.type = req.query.type
    const items = await Complaint.find(filter).sort({ createdAt: -1 })
    res.json(items)
  } catch (e) {
    res.status(500).json({ message: 'Server error' })
  }
}

const updateComplaintStatus = async (req, res) => {
  try {
    const { status } = req.body || {}
    if (!['new', 'in-progress', 'resolved', 'closed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' })
    }
    const doc = await Complaint.findByIdAndUpdate(req.params.id, { status }, { new: true })
    if (!doc) return res.status(404).json({ message: 'Complaint not found' })
    res.json(doc)
  } catch (e) {
    res.status(500).json({ message: 'Server error' })
  }
}

module.exports = { submitComplaint, listComplaints, updateComplaintStatus }
