import HelpPage from '../models/HelpPage.js';

export const getHelpPageBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const page = await HelpPage.findOne({ slug });
    if (!page) {
      return res.status(404).json({ message: 'Page not found' });
    }
    res.json(page);
  } catch (err) {
    console.error('Get help page error:', err);
    res.status(500).json({ message: 'Failed to fetch help page: ' + err.message });
  }
};
