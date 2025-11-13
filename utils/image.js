const bufferToDataURI = (buffer, mimeType) => `data:${mimeType};base64,${buffer.toString('base64')}`

const allowedImageMimes = new Set(['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif'])

const isAllowedImageMime = mimeType => allowedImageMimes.has(mimeType)

module.exports = { bufferToDataURI, isAllowedImageMime }
