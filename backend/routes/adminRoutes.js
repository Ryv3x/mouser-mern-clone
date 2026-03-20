import express from 'express';
import {
  getDashboard,
  getSellerApplications,
  getSellers,
  approveApplication,
  rejectApplication,
  approveProduct,
  rejectProduct,
  getAllProducts,
  sendNotificationAll,
  notifyUser,
  demoteSeller,
  getHomeSettings,
  updateHomeSettings,
  updateCategoryIcon,
  getHelpPages,
  createHelpPage,
  updateHelpPage,
  deleteHelpPage,
  banUser,
  unbanUser,
} from '../controllers/adminController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';
import {
  getSponsors,
  createSponsor,
  updateSponsor,
  deleteSponsor,
  clearSponsors,
} from '../controllers/sponsorController.js';

const router = express.Router();

router.get('/dashboard', protect, authorize('admin'), getDashboard);
router.get('/seller-applications', protect, authorize('admin'), getSellerApplications);
router.get('/sellers', protect, authorize('admin'), getSellers);
router.put('/seller-applications/:id/approve', protect, authorize('admin'), approveApplication);
router.put('/seller-applications/:id/reject', protect, authorize('admin'), rejectApplication);

// product review actions
router.get('/products', protect, authorize('admin'), getAllProducts);
router.put('/products/:id/approve', protect, authorize('admin'), approveProduct);
router.put('/products/:id/reject', protect, authorize('admin'), rejectProduct);

// broadcast notification to all users
router.post('/notify-all', protect, authorize('admin'), sendNotificationAll);

// notify individual user
router.post('/notify-user/:id', protect, authorize('admin'), notifyUser);

// demote seller
router.put('/sellers/:id/demote', protect, authorize('admin'), demoteSeller);
router.put('/sellers/:id/ban', protect, authorize('admin'), banUser);
router.put('/sellers/:id/unban', protect, authorize('admin'), unbanUser);

// sponsor management
router.get('/sponsors', protect, authorize('admin'), getSponsors);
router.post('/sponsors', protect, authorize('admin'), createSponsor);
router.put('/sponsors/:id', protect, authorize('admin'), updateSponsor);
router.delete('/sponsors/:id', protect, authorize('admin'), deleteSponsor);
// clear all sponsors
router.delete('/sponsors', protect, authorize('admin'), clearSponsors);

// home settings management
router.get('/home-settings', protect, authorize('admin'), getHomeSettings);
router.put('/home-settings', protect, authorize('admin'), updateHomeSettings);
router.put('/categories/:categoryId/icon', protect, authorize('admin'), updateCategoryIcon);

// help pages management
router.get('/help-pages', protect, authorize('admin'), getHelpPages);
router.post('/help-pages', protect, authorize('admin'), createHelpPage);
router.put('/help-pages/:id', protect, authorize('admin'), updateHelpPage);
router.delete('/help-pages/:id', protect, authorize('admin'), deleteHelpPage);

export default router;
