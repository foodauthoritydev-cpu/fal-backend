const express = require('express')
const router = express.Router()
const { getPage, updatePage, listJobs, createJob, updateJob, deleteJob } = require('../controllers/careerController')
const { requireAuth, requireRole } = require('../middleware/auth')

// Public
router.get('/page', getPage)
router.get('/jobs', listJobs)

// Admin
router.put('/page', requireAuth, requireRole(['superAdmin', 'admin']), updatePage)
router.post('/jobs', requireAuth, requireRole(['superAdmin', 'admin']), createJob)
router.put('/jobs/:id', requireAuth, requireRole(['superAdmin', 'admin']), updateJob)
router.delete('/jobs/:id', requireAuth, requireRole(['superAdmin', 'admin']), deleteJob)

module.exports = router
