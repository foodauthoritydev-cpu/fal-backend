const express = require('express')
const router = express.Router()
const { login, logout, me, createUser, listUsers, updatePassword, setActive } = require('../controllers/userController')

router.post('/login', login)
router.post('/logout', logout)
router.get('/me', me)
router.post('/', createUser)
router.get('/', listUsers)
router.patch('/password', updatePassword)
router.patch('/status', setActive)

module.exports = router
