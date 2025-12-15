const express = require('express');
const router = express.Router();
const quarterController = require('../controllers/quarterController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, quarterController.createQuarter);
router.get('/', authMiddleware, quarterController.getAllQuarters);
router.put('/:id', authMiddleware, quarterController.updateQuarter);
router.delete('/:id', authMiddleware, quarterController.deleteQuarter);

module.exports = router;
