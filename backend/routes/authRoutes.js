import express from 'express';
import { register, login, getProfile, verifyEmail, resendVerificationEmail } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/verify-email/:token', verifyEmail);
router.post('/resend-verification', resendVerificationEmail);
router.get('/profile', protect, getProfile);

export default router;
