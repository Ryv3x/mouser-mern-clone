import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, X, AlertCircle, CheckCircle } from 'lucide-react';
import api from '../services/api';
import Button from '../components/ui/Button';

const SellerAddProduct = () => {
  const [form, setForm] = useState({
    name: '',
    manufacturer: '',
    manufacturerPartNumber: '',
    price: '',
    sellerPrice: '',
    stock: '',
    minQuantity: 1,
    description: '',
    images: [],
    category: '',
    specifications: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const navigate = useNavigate();

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const { data } = await api.get('/categories');
        setCategories(data || []);
        console.log('Categories fetched:', data);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
        setError('Failed to load categories. Please refresh the page.');
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!form.name.trim()) {
      setError('Product name is required');
      return;
    }
    if (!form.price || parseFloat(form.price) <= 0) {
      setError('Valid price is required');
      return;
    }
    if (form.sellerPrice && parseFloat(form.sellerPrice) < 0) {
      setError('Seller price must be non-negative');
      return;
    }
    if (!form.minQuantity || parseInt(form.minQuantity, 10) < 1) {
      setError('Minimum quantity must be at least 1');
      return;
    }
    if (!form.stock || parseInt(form.stock) < 0) {
      setError('Valid stock quantity is required');
      return;
    }

    try {
      setSubmitting(true);
      let specs = {};
      if (form.specifications === 'idk') specs = {};
      else if (form.specifications) {
        try {
          specs = JSON.parse(form.specifications);
        } catch (e) {
          specs = {};
        }
      }
      const payload = {
        ...form,
        price: parseFloat(form.price),
        sellerPrice: form.sellerPrice !== '' ? parseFloat(form.sellerPrice) : undefined,
        minQuantity: parseInt(form.minQuantity, 10),
        stock: parseInt(form.stock, 10),
        images: form.images.filter((img) => img.trim()),
        specifications: specs,
      };
      const { data } = await api.post('/seller/products', payload);
      setSuccess(true);
      setTimeout(() => navigate('/seller/products'), 2000);
    } catch (err) {
      console.error('Add product failed:', err);
      const errMsg = err.response?.data?.message || err.message || 'Failed to add product';
      setError(errMsg);
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <motion.div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <motion.div
          className="text-center p-12 bg-white rounded-2xl shadow-2xl max-w-md border-2 border-green-200"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}>
            <CheckCircle size={64} className="mx-auto mb-4 text-green-600" />
          </motion.div>
          <h2 className="text-3xl font-bold mb-2 text-green-600">Product Added!</h2>
          <p className="text-gray-600">Your product has been successfully added and is now live on the marketplace.</p>
          <p className="text-xs text-gray-500 mt-4">Redirecting to your products...</p>
        </motion.div>
      </motion.div>
    );
  }

  const addImageField = () => {
    setForm({ ...form, images: [...form.images, ''] });
  };

  const removeImageField = (idx) => {
    setForm({ ...form, images: form.images.filter((_, i) => i !== idx) });
  };

  const updateImageField = (idx, value) => {
    const updated = [...form.images];
    updated[idx] = value;
    setForm({ ...form, images: updated });
  };

  return (
    <motion.div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-16 px-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="container mx-auto max-w-4xl">
        <motion.div
          className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Add New Product</h2>
            <p className="text-gray-600">List a new product on the Mouser platform</p>
          </div>

          {/* Error Alert */}
          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg flex gap-3">
              <AlertCircle size={24} className="text-red-600 flex-shrink-0" />
              <div>
                <p className="font-semibold text-red-800">Error</p>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </motion.div>
          )}

          <form onSubmit={submit} className="space-y-8">
            {/* Product Basic Info */}
            <div className="bg-gradient-to-r from-blue-50 to-gray-50 p-6 rounded-lg border border-blue-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Product Information</h3>

              <motion.div whileHover={{ scale: 1.01 }} className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Product Name *</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g., Arduino UNO R3"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
                />
              </motion.div>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <motion.div whileHover={{ scale: 1.01 }}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Manufacturer</label>
                  <input
                    value={form.manufacturer}
                    onChange={(e) => setForm({ ...form, manufacturer: e.target.value })}
                    placeholder="e.g., Arduino"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
                  />
                </motion.div>

                <motion.div whileHover={{ scale: 1.01 }}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Part Number</label>
                  <input
                    value={form.manufacturerPartNumber}
                    onChange={(e) => setForm({ ...form, manufacturerPartNumber: e.target.value })}
                    placeholder="Manufacturer Part Number"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
                  />
                </motion.div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <motion.div whileHover={{ scale: 1.01 }}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price (USD) *</label>
                  <input
                    required
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    placeholder="0.00"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
                  />
                </motion.div>
                
                <motion.div whileHover={{ scale: 1.01 }}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Stock Quantity *</label>
                  <input
                    required
                    type="number"
                    min="0"
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                    placeholder="0"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
                  />
                </motion.div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <motion.div whileHover={{ scale: 1.01 }}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Seller Price (optional)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.sellerPrice}
                    onChange={(e) => setForm({ ...form, sellerPrice: e.target.value })}
                    placeholder="Leave empty to use base price"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
                  />
                  <p className="text-xs text-gray-500 mt-1">Optional: set a seller-specific price</p>
                </motion.div>

                <motion.div whileHover={{ scale: 1.01 }}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Order Quantity</label>
                  <input
                    type="number"
                    min="1"
                    value={form.minQuantity}
                    onChange={(e) => setForm({ ...form, minQuantity: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
                  />
                  <p className="text-xs text-gray-500 mt-1">Default is 1</p>
                </motion.div>
              </div>

              <motion.div whileHover={{ scale: 1.01 }}>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                <select
                  required
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  disabled={loadingCategories}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">
                    {loadingCategories ? 'Loading categories...' : 'Select a category'}
                  </option>
                  {categories.length > 0 ? (
                    categories.map((cat) => (
                      <option key={cat._id} value={cat.slug}>
                        {cat.name}
                      </option>
                    ))
                  ) : (
                    !loadingCategories && (
                      <option disabled>No categories available</option>
                    )
                  )}
                </select>
              </motion.div>
            </div>

            {/* Description & Details */}
            <div className="bg-gradient-to-r from-green-50 to-gray-50 p-6 rounded-lg border border-green-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Details</h3>

              <motion.div whileHover={{ scale: 1.01 }} className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Detailed product description, features, and usage..."
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200 transition resize-none"
                  rows={5}
                />
              </motion.div>

              <motion.div whileHover={{ scale: 1.01 }}>
                <label className="block text-sm font-medium text-gray-700 mb-2">Specifications (JSON)</label>
                <textarea
                  value={form.specifications}
                  onChange={(e) => setForm({ ...form, specifications: e.target.value })}
                  placeholder='{"voltage": "5V", "current": "50mA"}'
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200 transition resize-none"
                  rows={3}
                />
              </motion.div>
            </div>

            {/* Images */}
            <div className="bg-gradient-to-r from-purple-50 to-gray-50 p-6 rounded-lg border border-purple-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Product Images</h3>
                <motion.button
                  type="button"
                  onClick={addImageField}
                  className="flex items-center gap-1 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-sm font-medium"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Plus size={16} /> Add Image
                </motion.button>
              </div>

              <div className="space-y-3">
                {form.images.length === 0 ? (
                  <p className="text-gray-500 text-sm">Add image URLs to display your product</p>
                ) : (
                  form.images.map((img, idx) => (
                    <motion.div key={idx} className="flex gap-2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                      <input
                        type="url"
                        value={img}
                        onChange={(e) => updateImageField(idx, e.target.value)}
                        placeholder="https://example.com/image.jpg"
                        className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200 transition"
                      />
                      <motion.button
                        type="button"
                        onClick={() => removeImageField(idx)}
                        className="p-3 text-red-600 hover:bg-red-50 rounded-lg transition"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <X size={20} />
                      </motion.button>
                    </motion.div>
                  ))
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <motion.div className="flex gap-3 pt-4 flex-col sm:flex-row">
              <Button type="submit" variant="primary" disabled={submitting} className="flex-1 py-3 text-lg">
                {submitting ? (
                  <>
                    <span className="inline-block animate-spin mr-2">⏳</span>
                    Adding...
                  </>
                ) : (
                  '✓ Add Product'
                )}
              </Button>
              <Button type="button" variant="secondary" onClick={() => navigate('/seller/products')} className="flex-1 py-3 text-lg">
                Cancel
              </Button>
            </motion.div>
          </form>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default SellerAddProduct;
