import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Package, Users, BarChart2, TrendingUp, DollarSign, ShoppingCart, StoreIcon, Layers, Palette, Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { setSellerApplications, setAdminProducts, setSponsors } from '../store/adminSlice';
import BackButton from '../components/ui/BackButton';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { sellerApplications, products, sponsors } = useSelector((state) => state.admin);
  const cart = useSelector((state) => state.cart.items || []);
  const [loading, setLoading] = React.useState(true);
  const [categories, setCategories] = React.useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const [{ data: apps }, { data: prods }, { data: sps }, { data: cats }] = await Promise.all([
          api.get('/admin/seller-applications').catch(() => ({ data: [] })),
          api.get('/products').catch(() => ({ data: [] })),
          api.get('/sponsors').catch(() => ({ data: [] })),
          api.get('/categories').catch(() => ({ data: [] })),
        ]);
        dispatch(setSellerApplications(apps || []));
        dispatch(setAdminProducts(prods || []));
        dispatch(setSponsors(sps || []));
        setCategories(cats || []);
      } catch (err) {
        console.error('Failed to fetch admin stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [dispatch]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  const StatCard = ({ icon: Icon, title, value, color }) => (
    <motion.div
      variants={itemVariants}
      className={`bg-gradient-to-br ${color} rounded-xl shadow-lg p-6 text-white`}
      whileHover={{ scale: 1.05 }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold opacity-90">{title}</p>
          <p className="text-4xl font-bold mt-2">{value}</p>
        </div>
        <Icon size={40} className="opacity-50" />
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-4 md:py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="container mx-auto px-4">
        <BackButton />
        {/* Header */}
        <motion.div className="mb-6 md:mb-8" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's your platform overview.</p>
        </motion.div>

        {/* Main Stats */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <StatCard
            icon={Package}
            title="Total Products"
            value={Array.isArray(products) ? products.length : 0}
            color="from-blue-500 to-blue-600"
          />
          <StatCard
            icon={Package}
            title="Pending Review"
            value={Array.isArray(products) ? products.filter(p=>p.reviewStatus==='pending').length : 0}
            color="from-yellow-500 to-yellow-600"
          />
          <StatCard
            icon={Users}
            title="Seller Applications"
            value={Array.isArray(sellerApplications) ? sellerApplications.length : 0}
            color="from-purple-500 to-purple-600"
          />
          <StatCard
            icon={ShoppingCart}
            title="Sponsors"
            value={Array.isArray(sponsors) ? sponsors.length : 0}
            color="from-green-500 to-green-600"
          />
          <StatCard
            icon={TrendingUp}
            title="Recent Orders"
            value={Array.isArray(cart) ? cart.length : 0}
            color="from-orange-500 to-orange-600"
          />
          <StatCard
            icon={Layers}
            title="Categories"
            value={Array.isArray(categories) ? categories.length : 0}
            color="from-cyan-500 to-cyan-600"
          />
        </motion.div>

        {/* Action Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible">
        
          {/* Broadcast Notification Card - Special/Featured */}
          <motion.button
            variants={itemVariants}
            onClick={async () => {
              const title = window.prompt('Notification title (optional):');
              const message = window.prompt('Notification message:');
              const image = window.prompt('Image URL (optional):');
              if (!message) return alert('Message required');
              try {
                await api.post('/admin/notify-all', { title, message, image });
                alert('📢 Notifications sent to all users!');
              } catch (err) {
                console.error('Notify all failed:', err);
                alert('Failed to send notifications');
              }
            }}
            className="bg-gradient-to-br from-red-50 via-pink-50 to-red-50 rounded-2xl shadow-lg p-6 hover:shadow-2xl transition text-left group border-2 border-red-100 hover:border-red-300 relative overflow-hidden"
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.div 
              className="absolute top-0 right-0 text-6xl opacity-20 group-hover:opacity-30 transition"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              📢
            </motion.div>
            <motion.div 
              className="flex items-start justify-between mb-4 relative z-10"
              animate={{ y: [0, -2, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">Broadcast Message</h3>
                <p className="text-xs text-red-600 font-semibold mt-1 uppercase tracking-wide">Send to All Users</p>
              </div>
              <motion.div
                className="text-white bg-gradient-to-br from-red-500 to-pink-600 p-3 rounded-xl group-hover:scale-110 transition shadow-lg"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <TrendingUp size={24} />
              </motion.div>
            </motion.div>
            <motion.div 
              className="mb-4 p-3 bg-white rounded-lg border border-red-200 relative z-10"
              whileHover={{ backgroundColor: '#fff5f5' }}
            >
              <p className="text-2xl font-bold text-red-600">🔥 Alert</p>
              <p className="text-xs text-gray-500 mt-1">Send instant notifications</p>
            </motion.div>
            <motion.span 
              className="bg-gradient-to-r from-red-600 to-pink-600 text-white font-bold px-3 py-1 rounded-full text-sm inline-flex items-center gap-1 relative z-10"
              whileHover={{ width: 'auto' }}
            >
              📣 Send Now →
            </motion.span>
          </motion.button>
        
          {/* Seller Applications Card */}
          <motion.button
            variants={itemVariants}
            onClick={() => navigate('/admin/seller-applications')}
            className="bg-gradient-to-br from-purple-50 via-purple-50 to-pink-50 rounded-2xl shadow-lg p-6 hover:shadow-2xl transition text-left group border-2 border-purple-100 hover:border-purple-300"
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.div 
              className="flex items-start justify-between mb-4"
              animate={{ y: [0, -2, 0] }}
              transition={{ duration: 3, repeat: Infinity, delay: 0.1 }}
            >
              <div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Seller Applications</h3>
                <p className="text-xs text-purple-600 font-semibold mt-1 uppercase tracking-wide">Pending Review</p>
              </div>
              <motion.div
                className="text-white bg-gradient-to-br from-purple-500 to-pink-600 p-3 rounded-xl group-hover:scale-110 transition shadow-lg"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, delay: 0.1 }}
              >
                <Users size={24} />
              </motion.div>
            </motion.div>
            <motion.div 
              className="mb-4 p-3 bg-white rounded-lg border border-purple-200"
              whileHover={{ backgroundColor: '#faf5ff' }}
            >
              <p className="text-3xl font-bold text-purple-600">{Array.isArray(sellerApplications) ? sellerApplications.length : 0}</p>
              <p className="text-xs text-gray-500 mt-1">Awaiting approval</p>
            </motion.div>
            <motion.span 
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold px-3 py-1 rounded-full text-sm inline-flex items-center gap-1"
              whileHover={{ width: 'auto' }}
            >
              👥 Review Now →
            </motion.span>
          </motion.button>

          {/* Product Review Card */}
          <motion.button
            variants={itemVariants}
            onClick={() => navigate('/admin/products')}
            className="bg-gradient-to-br from-yellow-50 via-orange-50 to-yellow-50 rounded-2xl shadow-lg p-6 hover:shadow-2xl transition text-left group border-2 border-yellow-100 hover:border-yellow-300"
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.div 
              className="flex items-start justify-between mb-4"
              animate={{ y: [0, -2, 0] }}
              transition={{ duration: 3, repeat: Infinity, delay: 0.1 }}
            >
              <div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">Product Review</h3>
                <p className="text-xs text-yellow-600 font-semibold mt-1 uppercase tracking-wide">Approval Queue</p>
              </div>
              <motion.div
                className="text-white bg-gradient-to-br from-yellow-500 to-orange-600 p-3 rounded-xl group-hover:scale-110 transition shadow-lg"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, delay: 0.1 }}
              >
                <Package size={24} />
              </motion.div>
            </motion.div>
            <motion.div 
              className="mb-4 p-3 bg-white rounded-lg border border-yellow-200"
              whileHover={{ backgroundColor: '#fffbf0' }}
            >
              <p className="text-3xl font-bold text-yellow-600">{Array.isArray(products) ? products.filter(p=>p.reviewStatus==='pending').length : 0}</p>
              <p className="text-xs text-gray-500 mt-1">Pending approval</p>
            </motion.div>
            <motion.span 
              className="bg-gradient-to-r from-yellow-600 to-orange-600 text-white font-bold px-3 py-1 rounded-full text-sm inline-flex items-center gap-1"
              whileHover={{ width: 'auto' }}
            >
              📦 Review Now →
            </motion.span>
          </motion.button>

          {/* Product Management Card */}
          <motion.button
            variants={itemVariants}
            onClick={() => navigate('/admin/products')}
            className="bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-50 rounded-2xl shadow-lg p-6 hover:shadow-2xl transition text-left group border-2 border-blue-100 hover:border-blue-300"
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.div 
              className="flex items-start justify-between mb-4"
              animate={{ y: [0, -2, 0] }}
              transition={{ duration: 3, repeat: Infinity, delay: 0.2 }}
            >
              <div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Product Management</h3>
                <p className="text-xs text-blue-600 font-semibold mt-1 uppercase tracking-wide">All Products</p>
              </div>
              <motion.div
                className="text-white bg-gradient-to-br from-blue-500 to-cyan-600 p-3 rounded-xl group-hover:scale-110 transition shadow-lg"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, delay: 0.2 }}
              >
                <Package size={24} />
              </motion.div>
            </motion.div>
            <motion.div 
              className="mb-4 p-3 bg-white rounded-lg border border-blue-200"
              whileHover={{ backgroundColor: '#f0f9ff' }}
            >
              <p className="text-3xl font-bold text-blue-600">{Array.isArray(products) ? products.length : 0}</p>
              <p className="text-xs text-gray-500 mt-1">Total in catalog</p>
            </motion.div>
            <motion.span 
              className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold px-3 py-1 rounded-full text-sm inline-flex items-center gap-1"
              whileHover={{ width: 'auto' }}
            >
              🛠️ Manage Now →
            </motion.span>
          </motion.button>

          {/* Sponsors Card */}
          <motion.button
            variants={itemVariants}
            onClick={() => navigate('/admin/sponsors')}
            className="bg-gradient-to-br from-green-50 via-emerald-50 to-green-50 rounded-2xl shadow-lg p-6 hover:shadow-2xl transition text-left group border-2 border-green-100 hover:border-green-300"
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.div 
              className="flex items-start justify-between mb-4"
              animate={{ y: [0, -2, 0] }}
              transition={{ duration: 3, repeat: Infinity, delay: 0.3 }}
            >
              <div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Sponsors</h3>
                <p className="text-xs text-green-600 font-semibold mt-1 uppercase tracking-wide">Manage Promotions</p>
              </div>
              <motion.div
                className="text-white bg-gradient-to-br from-green-500 to-emerald-600 p-3 rounded-xl group-hover:scale-110 transition shadow-lg"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, delay: 0.3 }}
              >
                <BarChart2 size={24} />
              </motion.div>
            </motion.div>
            <motion.div 
              className="mb-4 p-3 bg-white rounded-lg border border-green-200"
              whileHover={{ backgroundColor: '#f0fdf4' }}
            >
              <p className="text-3xl font-bold text-green-600">{Array.isArray(sponsors) ? sponsors.length : 0}</p>
              <p className="text-xs text-gray-500 mt-1">Active sponsors</p>
            </motion.div>
            <motion.span 
              className="bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold px-3 py-1 rounded-full text-sm inline-flex items-center gap-1"
              whileHover={{ width: 'auto' }}
            >
              ⭐ Manage →
            </motion.span>
          </motion.button>

          {/* Current Sellers Card */}
          <motion.button
            variants={itemVariants}
            onClick={() => navigate('/admin/sellers')}
            className="bg-gradient-to-br from-indigo-50 via-indigo-50 to-purple-50 rounded-2xl shadow-lg p-6 hover:shadow-2xl transition text-left group border-2 border-indigo-100 hover:border-indigo-300"
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.div 
              className="flex items-start justify-between mb-4"
              animate={{ y: [0, -2, 0] }}
              transition={{ duration: 3, repeat: Infinity, delay: 0.4 }}
            >
              <div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Current Sellers</h3>
                <p className="text-xs text-indigo-600 font-semibold mt-1 uppercase tracking-wide">Approved & Active</p>
              </div>
              <motion.div
                className="text-white bg-gradient-to-br from-indigo-500 to-purple-600 p-3 rounded-xl group-hover:scale-110 transition shadow-lg"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, delay: 0.4 }}
              >
                <Users size={24} />
              </motion.div>
            </motion.div>
            <motion.div 
              className="mb-4 p-3 bg-white rounded-lg border border-indigo-200"
              whileHover={{ backgroundColor: '#f5f3ff' }}
            >
              <p className="text-3xl font-bold text-indigo-600">💼</p>
              <p className="text-xs text-gray-500 mt-1">Manage & monitor</p>
            </motion.div>
            <motion.span 
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold px-3 py-1 rounded-full text-sm inline-flex items-center gap-1"
              whileHover={{ width: 'auto' }}
            >
              👨‍💼 View All →
            </motion.span>
          </motion.button>

          {/* Manage Categories Card */}
          <motion.button
            variants={itemVariants}
            onClick={() => navigate('/admin/categories')}
            className="bg-gradient-to-br from-cyan-50 via-blue-50 to-cyan-50 rounded-2xl shadow-lg p-6 hover:shadow-2xl transition text-left group border-2 border-cyan-100 hover:border-cyan-300"
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.div 
              className="flex items-start justify-between mb-4"
              animate={{ y: [0, -2, 0] }}
              transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
            >
              <div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">Manage Categories</h3>
                <p className="text-xs text-cyan-600 font-semibold mt-1 uppercase tracking-wide">Product Organization</p>
              </div>
              <motion.div
                className="text-white bg-gradient-to-br from-cyan-500 to-blue-600 p-3 rounded-xl group-hover:scale-110 transition shadow-lg"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
              >
                <Layers size={24} />
              </motion.div>
            </motion.div>
            <motion.div 
              className="mb-4 p-3 bg-white rounded-lg border border-cyan-200"
              whileHover={{ backgroundColor: '#f0f9ff' }}
            >
              <p className="text-3xl font-bold text-cyan-600">{Array.isArray(categories) ? categories.length : 0}</p>
              <p className="text-xs text-gray-500 mt-1">Total categories active</p>
            </motion.div>
            <motion.span 
              className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold px-3 py-1 rounded-full text-sm inline-flex items-center gap-1"
              whileHover={{ width: 'auto' }}
            >
              ✨ Edit Categories →
            </motion.span>
          </motion.button>

          {/* Manage Help Pages Card */}
          <motion.button
            variants={itemVariants}
            onClick={() => navigate('/admin/help-pages')}
            className="bg-gradient-to-br from-green-50 via-teal-50 to-green-50 rounded-2xl shadow-lg p-6 hover:shadow-2xl transition text-left group border-2 border-green-100 hover:border-green-300"
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.div
              className="flex items-start justify-between mb-4"
              animate={{ y: [0, -2, 0] }}
              transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
            >
              <div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">Manage Help Pages</h3>
                <p className="text-xs text-green-600 font-semibold mt-1 uppercase tracking-wide">Support Content</p>
              </div>
              <motion.div
                className="text-white bg-gradient-to-br from-green-500 to-teal-600 p-3 rounded-xl group-hover:scale-110 transition shadow-lg"
                animate={{ rotate: [0, -5, 5, 0] }}
                transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
              >
                <Edit size={24} />
              </motion.div>
            </motion.div>
            <motion.div
              className="mb-4 p-3 bg-white rounded-lg border border-green-200"
              whileHover={{ backgroundColor: '#f0fef7' }}
            >
              <p className="text-sm text-green-600 font-semibold">Create and modify pages</p>
            </motion.div>
            <motion.span
              className="bg-gradient-to-r from-green-600 to-teal-600 text-white font-bold px-3 py-1 rounded-full text-sm inline-flex items-center gap-1"
              whileHover={{ width: 'auto' }}
            >
              📄 Go to Help Pages →
            </motion.span>
          </motion.button>

          {/* Customize Homepage Card */}
          <motion.button
            variants={itemVariants}
            onClick={() => navigate('/admin/home-settings')}
            className="bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50 rounded-2xl shadow-lg p-6 hover:shadow-2xl transition text-left group border-2 border-purple-100 hover:border-purple-300"
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.div 
              className="flex items-start justify-between mb-4"
              animate={{ y: [0, -2, 0] }}
              transition={{ duration: 3, repeat: Infinity, delay: 0.3 }}
            >
              <div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Customize Homepage</h3>
                <p className="text-xs text-purple-600 font-semibold mt-1 uppercase tracking-wide">Hero Text & Featured Items</p>
              </div>
              <motion.div
                className="text-white bg-gradient-to-br from-purple-500 to-pink-600 p-3 rounded-xl group-hover:scale-110 transition shadow-lg"
                animate={{ rotate: [0, -5, 5, 0] }}
                transition={{ duration: 4, repeat: Infinity, delay: 0.3 }}
              >
                <Palette size={24} />
              </motion.div>
            </motion.div>
            <motion.div 
              className="mb-4 p-3 bg-white rounded-lg border border-purple-200"
              whileHover={{ backgroundColor: '#faf5ff' }}
            >
              <p className="text-sm text-purple-600 font-semibold">Hero Banner • Categories • Products • Background</p>
              <p className="text-xs text-gray-500 mt-1">Create a custom homepage experience</p>
            </motion.div>
            <motion.span 
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold px-3 py-1 rounded-full text-sm inline-flex items-center gap-1"
              whileHover={{ width: 'auto' }}
            >
              🎨 Customize Homepage →
            </motion.span>
          </motion.button>
        </motion.div>

        {/* Analytics & System Health */}
        <motion.div
          className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl shadow-2xl p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <motion.h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-8">⚡ System Health & Analytics</motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <motion.div
              variants={itemVariants}
              className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 p-6 rounded-xl border border-cyan-400/30 hover:border-cyan-400/60 transition"
              whileHover={{ y: -4 }}
            >
              <div className="flex items-center justify-between mb-4">
                <p className="text-cyan-300 font-semibold uppercase tracking-wide text-sm">Platform Health</p>
                <span className="text-2xl">💚</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                <motion.div 
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 h-3 rounded-full" 
                  style={{ width: '92%' }}
                  initial={{ width: 0 }}
                  animate={{ width: '92%' }}
                  transition={{ duration: 1.5, ease: 'easeOut' }}
                ></motion.div>
              </div>
              <p className="text-sm text-gray-300 mt-3">✅ 92% • Everything running smoothly</p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 p-6 rounded-xl border border-green-400/30 hover:border-green-400/60 transition"
              whileHover={{ y: -4 }}
            >
              <div className="flex items-center justify-between mb-4">
                <p className="text-green-300 font-semibold uppercase tracking-wide text-sm">User Engagement</p>
                <span className="text-2xl">📊</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                <motion.div 
                  className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full" 
                  style={{ width: '78%' }}
                  initial={{ width: 0 }}
                  animate={{ width: '78%' }}
                  transition={{ duration: 1.5, ease: 'easeOut', delay: 0.2 }}
                ></motion.div>
              </div>
              <p className="text-sm text-gray-300 mt-3">📈 78% • Positive trend</p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="bg-gradient-to-br from-orange-500/10 to-red-500/10 p-6 rounded-xl border border-orange-400/30 hover:border-orange-400/60 transition"
              whileHover={{ y: -4 }}
            >
              <div className="flex items-center justify-between mb-4">
                <p className="text-orange-300 font-semibold uppercase tracking-wide text-sm">Data Integrity</p>
                <span className="text-2xl">🔒</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                <motion.div 
                  className="bg-gradient-to-r from-orange-500 to-red-500 h-3 rounded-full" 
                  style={{ width: '99%' }}
                  initial={{ width: 0 }}
                  animate={{ width: '99%' }}
                  transition={{ duration: 1.5, ease: 'easeOut', delay: 0.4 }}
                ></motion.div>
              </div>
              <p className="text-sm text-gray-300 mt-3">✔️ 99% • All systems secure</p>
            </motion.div>
          </div>
        </motion.div>
        
        {/* Activity Feed & Admin Logs - make dashboard longer */}
        <motion.div
          className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-lg p-6 lg:col-span-2">
            <h3 className="text-xl font-bold mb-4">Recent Admin Activity</h3>
            <div className="space-y-3 max-h-64 overflow-auto">
              {[1,2,3,4,5].map(i => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">🛠️</div>
                  <div>
                    <p className="text-sm font-semibold">Updated Homepage settings</p>
                    <p className="text-xs text-gray-500">by AdminUser • {i*3} minutes ago</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold mb-4">System Logs</h3>
            <div className="text-xs text-gray-500 space-y-2 max-h-64 overflow-auto">
              <div>03/18 10:12 - Backup completed successfully</div>
              <div>03/18 09:50 - New sponsor added: Acme Corp</div>
              <div>03/17 22:11 - User locked out after failed logins</div>
              <div>03/17 18:02 - Product review queue processed</div>
              <div>03/16 12:33 - Mailer service verified</div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AdminDashboard;
