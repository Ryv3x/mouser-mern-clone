import express from 'express';
import { getHelpPageBySlug } from '../controllers/publicController.js';

const router = express.Router();

router.get('/help/:slug', getHelpPageBySlug);

export default router;
