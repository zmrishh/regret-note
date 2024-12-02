const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');

// Protected routes
router.use(protect);

// Get user profile
router.get('/profile', (req, res) => {
  res.status(200).json({
    success: true,
    data: req.user
  });
});

// Update user profile
router.put('/profile', (req, res) => {
  // TODO: Implement profile update
  res.status(200).json({
    success: true,
    message: 'Profile updated successfully'
  });
});

module.exports = router;
