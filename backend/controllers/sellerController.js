import SellerApplication from '../models/SellerApplication.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import fs from 'fs';
import path from 'path';

export const applySeller = async (req, res) => {
  try {
    const existing = await SellerApplication.findOne({ user: req.user._id });
    if (existing) {
      return res.status(400).json({ message: 'Application already submitted' });
    }
    const app = new SellerApplication({ user: req.user._id, ...req.body });
    const created = await app.save();
    res.status(201).json(created);
  } catch (err) {
    console.error('Apply seller error:', err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: Object.values(err.errors)[0]?.message || 'Validation error' });
    }
    res.status(500).json({ message: 'Failed to submit application: ' + err.message });
  }
};

export const getSellerProducts = async (req, res) => {
  try {
    const products = await Product.find({ seller: req.user._id });
    res.json(products);
  } catch (err) {
    console.error('Get seller products error:', err);
    res.status(500).json({ message: 'Failed to fetch products: ' + err.message });
  }
};

export const addSellerProduct = async (req, res) => {
  try {
    let { name, price, stock, images, category, manufacturer, manufacturerPartNumber, description, specifications } = req.body;

    // Cheatcode: if any field is 'idk' treat as safe default
    const anyIdk = [name, price, stock, ...(images || []), category, manufacturer, manufacturerPartNumber, description, specifications].some((v) => v === 'idk');
    if (anyIdk) {
      name = name === 'idk' ? 'Unknown Product' : name;
      price = price === 'idk' ? 0 : price;
      stock = stock === 'idk' ? 0 : stock;
      images = Array.isArray(images) ? images.map((i) => (i === 'idk' ? '' : i)) : [];
      category = category === 'idk' ? null : category;
      manufacturer = manufacturer === 'idk' ? '' : manufacturer;
      manufacturerPartNumber = manufacturerPartNumber === 'idk' ? '' : manufacturerPartNumber;
      description = description === 'idk' ? '' : description;
      specifications = specifications === 'idk' ? {} : specifications;
    }

    // Basic validation (allow zero price/stock only when cheatcode used)
    if (!name || !String(name).trim()) {
      return res.status(400).json({ message: 'Product name is required' });
    }
    if ((price === undefined || price === null || parseFloat(price) < 0) && !anyIdk) {
      return res.status(400).json({ message: 'Valid price is required' });
    }
    if ((stock === undefined || parseInt(stock) < 0) && !anyIdk) {
      return res.status(400).json({ message: 'Valid stock quantity is required' });
    }

    // Handle category: allow passing slug/name instead of ObjectId
    let categoryId = null;
    if (category) {
      // if it's a valid ObjectId string let mongoose cast it; otherwise try to resolve
      const mongoose = await import('mongoose');
      if (mongoose.Types.ObjectId.isValid(String(category))) {
        categoryId = category;
      } else {
        // try to find category by slug or name (case-insensitive)
        const Category = (await import('../models/Category.js')).default;
        const found = await Category.findOne({ $or: [{ slug: String(category).toLowerCase() }, { name: new RegExp('^' + String(category) + '$', 'i') }] });
        if (found) categoryId = found._id;
        else categoryId = null; // avoid cast error by using null
      }
    }

    const product = new Product({
      name: String(name).trim(),
      price: parseFloat(price) || 0,
      stock: parseInt(stock, 10) || 0,
      images: Array.isArray(images) ? images.filter((img) => img && String(img).trim()) : [],
      category: categoryId,
      manufacturer: manufacturer || '',
      manufacturerPartNumber: manufacturerPartNumber || '',
      description: description || '',
      specifications: specifications || {},
      seller: req.user._id,
      reviewStatus: anyIdk ? 'pending' : 'pending',
      active: anyIdk ? false : false,
    });

    const created = await product.save();
    res.status(201).json(created);
  } catch (err) {
    console.error('Add product error:', err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: Object.values(err.errors)[0]?.message || 'Validation error' });
    }
    res.status(500).json({ message: 'Failed to add product: ' + err.message });
  }
};

export const getSellerProfile = async (req, res) => {
  try {
    const { sellerId } = req.params;
    const seller = await User.findById(sellerId)
      .select('name email phone address description logo availableTime availableTimes bestProducts bannerColor deliveryOptions featuredCategories createdAt')
      .populate({ path: 'bestProducts', select: 'name price images active' })
      .populate({ path: 'featuredCategories', select: 'name slug' });
    
    if (!seller) {
      return res.status(404).json({ message: 'Seller not found' });
    }

    // Calculate seller rating based on product reviews (if applicable)
    const products = await Product.find({ seller: sellerId, active: true });
    const avgRating = products.length > 0 
      ? products.reduce((sum, p) => sum + (p.rating || 0), 0) / products.length 
      : 0;

    const out = seller.toObject();
    delete out.password;

    res.json({
      ...out,
      rating: Number(avgRating.toFixed(1)),
      totalProducts: products.length
    });
  } catch (err) {
    console.error('Get seller profile error:', err);
    res.status(500).json({ message: 'Failed to fetch seller profile: ' + err.message });
  }
};

export const getSellerProductsPublic = async (req, res) => {
  try {
    const { sellerId } = req.params;
    const products = await Product.find({ seller: sellerId, active: true })
      .populate('category', 'name slug')
      .populate('seller', 'name');
    
    res.json(products || []);
  } catch (err) {
    console.error('Get seller products error:', err);
    res.status(500).json({ message: 'Failed to fetch seller products: ' + err.message });
  }
};

export const getAllSellersPublic = async (req, res) => {
  try {
    const sellers = await User.find({ role: 'seller', sellerApproved: true, banned: { $ne: true } })
      .select('-password -notifications');
    res.json(sellers || []);
  } catch (err) {
    console.error('Get all sellers public error:', err);
    res.status(500).json({ message: 'Failed to fetch sellers: ' + err.message });
  }
};

export const updateSellerProfile = async (req, res) => {
  try {
    const { sellerId } = req.params;
    const seller = await User.findById(sellerId);
    if (!seller) return res.status(404).json({ message: 'Seller not found' });

    // only admin or the seller themselves may update profile
    if (!(req.user.role === 'admin' || String(req.user._id) === String(sellerId))) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    // Fields sellers can update
    const updatable = ['name', 'description', 'logo', 'phone', 'address', 'availableTime', 'bannerColor'];
    updatable.forEach((key) => {
      if (req.body[key] !== undefined) seller[key] = req.body[key];
    });

    // Allow updating bestProducts only if the caller is the seller themself (not a generic user)
    if (req.body.bestProducts !== undefined) {
      // only seller owner or admin can update; but enforce product ownership
      const candidate = req.body.bestProducts;
      if (!Array.isArray(candidate)) {
        return res.status(400).json({ message: 'bestProducts must be an array of product IDs' });
      }

      // validate each id and ensure the product belongs to this seller
      const mongoose = await import('mongoose');
      const validIds = [];
      for (const pid of candidate) {
        if (!mongoose.Types.ObjectId.isValid(String(pid))) continue;
        const prod = await Product.findById(pid).select('seller');
        if (!prod) continue;
        if (String(prod.seller) !== String(sellerId)) continue; // only allow own products
        validIds.push(pid);
      }

      seller.bestProducts = validIds;
    }

    // featuredCategories update (accept array of category ids)
    if (req.body.featuredCategories !== undefined) {
      const cats = req.body.featuredCategories;
      if (!Array.isArray(cats)) {
        return res.status(400).json({ message: 'featuredCategories must be an array of category IDs' });
      }
      const mongoose = await import('mongoose');
      const Category = (await import('../models/Category.js')).default;
      const validCats = [];
      for (const cid of cats) {
        if (!mongoose.Types.ObjectId.isValid(String(cid))) continue;
        const found = await Category.findById(cid).select('_id');
        if (found) validCats.push(cid);
      }
      seller.featuredCategories = validCats;
    }

    // deliveryOptions: accept comma-separated string or array
    if (req.body.deliveryOptions !== undefined) {
      if (Array.isArray(req.body.deliveryOptions)) seller.deliveryOptions = req.body.deliveryOptions;
      else if (typeof req.body.deliveryOptions === 'string') {
        seller.deliveryOptions = req.body.deliveryOptions.split(',').map((s) => s.trim()).filter(Boolean);
      } else {
        seller.deliveryOptions = [];
      }
    }

    // availableTimes: accept array of { dayRange, from, to } objects
    if (req.body.availableTimes !== undefined) {
      const slots = req.body.availableTimes;
      if (!Array.isArray(slots)) return res.status(400).json({ message: 'availableTimes must be an array' });
      // sanitize and keep only relevant keys
      const sanitized = [];
      for (const s of slots) {
        if (!s) continue;
        const dayRange = typeof s.dayRange === 'string' ? s.dayRange.trim() : '';
        const from = typeof s.from === 'string' ? s.from.trim() : '';
        const to = typeof s.to === 'string' ? s.to.trim() : '';
        if (!dayRange && !from && !to) continue;
        sanitized.push({ dayRange, from, to });
      }
      seller.availableTimes = sanitized;
    }

    // Handle base64 logo upload (data URL) and save to public/uploads/sellers
    if (req.body.logo && String(req.body.logo).startsWith('data:')) {
      try {
        const matches = String(req.body.logo).match(/^data:(image\/(png|jpeg|jpg|webp));base64,(.+)$/);
        if (matches) {
          const ext = matches[2] === 'jpeg' ? 'jpg' : matches[2];
          const buffer = Buffer.from(matches[3], 'base64');
          const uploadsDir = path.join(process.cwd(), 'backend', 'public', 'uploads', 'sellers');
          if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
          const fileName = `${sellerId}-${Date.now()}.${ext}`;
          const filePath = path.join(uploadsDir, fileName);
          fs.writeFileSync(filePath, buffer);
          // set public URL (assuming static serving from /uploads)
          seller.logo = `/uploads/sellers/${fileName}`;
        } else {
          console.warn('Logo data URI did not match expected pattern');
        }
      } catch (imgErr) {
        console.error('Failed to save logo image:', imgErr);
      }
    } else if (req.body.logo !== undefined) {
      // if logo provided as string URL, accept it
      seller.logo = req.body.logo;
    }

    await seller.save();
    const out = seller.toObject();
    delete out.password;
    res.json({ message: 'Profile updated', seller: out });
  } catch (err) {
    console.error('Update seller profile error:', err);
    res.status(500).json({ message: 'Failed to update seller profile: ' + err.message });
  }
};

export const getSellerOrders = async (req, res) => {
  try {
    const Order = (await import('../models/Order.js')).default;
    const orders = await Order.find({ 'items.seller': req.user._id }).populate('user', 'name email').sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error('Get seller orders error:', err);
    res.status(500).json({ message: 'Failed to fetch orders: ' + err.message });
  }
};
