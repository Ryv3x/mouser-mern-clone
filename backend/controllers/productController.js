import Product from '../models/Product.js';

export const getProducts = async (req, res) => {
  try {
    const filter = { active: true };
    const { category } = req.query;
    if (category) {
      // category may be an ObjectId or a slug/name
      const mongoose = await import('mongoose');
      if (mongoose.Types.ObjectId.isValid(String(category))) {
        filter.category = category;
      } else {
        const Category = (await import('../models/Category.js')).default;
        const found = await Category.findOne({ $or: [{ slug: String(category).toLowerCase() }, { name: new RegExp('^' + String(category) + '$', 'i') }] });
        if (found) filter.category = found._id;
        else filter.$expr = { $eq: [1, 0] }; // force empty result if no matching category
      }
    }
    const products = await Product.find(filter);
    res.json(products);
  } catch (err) {
    console.error('Get products error:', err);
    res.status(500).json({ message: 'Failed to fetch products: ' + err.message });
  }
};

export const getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
};

export const getProductReviews = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).select('reviews rating');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ reviews: product.reviews || [], rating: product.rating || 0 });
  } catch (err) {
    console.error('Get product reviews error:', err);
    res.status(500).json({ message: 'Failed to fetch reviews: ' + err.message });
  }
};

export const addProductReview = async (req, res) => {
  try {
    const { rating, title, content } = req.body;
    if (!rating || Number(rating) < 1 || Number(rating) > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // prevent duplicate reviews by same user
    const existing = product.reviews.find((r) => String(r.user) === String(req.user._id));
    if (existing) return res.status(400).json({ message: 'You have already reviewed this product' });

    const review = {
      user: req.user._id,
      name: req.user.name || req.user.email,
      rating: Number(rating),
      title: title || '',
      content: content || '',
      helpful: 0,
    };

    product.reviews.unshift(review);
    // recalculate aggregate rating and count
    product.numReviews = product.reviews.length;
    product.rating = product.reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / product.reviews.length;

    await product.save();
    res.status(201).json({ message: 'Review added', review });
  } catch (err) {
    console.error('Add product review error:', err);
    res.status(500).json({ message: 'Failed to add review: ' + err.message });
  }
};

export const createProduct = async (req, res) => {
  const product = new Product({ ...req.body, seller: req.user._id });
  const created = await product.save();
  res.status(201).json(created);
};

export const updateProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    Object.assign(product, req.body);
    const updated = await product.save();
    res.json(updated);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
};

export const deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    await product.remove();
    res.json({ message: 'Product removed' });
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
};

