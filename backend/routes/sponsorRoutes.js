import express from 'express';
import {
  getSponsors,
  createSponsor,
  updateSponsor,
  deleteSponsor,
} from '../controllers/sponsorController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

// public read
router.get('/', getSponsors);

// admin operations
router.post('/', protect, authorize('admin'), createSponsor);
router.put('/:id', protect, authorize('admin'), updateSponsor);
router.delete('/:id', protect, authorize('admin'), deleteSponsor);

export default router;
