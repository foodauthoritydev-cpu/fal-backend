const requireAuth = (req, res, next) => {
  if (req.session && req.session.user && req.session.user.id) return next()
  res.status(401).json({ message: 'Unauthorized' })
}

const requireRole = roles => (req, res, next) => {
  if (!(req.session && req.session.user && req.session.user.role)) return res.status(401).json({ message: 'Unauthorized' })
  if (!roles.includes(req.session.user.role)) return res.status(403).json({ message: 'Forbidden' })
  next()
}

module.exports = { requireAuth, requireRole }
