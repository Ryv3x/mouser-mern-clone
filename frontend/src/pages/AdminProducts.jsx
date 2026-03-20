import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setAdminProducts } from '../store/adminSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import api from '../services/api';
import Button from '../components/ui/Button';
import BackButton from '../components/ui/BackButton';

const AdminProducts = () => {
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewingId, setReviewingId] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/admin/products');
        setProducts(data || []);
        dispatch(setAdminProducts(data || []));
      } catch (err) {
        console.error('Failed to load products:', err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [dispatch]);

  const approve = async (id) => {
    try {
      await api.put(`/admin/products/${id}/approve`);
      setProducts((p) => {
        const updated = p.map(pr => pr._id === id ? { ...pr, reviewStatus: 'approved', active: true } : pr);
        dispatch(setAdminProducts(updated));
        return updated;
      });
      setReviewingId(null);
      alert('✅ Product approved and is now live!');
    } catch (err) {
      console.error('Approve failed:', err);
      alert('Failed to approve');
    }
  };

  const reject = async (id) => {
    const reason = window.prompt('Please provide a reason for rejection:');
    if (!reason) return;
    try {
      await api.put(`/admin/products/${id}/reject`, { reason });
      setProducts((p) => {
        const updated = p.map(pr => pr._id === id ? { ...pr, reviewStatus: 'rejected', reviewNote: reason } : pr);
        dispatch(setAdminProducts(updated));
        return updated;
      });
      setReviewingId(null);
      alert('❌ Product rejected');
    } catch (err) {
      console.error('Reject failed:', err);
      alert('Failed to reject');
    }
  };

  const clearExampleProducts = async () => {
    if (!confirm('Delete example/sample products from the catalog? This cannot be undone.')) return;
    try {
      setLoading(true);
      const samples = products.filter(p => /sample|example/i.test(p.name || ''));
      await Promise.all(samples.map(s => api.delete(`/products/${s._id}`)));
      const { data } = await api.get('/admin/products');
      setProducts(data || []);
      dispatch(setAdminProducts(data || []));
    } catch (err) {
      console.error('Failed to clear samples:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50 py-8 px-4" 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
    >
      <div className="max-w-7xl mx-auto">
        <BackButton />
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">Product Management</h1>
          <p className="text-gray-600">Review and manage all products in the catalog</p>
        </motion.div>

        {/* Pending Review Section */}
        <motion.div
          className="mb-12 bg-gradient-to-br from-yellow-50 via-orange-50 to-yellow-50 rounded-2xl shadow-lg border-2 border-yellow-100 p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.h2 className="text-3xl font-bold text-yellow-800 mb-6 flex items-center gap-2">
            <AlertCircle size={32} className="text-yellow-600" />
            Products Pending Review
            <span className="text-2xl bg-yellow-600 text-white rounded-full w-10 h-10 flex items-center justify-center">
              {products.filter(p => p.reviewStatus === 'pending').length}
            </span>
          </motion.h2>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <motion.div 
                animate={{ rotate: 360 }} 
                transition={{ duration: 2, repeat: Infinity }} 
                className="w-10 h-10 border-4 border-yellow-600 border-t-transparent rounded-full"
              ></motion.div>
            </div>
          ) : products.filter(p => p.reviewStatus === 'pending').length > 0 ? (
            <div className="space-y-4">
              <AnimatePresence>
                {products.filter(p => p.reviewStatus === 'pending').map((p, idx) => (
                  <motion.div
                    key={p._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: idx * 0.05 }}
                    className="bg-white rounded-xl shadow-md border-l-4 border-yellow-500 p-6 hover:shadow-lg transition"
                  >
                    <div className="grid md:grid-cols-5 gap-4 items-center">
                      {/* Product Info */}
                      <div className="md:col-span-2">
                        <h4 className="font-bold text-lg text-gray-800 mb-2">{p.name}</h4>
                        <p className="text-sm text-gray-600 mb-1">
                          <strong>Seller:</strong> {p.seller?.name || 'Unknown'}
                        </p>
                        <p className="text-sm text-gray-600">
                          <strong>Price:</strong> ${p.price} | <strong>Stock:</strong> {p.stock}
                        </p>
                      </div>

                      {/* Category & Description */}
                      <div className="md:col-span-1">
                        <p className="text-sm text-gray-700 mb-1">
                          <strong>Category:</strong> {p.category?.name || 'Uncategorized'}
                        </p>
                        {p.manufacturer && (
                          <p className="text-sm text-gray-600">
                            <strong>Manufacturer:</strong> {p.manufacturer}
                          </p>
                        )}
                      </div>

                      {/* Images Preview */}
                      <div className="md:col-span-1 flex gap-2">
                        {(() => {
                          const imgs = Array.isArray(p.images)
                            ? p.images
                            : p.images
                            ? String(p.images).split(',')
                            : [];
                          return imgs.slice(0, 2).map((img, i) => (
                            <img
                              key={i}
                              src={img}
                              alt="product"
                              className="w-12 h-12 rounded object-cover border border-gray-300"
                              onError={(e) => (e.target.src = 'https://via.placeholder.com/50?text=No+Image')}
                            />
                          ));
                        })()}
                      </div>

                      {/* Actions */}
                      <div className="md:col-span-1 flex gap-2">
                        <motion.button
                          onClick={() => approve(p._id)}
                          className="flex-1 flex items-center justify-center gap-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-3 rounded-lg transition"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <CheckCircle size={18} />
                          Approve
                        </motion.button>
                        <motion.button
                          onClick={() => reject(p._id)}
                          className="flex-1 flex items-center justify-center gap-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-3 rounded-lg transition"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <XCircle size={18} />
                          Reject
                        </motion.button>
                      </div>
                    </div>
                    {p.description && (
                      <p className="text-sm text-gray-600 mt-4 pt-4 border-t border-gray-200">
                        {p.description.substring(0, 150)}...
                      </p>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <motion.div 
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <CheckCircle size={64} className="mx-auto mb-4 text-green-600" />
              <p className="text-2xl font-bold text-green-700 mb-2">All products reviewed! ✅</p>
              <p className="text-gray-600">No pending products at the moment.</p>
            </motion.div>
          )}
        </motion.div>

        {/* All Products Section */}
        <motion.div
          className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">All Products</h2>
            <motion.button
              onClick={clearExampleProducts}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Clear Example Products
            </motion.button>
          </div>
          
          <div className="space-y-3">
            {products.map((p) => (
              <motion.div
                key={p._id}
                className={`p-4 rounded-lg border-l-4 transition ${
                  p.reviewStatus === 'pending'
                    ? 'bg-yellow-50 border-yellow-500'
                    : p.reviewStatus === 'approved'
                    ? 'bg-green-50 border-green-500'
                    : 'bg-red-50 border-red-500'
                }`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">{p.name}</p>
                    <p className="text-sm text-gray-600">
                      {p.manufacturer || 'N/A'} • ${p.price} • Stock: {p.stock}
                    </p>
                    <p className="text-xs mt-1">
                      <span className={`inline-block px-2 py-1 rounded-full font-bold text-white ${
                        p.reviewStatus === 'pending' ? 'bg-yellow-500' :
                        p.reviewStatus === 'approved' ? 'bg-green-500' :
                        'bg-red-500'
                      }`}>
                        {p.reviewStatus === 'pending' && '⏳ Pending'}
                        {p.reviewStatus === 'approved' && '✅ Approved'}
                        {p.reviewStatus === 'rejected' && '❌ Rejected'}
                      </span>
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AdminProducts;
