const Career = require('../models/careerModel')
const CareerPage = require('../models/careerPageModel')
const Application = require('../models/applicationModel')

const getPage = async (req, res) => {
  try {
    let page = await CareerPage.findOne()
    if (!page) page = await CareerPage.create({})
    res.json(page)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const updatePage = async (req, res) => {
  try {
    const { title, description, headerImage } = req.body
    let page = await CareerPage.findOne()
    if (!page) {
      page = await CareerPage.create({ title, description, headerImage })
    } else {
      page.title = title
      page.description = description
      page.headerImage = headerImage
      await page.save()
    }
    res.json(page)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const listJobs = async (req, res) => {
  try {
    const jobs = await Career.find().sort({ createdAt: -1 })
    res.json(jobs)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const getJob = async (req, res) => {
  try {
    const job = await Career.findById(req.params.id)
    if (!job) return res.status(404).json({ message: 'Job not found' })
    res.json(job)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const createJob = async (req, res) => {
  try {
    const job = await Career.create(req.body)
    res.status(201).json(job)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

const updateJob = async (req, res) => {
  try {
    const job = await Career.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!job) return res.status(404).json({ message: 'Job not found' })
    res.json(job)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

const deleteJob = async (req, res) => {
  try {
    await Career.findByIdAndDelete(req.params.id)
    res.json({ message: 'Job deleted' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const submitApplication = async (req, res) => {
  try {
    const { jobId, applicantName, applicantEmail, applicantPhone, coverLetter, resume, resumeFileName } = req.body
    if (!jobId || !applicantName || !applicantEmail) {
      return res.status(400).json({ message: 'Job, name, and email are required' })
    }
    const job = await Career.findById(jobId)
    if (!job) return res.status(404).json({ message: 'Job not found' })
    if (!job.isActive) return res.status(400).json({ message: 'This position is no longer accepting applications' })
    if (job.deadline && new Date(job.deadline) < new Date()) {
      return res.status(400).json({ message: 'The application deadline has passed' })
    }
    const application = await Application.create({
      job: jobId,
      applicantName,
      applicantEmail,
      applicantPhone: applicantPhone || '',
      coverLetter: coverLetter || '',
      resume: resume || '',
      resumeFileName: resumeFileName || ''
    })
    res.status(201).json(application)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

const listApplications = async (req, res) => {
  try {
    const filter = {}
    if (req.query.jobId) filter.job = req.query.jobId
    if (req.query.status) filter.status = req.query.status
    const applications = await Application.find(filter)
      .populate('job', 'title department type location')
      .sort({ createdAt: -1 })
    res.json(applications)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body
    const valid = ['pending', 'reviewed', 'shortlisted', 'rejected']
    if (!valid.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' })
    }
    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('job', 'title department type location')
    if (!application) return res.status(404).json({ message: 'Application not found' })
    res.json(application)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

const deleteApplication = async (req, res) => {
  try {
    await Application.findByIdAndDelete(req.params.id)
    res.json({ message: 'Application deleted' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = {
  getPage,
  updatePage,
  listJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
  submitApplication,
  listApplications,
  updateApplicationStatus,
  deleteApplication
}
