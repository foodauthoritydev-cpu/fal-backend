const User = require('../models/userModel')
const { hashPassword, comparePassword } = require('../utils/encryption')

const login = async (req, res) => {
  const { username, password } = req.body
  const user = await User.findOne({ username })
  if (!user || !user.isActive) return res.status(401).json({ message: 'Invalid credentials' })
  const ok = comparePassword(password, user.password)
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' })
  req.session.user = { id: user._id.toString(), role: user.role, username: user.username }
  res.json({ _id: user._id, username: user.username, role: user.role })
}

const logout = (req, res) => {
  if (!req.session) return res.json({ message: 'Logged out' })
  req.session.destroy(() => {
    res.clearCookie('connect.sid')
    res.json({ message: 'Logged out' })
  })
}

const me = (req, res) => {
  if (!req.session || !req.session.user) return res.status(401).json({ message: 'Unauthorized' })
  res.json(req.session.user)
}

const createUser = async (req, res) => {
  const { username, password, role } = req.body
  if (!username || !password || !role) return res.status(400).json({ message: 'Missing fields' })
  const exists = await User.findOne({ username })
  if (exists) return res.status(400).json({ message: 'User already exists' })
  const hashed = hashPassword(password)
  const user = await User.create({ username, password: hashed, role })
  res.status(201).json({ _id: user._id, username: user.username, role: user.role, isActive: user.isActive })
}

const listUsers = async (req, res) => {
  const users = await User.find({}, '_id username role isActive createdAt updatedAt').sort({ createdAt: -1 })
  res.json(users)
}

const updatePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body
  if (!req.session || !req.session.user) return res.status(401).json({ message: 'Unauthorized' })
  const user = await User.findById(req.session.user.id)
  if (!user) return res.status(404).json({ message: 'Not found' })
  if (!comparePassword(currentPassword, user.password)) return res.status(400).json({ message: 'Current password incorrect' })
  user.password = hashPassword(newPassword)
  await user.save()
  res.json({ success: true })
}

const setActive = async (req, res) => {
  const { userId, isActive } = req.body
  if (typeof isActive !== 'boolean') return res.status(400).json({ message: 'Invalid isActive' })
  const user = await User.findByIdAndUpdate(userId, { isActive }, { new: true })
  if (!user) return res.status(404).json({ message: 'Not found' })
  res.json({ _id: user._id, username: user.username, role: user.role, isActive: user.isActive })
}

module.exports = { login, logout, me, createUser, listUsers, updatePassword, setActive }
