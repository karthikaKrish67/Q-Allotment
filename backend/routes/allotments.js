const express = require('express');
const router = express.Router();
const allotmentController = require('../controllers/allotmentController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, allotmentController.getAllAllotments);
router.get('/my-allotment', authMiddleware, allotmentController.getMyAllotment);
router.post('/allot', authMiddleware, allotmentController.allotQuarter);
router.post('/cancel/:id', authMiddleware, allotmentController.cancelAllotment);

module.exports = router;

