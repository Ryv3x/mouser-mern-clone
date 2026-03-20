import Category from '../models/Category.js';

export const getCategories = async (req, res) => {
  const categories = await Category.find();
  res.json(categories);
};

export const getCategoryBySlug = async (req, res) => {
  const category = await Category.findOne({ slug: req.params.slug });
  if (category) {
    res.json(category);
  } else {
    res.status(404).json({ message: 'Category not found' });
  }
};

export const createCategory = async (req, res) => {
  try {
    const { name, slug, parentCategory, level } = req.body;
    if (!name || !slug) {
      return res.status(400).json({ message: 'Name and slug are required' });
    }
    const existing = await Category.findOne({ slug });
    if (existing) {
      return res.status(400).json({ message: 'Category with this slug already exists' });
    }
    const category = new Category({ name, slug, parentCategory, level: level || 0 });
    const saved = await category.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create category: ' + err.message });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { name, slug, parentCategory, level } = req.body;
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    if (slug && slug !== category.slug) {
      const existing = await Category.findOne({ slug });
      if (existing) {
        return res.status(400).json({ message: 'Category with this slug already exists' });
      }
    }
    if (name) category.name = name;
    if (slug) category.slug = slug;
    if (parentCategory) category.parentCategory = parentCategory;
    if (level !== undefined) category.level = level;
    const updated = await category.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update category: ' + err.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json({ message: 'Category deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete category: ' + err.message });
  }
};
