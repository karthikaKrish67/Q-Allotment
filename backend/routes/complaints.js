const express = require('express');
const router = express.Router();
const complaintController = require('../controllers/complaintController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, complaintController.createComplaint);
router.get('/', authMiddleware, complaintController.getAllComplaints);
router.put('/:id/status', authMiddleware, complaintController.updateComplaintStatus);

module.exports = router;
