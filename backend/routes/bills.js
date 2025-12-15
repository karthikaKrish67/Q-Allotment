const express = require('express');
const router = express.Router();
const billController = require('../controllers/billController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, billController.generateBill);
router.get('/', authMiddleware, billController.getBills);
router.put('/:id/pay', authMiddleware, billController.markAsPaid);

module.exports = router;
