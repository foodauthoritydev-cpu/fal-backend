const { bufferToDataURI } = require('../utils/image')

const uploadSingleImage = (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded or invalid mime type' })
  const dataUri = bufferToDataURI(req.file.buffer, req.file.mimetype)
  res.json({ base64: dataUri })
}

const uploadSinglePdf = (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No PDF uploaded or invalid file type' })
  const host = `${req.protocol}://${req.get('host')}`
  res.json({
    fileUrl: `${host}/uploads/pdf/${req.file.filename}`,
    fileName: req.file.originalname
  })
}

module.exports = { uploadSingleImage, uploadSinglePdf }
