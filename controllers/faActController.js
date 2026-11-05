const FAActContent = require('../models/faActModel')
const { uploadFile, deleteFile } = require('../utils/b2Storage')

const isFileUrl = (value) => /^https?:\/\//i.test(value) || value.startsWith('/uploads/')

// Resolves a pdfFile payload to a file URL. URLs are kept as-is; base64
// payloads (data URIs or raw base64) are uploaded to Backblaze B2 so no
// document bytes are ever stored in MongoDB.
const resolvePdfUrl = async (value) => {
  if (value === null || value === undefined) return ''
  if (typeof value !== 'string') return null

  const trimmed = value.trim()
  if (!trimmed) return ''
  if (isFileUrl(trimmed)) return trimmed

  let base64 = null
  const dataMatch = trimmed.match(/^data:application\/pdf;base64,(.+)$/is)
  if (dataMatch) {
    base64 = dataMatch[1]
  } else if (/^data:[^;]+;base64,/i.test(trimmed)) {
    return null
  } else {
    const compact = trimmed.replace(/\s+/g, '')
    if (/^[A-Za-z0-9+/=]+$/.test(compact)) base64 = compact
  }
  if (!base64) return null

  const buffer = Buffer.from(base64, 'base64')
  if (!buffer.length || buffer.subarray(0, 5).toString() !== '%PDF-') return null

  const { url } = await uploadFile(buffer, 'food-authority-act.pdf', 'application/pdf', 'pdfs')
  return url
}

const getFAAct = async (req, res) => {
  try {
    let doc = await FAActContent.findOne()
    if (!doc) {
      doc = await FAActContent.create({})
    }
    // Migrate legacy base64 payloads stored in MongoDB to B2 on read
    if (doc.pdfFile && !isFileUrl(doc.pdfFile)) {
      const url = await resolvePdfUrl(doc.pdfFile).catch(() => null)
      if (url) {
        doc.pdfFile = url
        await doc.save()
      }
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
      const normalizedPdf = await resolvePdfUrl(payload.pdfFile)
      if (normalizedPdf === null) {
        return res.status(400).json({ message: 'pdfFile must be a file URL or base64 PDF payload.' })
      }
      if (normalizedPdf !== doc.pdfFile) await deleteFile(doc.pdfFile)
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
