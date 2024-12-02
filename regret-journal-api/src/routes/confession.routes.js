const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  createConfession,
  getConfessions,
  getConfessionById,
  updateConfession,
  deleteConfession,
  getNearbyConfessions,
  reactToConfession
} = require('../controllers/confession.controller');

// Public routes
router.get('/', getConfessions);
router.get('/nearby', getNearbyConfessions);
router.get('/:id', getConfessionById);

// Protected routes
router.use(protect);
router.post('/', createConfession);
router.put('/:id', updateConfession);
router.delete('/:id', deleteConfession);
router.post('/:id/react', reactToConfession);

module.exports = router;
