import express from 'express';
import {
  getProfile,
  updateProfile,
  changePassword,
  updatePreferences,
  deleteAccount,
  getNotifications,
  markNotificationRead,
  markAllRead,
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);
router.put('/preferences', protect, updatePreferences);
router.delete('/account', protect, deleteAccount);
router.get('/notifications', protect, getNotifications);
router.put('/notifications/:id/read', protect, markNotificationRead);
router.put('/notifications/read-all', protect, markAllRead);

export default router;
