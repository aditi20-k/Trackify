const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  toggleBlockUser,
  deleteUser,
  getAllExpenses,
  getAdminStats,
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/auth');

// All routes require auth + admin role
router.use(protect, adminOnly);

router.get('/stats', getAdminStats);
router.get('/users', getAllUsers);
router.put('/users/:id/block', toggleBlockUser);
router.delete('/users/:id', deleteUser);
router.get('/expenses', getAllExpenses);

module.exports = router;
