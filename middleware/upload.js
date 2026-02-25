const multer = require('multer')
const fs = require('fs')
const path = require('path')
const { isAllowedImageMime } = require('../utils/image')

const imageStorage = multer.memoryStorage()
const pdfUploadDir = path.join(__dirname, '..', 'uploads', 'pdf')

fs.mkdirSync(pdfUploadDir, { recursive: true })

const pdfStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, pdfUploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname || '').toLowerCase() || '.pdf'
    const base = path.basename(file.originalname || 'fa-act', ext).replace(/[^a-zA-Z0-9-_]/g, '-') || 'fa-act'
    cb(null, `${Date.now()}-${base}.pdf`)
  }
})

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
