const ServicesPage = require('../models/servicesPageModel')

const normalizeServices = (value) => {
  if (!Array.isArray(value)) return []

  return value.map((item = {}) => ({
    title: String(item.title || '').trim(),
    description: String(item.description || '').trim()
  }))
}

const getPage = async (req, res) => {
  try {
    let doc = await ServicesPage.findOne()
    if (!doc) doc = await ServicesPage.create({})
    res.json(doc)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const updatePage = async (req, res) => {
  try {
    const payload = req.body || {}
    let doc = await ServicesPage.findOne()

    if (!doc) {
      doc = await ServicesPage.create({
        title: payload.title,
        intro: payload.intro,
        services: normalizeServices(payload.services)
      })
    } else {
      if (payload.title !== undefined) doc.title = String(payload.title || '').trim()
      if (payload.intro !== undefined) doc.intro = String(payload.intro || '').trim()
      if (payload.services !== undefined) doc.services = normalizeServices(payload.services)
      await doc.save()
    }

    res.json(doc)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = { getPage, updatePage }
