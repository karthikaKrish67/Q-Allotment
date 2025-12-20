const express = require('express');
const router = express.Router();
const nonEmployeeController = require('../controllers/nonEmployeeController');
const authMiddleware = require('../middleware/authMiddleware');

// Protect all routes with authMiddleware? Or just admin?
// For now, assuming logged in users (mostly admin) can access.

router.post('/', authMiddleware, nonEmployeeController.createNonEmployee);
router.get('/', authMiddleware, nonEmployeeController.getAllNonEmployees);
router.get('/:id', authMiddleware, nonEmployeeController.getNonEmployee);
router.put('/:id', authMiddleware, nonEmployeeController.updateNonEmployee);
router.delete('/:id', authMiddleware, nonEmployeeController.deleteNonEmployee);

module.exports = router;
