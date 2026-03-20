import SellerApplication from '../models/SellerApplication.js';
import User from '../models/User.js';

export const getDashboard = async (req, res) => {
  // simple stats
  const sellerCount = await User.countDocuments({ role: 'seller' });
  const userCount = await User.countDocuments({ role: 'user' });
  res.json({ sellerCount, userCount });
};

export const getSellerApplications = async (req, res) => {
  const apps = await SellerApplication.find().populate('user');
  res.json(apps);
};

export const getSellers = async (req, res) => {
  try {
    const sellers = await User.find({ role: 'seller' }).select('-password');
    res.json(sellers);
  } catch (err) {
    console.error('Get sellers error:', err);
    res.status(500).json({ message: 'Failed to fetch sellers: ' + err.message });
  }
};

export const approveApplication = async (req, res) => {
  try {
    const app = await SellerApplication.findById(req.params.id);
    if (!app) {
      return res.status(404).json({ message: 'Application not found' });
    }

    app.status = 'approved';
    await app.save();

    const user = await User.findById(app.user);
    if (user) {
      user.role = 'seller';
      user.sellerApproved = true;
      // add in-app notification for approval
      user.notifications = user.notifications || [];
      user.notifications.unshift({
        type: 'success',
        message: 'Your seller application has been approved. Your account is now a seller.',
        read: false,
        meta: { application: app._id },
      });
      await user.save();
    }

    res.json({ message: 'Application approved' });
  } catch (err) {
    console.error('Error approving application:', err);
    res.status(500).json({ message: 'Server error while approving application', error: err.message });
  }
};

export const rejectApplication = async (req, res) => {
  try {
    const app = await SellerApplication.findById(req.params.id);
    if (!app) {
      return res.status(404).json({ message: 'Application not found' });
    }

    app.status = 'rejected';
    await app.save();

    // notify user of rejection (optional reason in body)
    const user = await User.findById(app.user);
    if (user) {
      const { reason } = req.body || {};
      user.notifications = user.notifications || [];
      user.notifications.unshift({
        type: 'warning',
        message: reason
          ? `Your seller application was rejected: ${reason}`
          : 'Your seller application was rejected.',
        read: false,
        meta: { application: app._id },
      });
      await user.save();
    }

    res.json({ message: 'Application rejected' });
  } catch (err) {
    console.error('Error rejecting application:', err);
    res.status(500).json({ message: 'Server error while rejecting application', error: err.message });
  }
};

export const approveProduct = async (req, res) => {
  try {
    const Product = (await import('../models/Product.js')).default;
    const prod = await Product.findById(req.params.id);
    if (!prod) return res.status(404).json({ message: 'Product not found' });
    prod.reviewStatus = 'approved';
    prod.active = true;
    await prod.save();
    res.json({ message: 'Product approved' });
  } catch (err) {
    console.error('Approve product error:', err);
    res.status(500).json({ message: 'Failed to approve product: ' + err.message });
  }
};

export const rejectProduct = async (req, res) => {
  try {
    const Product = (await import('../models/Product.js')).default;
    const { reason } = req.body;
    const prod = await Product.findById(req.params.id);
    if (!prod) return res.status(404).json({ message: 'Product not found' });
    prod.reviewStatus = 'rejected';
    prod.active = false;
    prod.reviewNote = reason || 'Product rejected by admin';
    await prod.save();
    res.json({ message: 'Product rejected' });
  } catch (err) {
    console.error('Reject product error:', err);
    res.status(500).json({ message: 'Failed to reject product: ' + err.message });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const Product = (await import('../models/Product.js')).default;
    const products = await Product.find().populate('seller', 'name email').populate('category', 'name slug');
    res.json(products);
  } catch (err) {
    console.error('Get all products error:', err);
    res.status(500).json({ message: 'Failed to fetch products: ' + err.message });
  }
};

export const sendNotificationAll = async (req, res) => {
  try {
    const User = (await import('../models/User.js')).default;
    const { title, message, image } = req.body;
    if (!message && !title) return res.status(400).json({ message: 'Message or title required' });

    const users = await User.find();
    await Promise.all(users.map(async (u) => {
      u.notifications = u.notifications || [];
      u.notifications.unshift({
        type: 'info',
        title: title || '',
        message: message || '',
        image: image || null,
        read: false,
        meta: { broadcast: true },
      });
      await u.save();
    }));

    res.json({ message: 'Notifications sent' });
  } catch (err) {
    console.error('Send notification all error:', err);
    res.status(500).json({ message: 'Failed to send notifications: ' + err.message });
  }
};

export const notifyUser = async (req, res) => {
  try {
    const User = (await import('../models/User.js')).default;
    const { title, message, image } = req.body;
    if (!message && !title) return res.status(400).json({ message: 'Message or title required' });
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.notifications = user.notifications || [];
    user.notifications.unshift({
      type: 'info',
      title: title || '',
      message: message || '',
      image: image || null,
      read: false,
    });
    await user.save();
    res.json({ message: 'Notification sent to user' });
  } catch (err) {
    console.error('Notify user error:', err);
    res.status(500).json({ message: 'Failed to notify user: ' + err.message });
  }
};

export const demoteSeller = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.role = 'user';
    user.sellerApproved = false;
    user.notifications = user.notifications || [];
    const { reason } = req.body;
    user.notifications.unshift({
      type: 'warning',
      message: reason || 'Your seller account has been removed.',
      read: false,
    });
    await user.save();
    res.json({ message: 'Seller demoted to user' });
  } catch (err) {
    console.error('Demote seller error:', err);
    res.status(500).json({ message: 'Failed to demote seller: ' + err.message });
  }
};

export const banUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const { reason } = req.body || {};
    user.banned = true;
    user.banReason = reason || '';
    user.notifications = user.notifications || [];
    user.notifications.unshift({
      type: 'warning',
      message: reason ? `Your account has been banned: ${reason}` : 'Your account has been banned.',
      read: false,
    });
    await user.save();
    res.json({ message: 'User banned' });
  } catch (err) {
    console.error('Ban user error:', err);
    res.status(500).json({ message: 'Failed to ban user: ' + err.message });
  }
};

export const unbanUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.banned = false;
    user.banReason = '';
    user.notifications = user.notifications || [];
    user.notifications.unshift({
      type: 'success',
      message: 'Your account ban has been lifted. You may now access your account.',
      read: false,
    });
    await user.save();
    res.json({ message: 'User unbanned' });
  } catch (err) {
    console.error('Unban user error:', err);
    res.status(500).json({ message: 'Failed to unban user: ' + err.message });
  }
};

export const getHomeSettings = async (req, res) => {
  try {
    const HomeSettings = (await import('../models/HomeSettings.js')).default;
    let settings = await HomeSettings.findOne()
      .populate('featuredProductIds', 'name price images')
      .populate('displayedCategoryIds', 'name slug icon');
    
    if (!settings) {
      settings = new HomeSettings();
      await settings.save();
    }
    res.json(settings);
  } catch (err) {
    console.error('Get home settings error:', err);
    res.status(500).json({ message: 'Failed to fetch home settings: ' + err.message });
  }
};

export const updateHomeSettings = async (req, res) => {
  try {
    const HomeSettings = (await import('../models/HomeSettings.js')).default;
    const { heroTitle, heroSlogan, heroSubtitle, heroButtonText, heroBgImage, heroBgColor, featuredProductIds, displayedCategoryIds } = req.body;

    let settings = await HomeSettings.findOne();
    if (!settings) {
      settings = new HomeSettings();
    }

    if (heroTitle !== undefined) settings.heroTitle = heroTitle;
    if (heroSlogan !== undefined) settings.heroSlogan = heroSlogan;
    if (heroSubtitle !== undefined) settings.heroSubtitle = heroSubtitle;
    if (heroButtonText !== undefined) settings.heroButtonText = heroButtonText;
    if (heroBgImage !==undefined) settings.heroBgImage = heroBgImage;
    if (heroBgColor !== undefined) settings.heroBgColor = heroBgColor;
    if (featuredProductIds) settings.featuredProductIds = featuredProductIds;
    if (displayedCategoryIds) settings.displayedCategoryIds = displayedCategoryIds;

    await settings.save();
    res.json({ message: 'Home settings updated', settings });
  } catch (err) {
    console.error('Update home settings error:', err);
    res.status(500).json({ message: 'Failed to update home settings: ' + err.message });
  }
};

export const updateCategoryIcon = async (req, res) => {
  try {
    const Category = (await import('../models/Category.js')).default;
    const { categoryId } = req.params;
    const { icon } = req.body;

    const category = await Category.findByIdAndUpdate(
      categoryId,
      { icon },
      { new: true }
    );

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json({ message: 'Category icon updated', category });
  } catch (err) {
    console.error('Update category icon error:', err);
    res.status(500).json({ message: 'Failed to update category icon: ' + err.message });
  }
};

// ------ help pages management ------
export const getHelpPages = async (req, res) => {
  try {
    const HelpPage = (await import('../models/HelpPage.js')).default;
    const pages = await HelpPage.find().sort({ slug: 1 });
    res.json(pages);
  } catch (err) {
    console.error('Get help pages error:', err);
    res.status(500).json({ message: 'Failed to fetch help pages: ' + err.message });
  }
};

export const createHelpPage = async (req, res) => {
  try {
    const HelpPage = (await import('../models/HelpPage.js')).default;
    const { slug, title, content } = req.body;
    const exists = await HelpPage.findOne({ slug });
    if (exists) {
      return res.status(400).json({ message: 'Slug already exists' });
    }
    const page = new HelpPage({ slug, title, content });
    await page.save();
    res.status(201).json(page);
  } catch (err) {
    console.error('Create help page error:', err);
    res.status(500).json({ message: 'Failed to create help page: ' + err.message });
  }
};

export const updateHelpPage = async (req, res) => {
  try {
    const HelpPage = (await import('../models/HelpPage.js')).default;
    const { id } = req.params;
    const { title, content } = req.body;
    const page = await HelpPage.findById(id);
    if (!page) return res.status(404).json({ message: 'Page not found' });
    if (title !== undefined) page.title = title;
    if (content !== undefined) page.content = content;
    await page.save();
    res.json(page);
  } catch (err) {
    console.error('Update help page error:', err);
    res.status(500).json({ message: 'Failed to update help page: ' + err.message });
  }
};

export const deleteHelpPage = async (req, res) => {
  try {
    const HelpPage = (await import('../models/HelpPage.js')).default;
    const { id } = req.params;
    const page = await HelpPage.findByIdAndDelete(id);
    if (!page) return res.status(404).json({ message: 'Page not found' });
    res.json({ message: 'Page deleted' });
  } catch (err) {
    console.error('Delete help page error:', err);
    res.status(500).json({ message: 'Failed to delete help page: ' + err.message });
  }
};

