import express from 'express';

const router = express.Router();

// Public home settings endpoint
export const getHomeSettingsPublic = async (req, res) => {
  try {
    const HomeSettings = (await import('../models/HomeSettings.js')).default;
    let settings = await HomeSettings.findOne()
      .populate('featuredProductIds', 'name price images')
      .populate('displayedCategoryIds', 'name slug icon');
    
    if (!settings) {
      settings = {
        heroTitle: 'Welcome to Mouser',
        heroSlogan: '',
        heroSubtitle: 'Your trusted source for electronic components and gadgets',
        heroButtonText: 'Shop Now',
        heroBgImage: '',
        heroBgColor: 'from-blue-600 to-blue-700',
        featuredProductIds: [],
        displayedCategoryIds: [],
      };
    }
    res.json(settings);
  } catch (err) {
    console.error('Get home settings error:', err);
    res.status(500).json({ message: 'Failed to fetch home settings: ' + err.message });
  }
};

router.get('/', getHomeSettingsPublic);

export default router;
