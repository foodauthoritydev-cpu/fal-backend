const path = require('path')
const { uploadFile } = require('../utils/b2Storage')

const uploadSingleImage = async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded or invalid mime type' })
  try {
    const result = await uploadFile(req.file.buffer, req.file.originalname, req.file.mimetype, 'images')
    res.status(201).json(result)
  } catch {
    res.status(500).json({ message: 'Unable to upload image' })
  }
}

const uploadSinglePdf = async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No PDF uploaded or invalid file type' })
  const mimeType = req.file.mimetype || 'application/pdf'
  try {
    const result = await uploadFile(req.file.buffer, req.file.originalname, mimeType, 'pdfs')
    res.status(201).json({ ...result, fileName: req.file.originalname, mimeType })
  } catch {
    res.status(500).json({ message: 'Unable to upload PDF' })
  }
}

const uploadDocument = async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'Upload a PDF, Word or PowerPoint document (maximum 20MB)' })
  const extension = path.extname(req.file.originalname).toLowerCase()
  const buffer = req.file.buffer
  const valid = extension === '.pdf'
    ? buffer.subarray(0, 5).toString() === '%PDF-'
    : ['.docx', '.pptx'].includes(extension)
      ? buffer.subarray(0, 4).equals(Buffer.from([0x50, 0x4b, 0x03, 0x04]))
      : buffer.subarray(0, 8).equals(Buffer.from([0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1]))
  if (!valid) return res.status(400).json({ message: 'Document contents do not match its file type' })
  try {
    const result = await uploadFile(buffer, req.file.originalname, req.file.mimetype, 'documents')
    res.status(201).json({ ...result, fileName: req.file.originalname, mimeType: req.file.mimetype })
  } catch {
    res.status(500).json({ message: 'Unable to store document' })
  }
}

const uploadResume = async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'Upload a PDF or Word document (maximum 20MB)' })
  try {
    const result = await uploadFile(req.file.buffer, req.file.originalname, req.file.mimetype, 'resumes')
    res.status(201).json({ ...result, fileName: req.file.originalname, mimeType: req.file.mimetype })
  } catch {
    res.status(500).json({ message: 'Unable to upload resume' })
  }
}

const uploadVideo = async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No video uploaded or invalid mime type' })
  try {
    const result = await uploadFile(req.file.buffer, req.file.originalname, req.file.mimetype, 'videos')
    res.status(201).json({ ...result, fileName: req.file.originalname, mimeType: req.file.mimetype })
  } catch {
    res.status(500).json({ message: 'Unable to upload video' })
  }
}

module.exports = { uploadSingleImage, uploadSinglePdf, uploadDocument, uploadResume, uploadVideo }
