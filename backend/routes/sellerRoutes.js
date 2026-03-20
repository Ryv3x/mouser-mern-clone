import express from 'express';
import { applySeller, getSellerProducts, addSellerProduct, getSellerProfile, getSellerProductsPublic, getAllSellersPublic, updateSellerProfile, getSellerOrders } from '../controllers/sellerController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.post('/apply', protect, applySeller);
router.get('/products', protect, authorize('seller'), getSellerProducts);
router.post('/products', protect, authorize('seller'), addSellerProduct);
router.get('/orders', protect, authorize('seller'), getSellerOrders);

// Public routes for seller profile and products
// Public list of approved sellers
router.get('/list', getAllSellersPublic);
// Public routes for seller profile and products
router.get('/:sellerId', getSellerProfile);
router.get('/:sellerId/products', getSellerProductsPublic);
// Update seller profile (seller or admin)
router.put('/:sellerId', protect, authorize('seller','admin'), updateSellerProfile);

export default router;
