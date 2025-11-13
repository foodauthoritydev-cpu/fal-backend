const express = require('express')
const router = express.Router()
const { getTeamPage, updateTeamPage, createMember, listMembers, getMember, updateMember, deleteMember } = require('../controllers/teamController')

router.get('/', getTeamPage)
router.put('/', updateTeamPage)
router.get('/members', listMembers)
router.post('/members', createMember)
router.get('/members/:id', getMember)
router.put('/members/:id', updateMember)
router.delete('/members/:id', deleteMember)

module.exports = router
