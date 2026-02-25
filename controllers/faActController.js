const FAActContent = require('../models/faActModel')

const getFAAct = async (req, res) => {
  try {
    let doc = await FAActContent.findOne()
    if (!doc) {
      doc = await FAActContent.create({})
    }
    res.json(doc)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const updateFAAct = async (req, res) => {
  try {
    const payload = req.body || {}
    let doc = await FAActContent.findOne()

    if (!doc) {
      doc = new FAActContent({})
    }

    if (payload.headerTag !== undefined) doc.headerTag = payload.headerTag
    if (payload.title !== undefined) doc.title = payload.title
    if (payload.brief !== undefined) doc.brief = payload.brief
    if (Array.isArray(payload.highlights)) {
      doc.highlights = payload.highlights.map(item => String(item).trim()).filter(Boolean)
    }
    if (payload.pdfFile !== undefined) doc.pdfFile = payload.pdfFile
    if (payload.pdfFileName !== undefined) doc.pdfFileName = payload.pdfFileName

    await doc.save()
    res.json(doc)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = {
  getFAAct,
  updateFAAct
}
