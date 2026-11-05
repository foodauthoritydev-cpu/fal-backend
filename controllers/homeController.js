const HomeContent = require('../models/homeModel')
const { uploadFile, deleteFile } = require('../utils/b2Storage')

const isFileUrl = (value) => /^https?:\/\//i.test(value) || value.startsWith('/uploads/')

const imageMimeFromBuffer = (buffer) => {
  if (buffer.length >= 4 && buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47) return 'image/png'
  if (buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) return 'image/jpeg'
  if (buffer.length >= 6 && buffer.subarray(0, 6).toString() === 'GIF89a') return 'image/gif'
  if (buffer.length >= 6 && buffer.subarray(0, 6).toString() === 'GIF87a') return 'image/gif'
  if (buffer.length >= 12 && buffer.subarray(0, 4).toString() === 'RIFF' && buffer.subarray(8, 12).toString() === 'WEBP') return 'image/webp'
  return null
}

// Resolves an image payload to a file URL. URLs are kept as-is; base64
// payloads (data URIs or raw base64) are uploaded to Backblaze B2 so no
// image bytes are ever stored in MongoDB.
const resolveImageUrl = async (value, name = 'hero-image') => {
  if (value === null || value === undefined) return ''
  if (typeof value !== 'string') return null

  const trimmed = value.trim()
  if (!trimmed) return ''
  if (isFileUrl(trimmed)) return trimmed

  let base64 = null
  let declaredMime = null
  const dataMatch = trimmed.match(/^data:([^;]+);base64,(.+)$/is)
  if (dataMatch) {
    declaredMime = dataMatch[1]
    base64 = dataMatch[2]
  } else {
    const compact = trimmed.replace(/\s+/g, '')
    if (/^[A-Za-z0-9+/=]+$/.test(compact)) base64 = compact
  }
  if (!base64) return null

  const buffer = Buffer.from(base64, 'base64')
  if (!buffer.length) return null

  const mime = imageMimeFromBuffer(buffer) || (declaredMime && /^image\//.test(declaredMime) ? declaredMime : null)
  if (!mime) return null

  const ext = mime.split('/')[1].replace('jpeg', 'jpg')
  const { url } = await uploadFile(buffer, `${name}.${ext}`, mime, 'images')
  return url
}

const migrateHeroImages = async (doc) => {
  let changed = false
  if (Array.isArray(doc.hero?.images)) {
    const migrated = []
    for (const img of doc.hero.images) {
      if (!img) continue
      if (isFileUrl(img)) {
        migrated.push(img)
      } else {
        const url = await resolveImageUrl(img).catch(() => null)
        if (url) migrated.push(url)
        changed = true
      }
    }
    if (changed) doc.hero.images = migrated
  }
  if (doc.hero?.backgroundImage && !isFileUrl(doc.hero.backgroundImage)) {
    const url = await resolveImageUrl(doc.hero.backgroundImage).catch(() => null)
    if (url) {
      doc.hero.backgroundImage = url
      changed = true
    }
  }
  if (changed) await doc.save()
}

const getHome = async (req, res) => {
  try {
    const doc = await HomeContent.findOne()
    if (!doc) return res.status(404).json({ message: 'Home content not found' })
    await migrateHeroImages(doc)
    res.json(doc)
  } catch (e) {
    res.status(500).json({ message: 'Server error' })
  }
}

const updateHome = async (req, res) => {
  try {
    const payload = req.body
    let doc = await HomeContent.findOne()

    // Enforce max 4 hero images if provided
    if (payload?.hero?.images && Array.isArray(payload.hero.images)) {
      payload.hero.images = payload.hero.images.slice(0, 4)
      // Upload any base64 payloads to B2 — only URLs are stored
      const resolved = []
      for (const img of payload.hero.images) {
        const url = await resolveImageUrl(img)
        if (url === null) return res.status(400).json({ message: 'Hero images must be file URLs or base64 image payloads.' })
        resolved.push(url)
      }
      payload.hero.images = resolved
    }
    if (payload?.hero?.backgroundImage !== undefined) {
      const url = await resolveImageUrl(payload.hero.backgroundImage, 'hero-background')
      if (url === null) return res.status(400).json({ message: 'backgroundImage must be a file URL or base64 image payload.' })
      payload.hero.backgroundImage = url
    }

    if (doc) {
      // shallow merge for top-level; deep for hero/snippets/contact/footer
      if (payload.headerTitle !== undefined) doc.headerTitle = payload.headerTitle
      if (payload.hero) {
        doc.hero.title = payload.hero.title ?? doc.hero.title
        doc.hero.subtitle = payload.hero.subtitle ?? doc.hero.subtitle
        doc.hero.images = payload.hero.images ?? doc.hero.images
        doc.hero.overlayColor = payload.hero.overlayColor ?? doc.hero.overlayColor
        doc.hero.backgroundImage = payload.hero.backgroundImage ?? doc.hero.backgroundImage
      }
      if (payload.snippets) {
        doc.snippets.about = payload.snippets.about ?? doc.snippets.about
        doc.snippets.news = payload.snippets.news ?? doc.snippets.news
        doc.snippets.objectives = payload.snippets.objectives ?? doc.snippets.objectives
        doc.snippets.gallery = payload.snippets.gallery ?? doc.snippets.gallery
      }
      if (payload.contactInfo) {
        doc.contactInfo.address = payload.contactInfo.address ?? doc.contactInfo.address
        doc.contactInfo.email = payload.contactInfo.email ?? doc.contactInfo.email
        doc.contactInfo.phone = payload.contactInfo.phone ?? doc.contactInfo.phone
      }
      if (payload.emergencyAlert) {
        doc.emergencyAlert.enabled = payload.emergencyAlert.enabled ?? doc.emergencyAlert.enabled
        doc.emergencyAlert.message = payload.emergencyAlert.message ?? doc.emergencyAlert.message
        doc.emergencyAlert.severity = payload.emergencyAlert.severity ?? doc.emergencyAlert.severity
        doc.emergencyAlert.link = payload.emergencyAlert.link ?? doc.emergencyAlert.link
      }
      if (payload.footer) {
        doc.footer.address = payload.footer.address ?? doc.footer.address
        doc.footer.email = payload.footer.email ?? doc.footer.email
        doc.footer.phone = payload.footer.phone ?? doc.footer.phone
      }
      await doc.save()
    } else {
      doc = await HomeContent.create(payload)
    }
    res.json(doc)
  } catch (e) {
    res.status(500).json({ message: 'Server error' })
  }
}

const deleteHeroImage = async (req, res) => {
  try {
    const index = Number(req.params.index)
    if (Number.isNaN(index)) return res.status(400).json({ message: 'Invalid index' })
    const doc = await HomeContent.findOne()
    if (!doc) return res.status(404).json({ message: 'Home content not found' })
    if (!Array.isArray(doc.hero.images) || index < 0 || index >= doc.hero.images.length) {
      return res.status(400).json({ message: 'Index out of range' })
    }
    const [removed] = doc.hero.images.splice(index, 1)
    await doc.save()
    await deleteFile(removed)
    res.json({ success: true })
  } catch (e) {
    res.status(500).json({ message: 'Server error' })
  }
}

module.exports = { getHome, updateHome, deleteHeroImage }
