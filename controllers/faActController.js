const FAActContent = require('../models/faActModel')

const normalizePdfData = (value) => {
  if (value === null || value === undefined) return ''
  if (typeof value !== 'string') return null

  const trimmed = value.trim()
  if (!trimmed) return ''

  if (/^https?:\/\//i.test(trimmed) || trimmed.startsWith('/uploads/')) {
    return null
  }

  if (/^data:application\/pdf;base64,/i.test(trimmed)) {
    return trimmed
  }

  if (/^data:[^;]+;base64,/i.test(trimmed)) {
    return null
  }

  const compact = trimmed.replace(/\s+/g, '')
  if (/^[A-Za-z0-9+/=]+$/.test(compact)) {
    return `data:application/pdf;base64,${compact}`
  }

  return null
}

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
    if (payload.pdfFile !== undefined) {
      const normalizedPdf = normalizePdfData(payload.pdfFile)
      if (normalizedPdf === null) {
        return res.status(400).json({ message: 'pdfFile must be a base64 PDF payload.' })
      }
      doc.pdfFile = normalizedPdf
    }
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
