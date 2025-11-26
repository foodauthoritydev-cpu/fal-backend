const Career = require('../models/careerModel')
const CareerPage = require('../models/careerPageModel')

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

module.exports = {
  getPage,
  updatePage,
  listJobs,
  createJob,
  updateJob,
  deleteJob
}
