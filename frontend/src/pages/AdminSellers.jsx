import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Mail } from 'lucide-react';
import api from '../services/api';
import Button from '../components/ui/Button';
import BackButton from '../components/ui/BackButton';

const AdminSellers = () => {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchSellers();
  }, []);

  const fetchSellers = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/admin/sellers');
      setSellers(data || []);
    } catch (err) {
      console.error('Failed to fetch sellers:', err);
      setSellers([]);
    } finally {
      setLoading(false);
    }
  };

  const contactSeller = async (id) => {
    const title = window.prompt('Notification title (optional):');
    const message = window.prompt('Message to seller:');
    if (!message) return;
    try {
      await api.post(`/admin/notify-user/${id}`, { title, message });
      setToast('Notification sent to seller');
    } catch (err) {
      console.error('Failed to contact seller:', err);
      setToast('Failed to send notification');
    }
  };

  const banSeller = async (sellerId) => {
    const reason = window.prompt('Reason for ban (optional):');
    if (!window.confirm('Are you sure you want to ban this seller?')) return;
    try {
      await api.put(`/admin/sellers/${sellerId}/ban`, { reason });
      setSellers((prev) => prev.map(s => s._id === sellerId ? { ...s, banned: true } : s));
      setToast('Seller banned');
    } catch (err) {
      console.error('Failed to ban seller', err);
      setToast('Ban failed');
    }
  };

  const unbanSeller = async (sellerId) => {
    if (!window.confirm('Unban this seller?')) return;
    try {
      await api.put(`/admin/sellers/${sellerId}/unban`);
      setSellers((prev) => prev.map(s => s._id === sellerId ? { ...s, banned: false } : s));
      setToast('Seller unbanned');
    } catch (err) {
      console.error('Failed to unban seller', err);
      setToast('Unban failed');
    }
  };

  const demoteSeller = async (seller) => {
    if (!window.confirm('Are you sure you want to demote this seller to a regular user?')) return;
    try {
      await api.put(`/admin/sellers/${seller._id}/demote`, { reason: 'Your seller privileges have been revoked by the admin.' });
      // remove from UI with animation
      setSellers((prev) => prev.filter((s) => s._id !== seller._id));
      setToast('Seller demoted. Account converted to user. Notification sent.');
    } catch (err) {
      console.error('Failed to demote seller:', err);
      setToast('Demotion failed: ' + (err.response?.data?.message || err.message));
    }
  };

  const filteredSellers = sellers.filter((s) => {
    if (filter === 'active') return true;
    return true;
  });

  return (
    <motion.div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="max-w-7xl mx-auto">
        {toast && (
          <motion.div
            className="fixed top-16 right-6 bg-primary text-gray-900 px-4 py-2 rounded-lg shadow-lg z-50"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            onAnimationComplete={() => setTimeout(() => setToast(null), 2000)}
          >
            {toast}
          </motion.div>
        )}
        {/* Header */}
        <BackButton />
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Approved Sellers</h1>
          <p className="text-gray-600">Manage and monitor your sellers</p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <motion.div
            className="bg-white p-6 rounded-xl shadow-md border-l-4 border-green-500"
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <p className="text-gray-600 text-sm font-medium">Total Sellers</p>
            <p className="text-3xl font-bold text-green-600 mt-2">{sellers.length}</p>
          </motion.div>
          <motion.div
            className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-500"
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <p className="text-gray-600 text-sm font-medium">Active</p>
            <p className="text-3xl font-bold text-blue-600 mt-2">{sellers.length}</p>
          </motion.div>
          <motion.div
            className="bg-white p-6 rounded-xl shadow-md border-l-4 border-yellow-500"
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <p className="text-gray-600 text-sm font-medium">This Month</p>
            <p className="text-3xl font-bold text-yellow-600 mt-2">12</p>
          </motion.div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex gap-2">
          <motion.button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === 'all' ? 'bg-primary text-gray-900' : 'bg-white text-gray-700 border border-gray-300'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            All Sellers
          </motion.button>
          <motion.button
            onClick={() => setFilter('active')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === 'active' ? 'bg-green-600 text-white' : 'bg-white text-gray-700 border border-gray-300'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Active
          </motion.button>
        </div>

        {/* Loading State */}
        {loading && (
          <motion.div className="flex items-center justify-center py-16" animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity }}>
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-600">Loading sellers...</p>
            </div>
          </motion.div>
        )}

        {/* Empty State */}
        {!loading && filteredSellers.length === 0 && (
          <motion.div
            className="text-center py-16 bg-white rounded-xl shadow-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="text-5xl mb-4">📊</div>
            <p className="text-gray-600 text-lg">No approved sellers yet</p>
            <p className="text-gray-500 text-sm mt-1">Approved applications will appear here</p>
          </motion.div>
        )}

        {/* Sellers Table */}
        {!loading && filteredSellers.length > 0 && (
          <motion.div className="bg-white rounded-xl shadow-lg overflow-hidden" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Company Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Contact</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Categories</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <AnimatePresence>
                    {filteredSellers.map((seller, idx) => (
                      <motion.tr
                        key={seller._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ delay: idx * 0.05 }}
                        className="hover:bg-gray-50 transition"
                      >
                        <td className="px-6 py-4">
                          <motion.div whileHover={{ x: 5 }} className="cursor-pointer">
                            <p className="font-semibold text-gray-800">{seller.name || 'N/A'}</p>
                            <p className="text-xs text-gray-600">{seller.email || '-'}</p>
                          </motion.div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-700">
                            <p>{seller.phone || '-'}</p>
                            <p className="text-xs text-gray-500">ID: {seller._id.slice(0, 8)}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {seller.productCategories ? (
                              (Array.isArray(seller.productCategories)
                                ? seller.productCategories.slice(0, 2)
                                : String(seller.productCategories).split(',').slice(0, 2)
                              ).map((cat, i) => (
                                <span key={i} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                                  {String(cat).trim()}
                                </span>
                              ))
                            ) : (
                              <span className="text-gray-400 text-xs">-</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {seller.banned ? (
                            <motion.span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">Banned</motion.span>
                          ) : (
                            <motion.span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold" whileHover={{ scale: 1.05 }}>✓ Approved</motion.span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2 items-center">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => contactSeller(seller._id)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                              title="Notify seller"
                            >
                              <Mail size={18} />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => demoteSeller(seller)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                              title="Demote seller"
                            >
                              <Trash2 size={18} />
                            </motion.button>
                            {seller.banned ? (
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                onClick={() => unbanSeller(seller._id)}
                                className="px-3 py-1 text-sm text-green-700 bg-green-100 rounded-lg"
                                title="Unban seller"
                              >
                                Unban
                              </motion.button>
                            ) : (
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                onClick={() => banSeller(seller._id)}
                                className="px-3 py-1 text-sm text-red-700 bg-red-100 rounded-lg"
                                title="Ban seller"
                              >
                                Ban
                              </motion.button>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default AdminSellers;
