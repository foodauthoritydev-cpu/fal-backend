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

const documentTypes = {
  '.pdf': 'application/pdf',
  '.doc': 'application/msword',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.ppt': 'application/vnd.ms-powerpoint',
  '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
}
const documentUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const extension = require('path').extname(file.originalname).toLowerCase()
    cb(null, !!documentTypes[extension] && file.mimetype === documentTypes[extension])
  }
})

module.exports = {
  documentUpload,
  documentTypes,
  imageUpload,
  pdfUpload
}
