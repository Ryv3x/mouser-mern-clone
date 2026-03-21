import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Edit2, AlertCircle, CheckCircle } from 'lucide-react';
import api from '../services/api';
import { setCategories, addCategory, updateCategory, deleteCategory } from '../store/adminSlice';
import BackButton from '../components/ui/BackButton';

const AdminCategories = () => {
  const dispatch = useDispatch();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', slug: '' });
  const [iconImage, setIconImage] = useState('');
  const [emojiIcon, setEmojiIcon] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/categories');
      const cats = data || [];
      setCategories(cats);
      dispatch(setCategories(cats));
    } catch (err) {
      console.error('Failed to load categories:', err);
      setError('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [dispatch]);

  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]/g, '');
  };

  const handleNameChange = (value) => {
    setForm({ ...form, name: value, slug: generateSlug(value) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!form.name.trim() || !form.slug.trim()) {
      setError('Name and slug are required');
      return;
    }

    try {
      setLoading(true);
      if (editingId) {
        const payload = { ...form, iconImage: iconImage || undefined, icon: emojiIcon || form.icon || undefined };
        const { data } = await api.put(`/categories/${editingId}`, payload);
        setSuccess(`Category "${form.name}" updated successfully!`);
        dispatch(updateCategory(data));
      } else {
        const payload = { ...form, iconImage: iconImage || undefined, icon: emojiIcon || undefined };
        const { data } = await api.post('/categories', payload);
        setSuccess(`Category "${form.name}" created successfully!`);
        dispatch(addCategory(data));
      }
      setTimeout(() => {
        setForm({ name: '', slug: '' });
        setEditingId(null);
        setError(null);
        setSuccess(null);
        fetchCategories();
      }, 1500);
    } catch (err) {
      console.error('Failed to save category:', err);
      setError(err.response?.data?.message || 'Failed to save category');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (cat) => {
    setForm({ name: cat.name, slug: cat.slug });
    setEditingId(cat._id);
    setError(null);
    setSuccess(null);
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete category "${name}"?`)) return;
    try {
      setLoading(true);
      await api.delete(`/categories/${id}`);
      setSuccess(`"${name}" deleted successfully!`);
      dispatch(deleteCategory(id));
      setTimeout(() => {
        setSuccess(null);
        fetchCategories();
      }, 1500);
    } catch (err) {
      console.error('Failed to delete category:', err);
      setError('Failed to delete category');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setForm({ name: '', slug: '' });
    setEditingId(null);
    setError(null);
    setSuccess(null);
  };


  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50 p-6" 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
    >
      <div className="max-w-6xl mx-auto">
        <BackButton />
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent mb-2">Manage Categories</h1>
          <p className="text-gray-600">Create, edit, and organize product categories for your marketplace</p>
        </motion.div>

        {/* Alerts */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg flex gap-3"
            >
              <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
              <div>
                <p className="font-semibold text-red-800">Error</p>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </motion.div>
          )}
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-4 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg flex gap-3"
            >
              <CheckCircle className="text-green-600 flex-shrink-0" size={20} />
              <p className="font-semibold text-green-800">{success}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Form Section - Beautiful Card */}
          <motion.div
            className="lg:col-span-1 bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-50 rounded-2xl shadow-lg border-2 border-blue-100 p-8"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ shadow: 'lg' }}
          >
            <motion.div animate={{ y: [0, -2, 0] }} transition={{ duration: 3, repeat: Infinity }}>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent mb-6">
                {editingId ? '✏️ Edit' : '➕ New'} Category
              </h3>
            </motion.div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Category Name *</label>
                <motion.input
                  type="text"
                  value={form.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g., Microcontrollers"
                  className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-200 transition bg-white"
                  whileFocus={{ scale: 1.02 }}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">URL Slug *</label>
                <motion.input
                  type="text"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  placeholder="e.g., microcontrollers"
                  className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-200 transition bg-white"
                  whileFocus={{ scale: 1.02 }}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">🔗 Auto-generated from name</p>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Icon Image URL (optional)</label>
                <input
                  type="text"
                  value={iconImage}
                  onChange={(e) => setIconImage(e.target.value)}
                  placeholder="https://.../icon.png"
                  className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-200 transition bg-white"
                />
                <p className="text-xs text-gray-500 mt-1">Recommended: 320x320 PNG/JPG. If empty, you can set an emoji below.</p>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Emoji Icon (fallback)</label>
                <input
                  type="text"
                  value={emojiIcon}
                  onChange={(e) => setEmojiIcon(e.target.value)}
                  placeholder="e.g. 📦 or 🔌"
                  className="w-32 px-3 py-2 border-2 border-blue-200 rounded-xl focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-200 transition bg-white"
                />
                <p className="text-xs text-gray-500 mt-1">If no image is available, use a single emoji (recommended).</p>
              </div>

              <div className="flex gap-3 pt-4">
                <motion.button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-bold py-3 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {loading ? '⏳ Saving...' : (editingId ? '💾 Update' : '✨ Create')} Category
                </motion.button>
                {editingId && (
                  <motion.button
                    type="button"
                    onClick={handleCancel}
                    className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-xl transition"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    ✕ Cancel
                  </motion.button>
                )}
              </div>
            </form>
          </motion.div>

          {/* Categories List Section */}
          <motion.div
            className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-gray-200 p-8"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <motion.h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              📂 All Categories <span className="text-cyan-600 text-lg">({categories.length})</span>
            </motion.h3>

            {loading && !editingId ? (
              <div className="flex items-center justify-center py-12">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity }} className="w-10 h-10 border-4 border-cyan-600 border-t-transparent rounded-full"></motion.div>
              </div>
            ) : categories.length > 0 ? (
              <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                <AnimatePresence>
                  {categories.map((cat, idx) => (
                    <motion.div
                      key={cat._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: idx * 0.05 }}
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl hover:shadow-md hover:from-blue-50 hover:to-cyan-50 transition border-l-4 border-cyan-500"
                      whileHover={{ x: 4 }}
                    >
                      <div className="flex-1">
                        <p className="font-bold text-gray-800 text-lg">{cat.name}</p>
                        <p className="text-sm text-cyan-600 font-semibold">/{cat.slug}</p>
                      </div>
                      <div className="flex gap-2">
                        <motion.button
                          onClick={() => handleEdit(cat)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition"
                          whileHover={{ scale: 1.15 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Edit2 size={18} />
                        </motion.button>
                        <motion.button
                          onClick={() => handleDelete(cat._id, cat.name)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition"
                          whileHover={{ scale: 1.15 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Trash2 size={18} />
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <motion.div className="text-center py-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <p className="text-5xl mb-4">📭</p>
                <p className="text-gray-500 text-lg">No categories yet</p>
                <p className="text-gray-400 text-sm mt-1">Create your first category on the left!</p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminCategories;
