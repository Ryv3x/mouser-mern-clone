import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Plus, AlertCircle, CheckCircle } from 'lucide-react';
import api from '../services/api';
import { setSponsors } from '../store/adminSlice';
import BackButton from '../components/ui/BackButton';

const AdminSponsors = () => {
  const dispatch = useDispatch();
  const [logo, setLogo] = useState('');
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [sponsors, setSponsorsLocal] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const fetchSponsors = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/admin/sponsors');
      setSponsorsLocal(data || []);
      dispatch(setSponsors(data || []));
    } catch (err) {
      console.error('Failed to load sponsors:', err);
      setSponsorsLocal([]);
      dispatch(setSponsors([]));
      setError('Failed to load sponsors');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSponsors();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!logo.trim() || !url.trim()) {
      setError('Logo URL and destination URL are required');
      return;
    }

    try {
      setLoading(true);
      await api.post('/admin/sponsors', { logo, url });
      setSuccess('Sponsor added successfully! ✨');
      setLogo('');
      setUrl('');
      setTimeout(() => {
        setSuccess(null);
        fetchSponsors();
      }, 1500);
    } catch (err) {
      console.error('Failed to add sponsor:', err);
      setError(err.response?.data?.message || 'Failed to add sponsor');
    } finally {
      setLoading(false);
    }
  };

  const removeSponsor = async (id) => {
    if (!confirm('Remove this sponsor?')) return;
    try {
      await api.delete(`/admin/sponsors/${id}`);
      setSponsorsLocal((s) => s.filter(sp => sp._id !== id));
      dispatch(setSponsors(sponsors.filter(sp => sp._id !== id)));
      setSuccess('Sponsor removed successfully! 🗑️');
      setTimeout(() => setSuccess(null), 1500);
    } catch (err) {
      console.error('Failed to remove sponsor:', err);
      setError('Failed to remove sponsor');
    }
  };

  const clearAll = async () => {
    if (!confirm('Delete all sponsors? This cannot be undone.')) return;
    try {
      setLoading(true);
      await api.delete('/admin/sponsors');
      setSponsorsLocal([]);
      dispatch(setSponsors([]));
      setSuccess('All sponsors cleared! ✨');
      setTimeout(() => setSuccess(null), 1500);
    } catch (err) {
      console.error('Failed to clear sponsors:', err);
      setError('Failed to clear sponsors');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50 to-gray-50 p-6" 
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
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">Manage Sponsors</h1>
          <p className="text-gray-600">Add and manage sponsor logos for homepage promotion</p>
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

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Add Sponsor Form */}
          <motion.div
            className="lg:col-span-1 bg-gradient-to-br from-green-50 via-emerald-50 to-green-50 rounded-2xl shadow-lg border-2 border-green-100 p-8"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ shadow: 'lg' }}
          >
            <motion.div animate={{ y: [0, -2, 0] }} transition={{ duration: 3, repeat: Infinity }}>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-6">
                ➕ Add Sponsor
              </h3>
            </motion.div>

            <form onSubmit={submit} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Logo URL *</label>
                <motion.input
                  type="text"
                  value={logo}
                  onChange={(e) => setLogo(e.target.value)}
                  placeholder="https://example.com/logo.png"
                  className="w-full px-4 py-3 border-2 border-green-200 rounded-xl focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 transition bg-white"
                  whileFocus={{ scale: 1.02 }}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Destination URL *</label>
                <motion.input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full px-4 py-3 border-2 border-green-200 rounded-xl focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 transition bg-white"
                  whileFocus={{ scale: 1.02 }}
                  required
                />
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-3 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? '⏳ Adding...' : '✨ Add Sponsor'}
              </motion.button>
            </form>
          </motion.div>

          {/* Sponsors Grid */}
          <motion.div
            className="lg:col-span-3 bg-white rounded-2xl shadow-lg border border-gray-200 p-8"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="flex items-center justify-between mb-6">
              <motion.h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                🎯 Active Sponsors <span className="text-green-600 text-lg">({sponsors.length})</span>
              </motion.h3>
              {sponsors.length > 0 && (
                <motion.button
                  onClick={clearAll}
                  disabled={loading}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition disabled:opacity-50"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  🗑️ Clear All
                </motion.button>
              )}
            </div>

            {loading && sponsors.length === 0 ? (
              <div className="flex items-center justify-center py-16">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity }} className="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full"></motion.div>
              </div>
            ) : sponsors.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                <AnimatePresence>
                  {sponsors.map((sp, idx) => (
                    <motion.div
                      key={sp._id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ delay: idx * 0.05 }}
                      className="relative group"
                      whileHover={{ y: -4 }}
                    >
                      <motion.a 
                        href={sp.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="relative bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl border-2 border-gray-200 hover:border-green-400 transition shadow-md hover:shadow-lg flex items-center justify-center min-h-24 group-hover:from-green-50 group-hover:to-emerald-50"
                      >
                        <img 
                          src={sp.logo} 
                          alt="sponsor" 
                          className="h-16 object-contain mx-auto group-hover:scale-110 transition" 
                        />
                      </motion.a>
                      <motion.button
                        onClick={() => removeSponsor(sp._id)}
                        className="absolute -top-2 -right-2 text-white bg-red-600 hover:bg-red-700 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition"
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Trash2 size={16} />
                      </motion.button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <motion.div className="text-center py-16" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <p className="text-5xl mb-4">🎪</p>
                <p className="text-gray-500 text-lg">No sponsors yet</p>
                <p className="text-gray-400 text-sm mt-1">Add your first sponsor on the left!</p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminSponsors;
