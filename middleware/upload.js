const multer = require('multer')
const { isAllowedImageMime } = require('../utils/image')

const imageStorage = multer.memoryStorage()
const pdfStorage = multer.memoryStorage()

const imageFileFilter = (req, file, cb) => {
  if (isAllowedImageMime(file.mimetype)) cb(null, true)
  else cb(null, false)
}

const pdfFileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') cb(null, true)
  else cb(null, false)
}

const imageUpload = multer({ storage: imageStorage, fileFilter: imageFileFilter, limits: { fileSize: 5 * 1024 * 1024 } })
const pdfUpload = multer({ storage: pdfStorage, fileFilter: pdfFileFilter, limits: { fileSize: 50 * 1024 * 1024 } })

module.exports = {
  imageUpload,
  pdfUpload
}
