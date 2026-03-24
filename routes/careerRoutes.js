const express = require('express')
const router = express.Router()
const {
  getPage, updatePage,
  listJobs, getJob, createJob, updateJob, deleteJob,
  submitApplication, listApplications, updateApplicationStatus, deleteApplication
} = require('../controllers/careerController')
const { requireAuth, requireRole } = require('../middleware/auth')

// Public
router.get('/page', getPage)
router.get('/jobs', listJobs)
router.get('/jobs/:id', getJob)
router.post('/applications', submitApplication)

// Admin
router.put('/page', requireAuth, requireRole(['superAdmin', 'admin']), updatePage)
router.post('/jobs', requireAuth, requireRole(['superAdmin', 'admin']), createJob)
router.put('/jobs/:id', requireAuth, requireRole(['superAdmin', 'admin']), updateJob)
router.delete('/jobs/:id', requireAuth, requireRole(['superAdmin', 'admin']), deleteJob)
router.get('/applications', requireAuth, requireRole(['superAdmin', 'admin']), listApplications)
router.patch('/applications/:id', requireAuth, requireRole(['superAdmin', 'admin']), updateApplicationStatus)
router.delete('/applications/:id', requireAuth, requireRole(['superAdmin', 'admin']), deleteApplication)

module.exports = router
