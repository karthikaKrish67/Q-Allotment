const express = require('express');
const router = express.Router();
const blockController = require('../controllers/blockController');
const authenticateToken = require('../middleware/authMiddleware');

router.post('/', authenticateToken, blockController.createBlock);
router.get('/', authenticateToken, blockController.getAllBlocks);
router.delete('/:name', authenticateToken, blockController.deleteBlock);

module.exports = router;
