const { bufferToDataURI } = require('../utils/image')

const uploadSingleImage = (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded or invalid mime type' })
  const dataUri = bufferToDataURI(req.file.buffer, req.file.mimetype)
  res.json({ base64: dataUri })
}

const uploadSinglePdf = (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No PDF uploaded or invalid file type' })
  const mimeType = req.file.mimetype || 'application/pdf'
  const dataUri = bufferToDataURI(req.file.buffer, mimeType)
  res.json({
    base64: dataUri,
    fileName: req.file.originalname,
    mimeType
  })
}

const uploadDocument = async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'Upload a PDF, Word or PowerPoint document (maximum 20MB)' })
  const path = require('path')
  const fs = require('fs/promises')
  const { randomUUID } = require('crypto')
  const extension = path.extname(req.file.originalname).toLowerCase()
  const buffer = req.file.buffer
  const valid = extension === '.pdf'
    ? buffer.subarray(0, 5).toString() === '%PDF-'
    : ['.docx', '.pptx'].includes(extension)
      ? buffer.subarray(0, 4).equals(Buffer.from([0x50, 0x4b, 0x03, 0x04]))
      : buffer.subarray(0, 8).equals(Buffer.from([0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1]))
  if (!valid) return res.status(400).json({ message: 'Document contents do not match its file type' })
  try {
    const directory = path.join(__dirname, '../uploads/documents')
    await fs.mkdir(directory, { recursive: true })
    const name = `${randomUUID()}${extension}`
    await fs.writeFile(path.join(directory, name), buffer, { flag: 'wx' })
    res.status(201).json({ url: `/uploads/documents/${name}`, fileName: req.file.originalname, mimeType: req.file.mimetype })
  } catch {
    res.status(500).json({ message: 'Unable to store document' })
  }
}

module.exports = { uploadSingleImage, uploadSinglePdf, uploadDocument }
