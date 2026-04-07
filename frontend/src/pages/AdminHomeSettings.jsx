import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { Save, X } from 'lucide-react';
import api from '../services/api';
import { setProducts } from '../store/productSlice';

const AdminHomeSettings = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items: allProducts } = useSelector((state) => state.products);
  const admin = useSelector((state) => state.admin);
  const categories = Array.isArray(admin?.categories) ? admin.categories : [];

  const [settings, setSettings] = useState({
    heroTitle: 'Welcome to Mouser',
    heroSlogan: '',
    heroSubtitle: 'Your trusted source for electronic components and gadgets',
    heroButtonText: 'Shop Now',
    heroBgImage: '',
    heroBgColor: 'from-blue-600 to-blue-700',
    featuredProductIds: [],
    displayedCategoryIds: [],
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [bgImagePreview, setBgImagePreview] = useState('');
  const [categoryIcons, setCategoryIcons] = useState({});
  const [expandedCategory, setExpandedCategory] = useState(null);

  const ICON_OPTIONS = [
    '⚡', '🔧', '📱', '💻', '🖥️', '📡', '🔌', '🔋', '⚙️', '🛠️',
    '📦', '🎧', '📷', '🎮', '⌨️', '🖱️', '📟', '🎯', '🔬', '🧪'
  ];

  const BG_COLORS = [
    'from-blue-600 to-blue-700',
    'from-purple-600 to-purple-700',
    'from-green-600 to-green-700',
    'from-red-600 to-red-700',
    'from-pink-600 to-pink-700',
    'from-indigo-600 to-indigo-700',
    'from-gray-600 to-gray-700',
  ];

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/admin/home-settings');
        setSettings(data);
        setSelectedProducts(data.featuredProductIds.map(p => p._id) || []);
        setSelectedCategories(data.displayedCategoryIds.map(c => c._id) || []);
        setBgImagePreview(data.heroBgImage);
        
        // Fetch all products
        const { data: productsData } = await api.get('/admin/products');
        dispatch(setProducts(productsData));

        // Initialize category icons
        const icons = {};
        categories.forEach(cat => {
          icons[cat._id] = cat.icon || '📦';
        });
        setCategoryIcons(icons);
      } catch (err) {
        console.error('Failed to fetch settings:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, [dispatch, categories]);

  const handleProductToggle = (productId) => {
    setSelectedProducts(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleCategoryToggle = (categoryId) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleIconChange = async (categoryId, icon) => {
    try {
      setCategoryIcons(prev => ({ ...prev, [categoryId]: icon }));
      await api.put(`/admin/categories/${categoryId}/icon`, { icon });
    } catch (err) {
      console.error('Failed to update category icon:', err);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const updateData = {
        ...settings,
        featuredProductIds: selectedProducts,
        displayedCategoryIds: selectedCategories,
      };
      await api.put('/admin/home-settings', updateData);
      alert('Home settings updated successfully!');
    } catch (err) {
      console.error('Failed to save settings:', err);
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <motion.button
          onClick={() => navigate('/admin/dashboard')}
          className="mb-6 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <X size={20} /> Back to Dashboard
        </motion.button>

        <h1 className="text-4xl font-bold text-gray-900 mb-8">Customize Homepage</h1>

        {/* Hero Text Settings */}
        <motion.div
          className="bg-white rounded-lg shadow-lg p-8 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Hero Banner Settings</h2>
          
          <div className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Hero Title</label>
              <input
                type="text"
                value={settings.heroTitle}
                onChange={(e) => setSettings({ ...settings, heroTitle: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                placeholder="Enter hero title"
              />
            </div>

            {/* Slogan (small) */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Hero Slogan (Small tagline)</label>
              <input
                type="text"
                value={settings.heroSlogan}
                onChange={(e) => setSettings({ ...settings, heroSlogan: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                placeholder="Enter a short slogan or tagline"
              />
              <p className="text-xs text-gray-500 mt-2">Optional small text displayed above or near the title</p>
            </div>

            {/* Subtitle (Bigger) */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Hero Subtitle (Main Description)</label>
              <textarea
                value={settings.heroSubtitle}
                onChange={(e) => setSettings({ ...settings, heroSubtitle: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 text-lg font-semibold"
                placeholder="Enter hero subtitle (this will be displayed prominently)"
              />
              <p className="text-xs text-gray-500 mt-2">This text will appear bigger on the homepage</p>
            </div>

            {/* Button Text */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Button Text</label>
              <input
                type="text"
                value={settings.heroButtonText}
                onChange={(e) => setSettings({ ...settings, heroButtonText: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                placeholder="Button text"
              />
            </div>

            {/* Background Image URL */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Background Image URL</label>
              <input
                type="text"
                value={settings.heroBgImage}
                onChange={(e) => {
                  setSettings({ ...settings, heroBgImage: e.target.value });
                  setBgImagePreview(e.target.value);
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                placeholder="Leave empty for color background only"
              />
              <p className="text-xs text-gray-500 mt-2">Leave empty to use color background. If URL fails, defaults to color.</p>
              {bgImagePreview && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-2">Preview:</p>
                  <img src={bgImagePreview} alt="BG Preview" className="h-32 rounded-lg object-cover w-full" onError={() => setBgImagePreview('')} />
                </div>
              )}
            </div>

            {/* Background Color */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Background Gradient Color</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2">
                {BG_COLORS.map(color => (
                  <motion.button
                    key={color}
                    onClick={() => setSettings({ ...settings, heroBgColor: color })}
                    className={`h-12 rounded-lg border-4 transition-all ${settings.heroBgColor === color ? 'border-gray-900' : 'border-gray-300'}`}
                    style={{ backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))` }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className={`bg-gradient-to-r h-full w-full rounded-md ${color}`} />
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Featured Products Selection */}
        <motion.div
          className="bg-white rounded-lg shadow-lg p-8 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Select Featured Products</h2>
          <p className="text-gray-600 mb-4">These products will be displayed in the Featured Products section on the homepage</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto border border-gray-200 p-4 rounded-lg">
            {allProducts.map(product => (
              <motion.label
                key={product._id}
                className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-blue-50 cursor-pointer transition-colors"
                whileHover={{ scale: 1.02 }}
              >
                <input
                  type="checkbox"
                  checked={selectedProducts.includes(product._id)}
                  onChange={() => handleProductToggle(product._id)}
                  className="w-5 h-5 accent-blue-600"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm truncate">{product.name}</p>
                  <p className="text-xs text-gray-600">${product.price}</p>
                </div>
              </motion.label>
            ))}
          </div>
          <p className="text-sm text-gray-600 mt-4">Selected: {selectedProducts.length} products</p>
        </motion.div>

        {/* Categories Display & Icons */}
        <motion.div
          className="bg-white rounded-lg shadow-lg p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Manage Categories</h2>
          <p className="text-gray-600 mb-6">Select which categories to display and customize their icons</p>

          <div className="space-y-4">
            {categories.map(category => (
              <div key={category._id} className="border border-gray-200 rounded-lg">
                {/* Category Header */}
                <motion.button
                  onClick={() => setExpandedCategory(expandedCategory === category._id ? null : category._id)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  whileHover={{ backgroundColor: '#f9fafb' }}
                >
                  <div className="flex items-center gap-4">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category._id)}
                      onChange={() => handleCategoryToggle(category._id)}
                      className="w-5 h-5 accent-blue-600"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <div className="text-left">
                      <p className="font-semibold text-gray-900">{category.name}</p>
                      <p className="text-sm text-gray-600">Current icon: {categoryIcons[category._id] || '📦'}</p>
                    </div>
                  </div>
                  <div className="text-2xl">{categoryIcons[category._id] || '📦'}</div>
                </motion.button>

                {/* Icon Selector */}
                {expandedCategory === category._id && (
                  <motion.div
                    className="border-t border-gray-200 p-6 bg-gray-50"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <p className="text-sm font-semibold text-gray-700 mb-4">Select Icon:</p>
                    <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                      {ICON_OPTIONS.map(icon => (
                        <motion.button
                          key={icon}
                          onClick={() => handleIconChange(category._id, icon)}
                          className={`text-3xl p-3 rounded-lg transition-all ${
                            categoryIcons[category._id] === icon
                              ? 'bg-blue-600 scale-110'
                              : 'bg-white border border-gray-300 hover:border-blue-600'
                          }`}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {icon}
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-600 mt-4">Selected: {selectedCategories.length} categories</p>
        </motion.div>

        {/* Save Button */}
        <motion.button
          onClick={handleSave}
          disabled={saving}
          className="mt-8 w-full px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 font-semibold flex items-center justify-center gap-2 transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
        >
          <Save size={20} />
          {saving ? 'Saving...' : 'Save All Settings'}
        </motion.button>
      </div>
    </div>
  );
};

export default AdminHomeSettings;
