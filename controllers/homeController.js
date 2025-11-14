const HomeContent = require('../models/homeModel')

const getHome = async (req, res) => {
  try {
    const doc = await HomeContent.findOne()
    if (!doc) return res.status(404).json({ message: 'Home content not found' })
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
    doc.hero.images.splice(index, 1)
    await doc.save()
    res.json({ success: true })
  } catch (e) {
    res.status(500).json({ message: 'Server error' })
  }
}

module.exports = { getHome, updateHome, deleteHeroImage }
