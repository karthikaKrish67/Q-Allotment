const express = require('express');
const router = express.Router();
const unEmployeeController = require('../controllers/unEmployeeController');
const authMiddleware = require('../middleware/authMiddleware');

// Protect all routes with authMiddleware? Or just admin?
// For now, assuming logged in users (mostly admin) can access.

router.post('/', authMiddleware, unEmployeeController.createUnEmployee);
router.get('/', authMiddleware, unEmployeeController.getAllUnEmployees);
router.get('/:id', authMiddleware, unEmployeeController.getUnEmployee);
router.put('/:id', authMiddleware, unEmployeeController.updateUnEmployee);
router.delete('/:id', authMiddleware, unEmployeeController.deleteUnEmployee);

module.exports = router;
