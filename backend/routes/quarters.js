const express = require('express');
const router = express.Router();
const quarterController = require('../controllers/quarterController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, quarterController.createQuarter);
router.get('/', authMiddleware, quarterController.getAllQuarters);
router.get('/:id', authMiddleware, quarterController.getQuarterById);
router.get('/block/:block', authMiddleware, quarterController.getQuartersByBlock);
router.put('/:id', authMiddleware, quarterController.updateQuarter);
router.put('/:id/vacate', authMiddleware, quarterController.vacateQuarter);
router.delete('/:id', authMiddleware, quarterController.deleteQuarter);

module.exports = router;
