const express = require('express');
const router = express.Router();
const allotmentController = require('../controllers/allotmentController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/allot', authMiddleware, allotmentController.allotQuarter);
router.post('/cancel/:id', authMiddleware, allotmentController.cancelAllotment);

module.exports = router;
