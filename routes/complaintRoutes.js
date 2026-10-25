const express = require('express')
const router = express.Router()
const { requireAuth, requireRole } = require('../middleware/auth')
const { submitComplaint, listComplaints, updateComplaintStatus } = require('../controllers/complaintController')

router.post('/', submitComplaint)
router.get('/', requireAuth, requireRole(['superAdmin', 'admin']), listComplaints)
router.patch('/:id', requireAuth, requireRole(['superAdmin', 'admin']), updateComplaintStatus)

module.exports = router
