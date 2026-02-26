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

module.exports = { uploadSingleImage, uploadSinglePdf }
