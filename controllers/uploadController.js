const { bufferToDataURI } = require('../utils/image')

const uploadSingleImage = (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded or invalid mime type' })
  const dataUri = bufferToDataURI(req.file.buffer, req.file.mimetype)
  res.json({ base64: dataUri })
}

module.exports = { uploadSingleImage }
