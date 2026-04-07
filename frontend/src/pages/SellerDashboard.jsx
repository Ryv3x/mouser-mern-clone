import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { Plus, Package, BarChart2, DollarSign, TrendingUp, Settings, LogOut } from 'lucide-react';
import api from '../services/api';
import { logout } from '../store/authSlice';

const SellerDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    avgRating: 0,
  });
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    if (user?.role !== 'seller') {
      navigate('/');
      return;
    }

    const fetchSellerData = async () => {
      try {
        setLoading(true);
        const [{ data: productsData }, { data: ordersData }] = await Promise.all([
          api.get('/seller/products'),
          api.get('/seller/orders').catch(() => ({ data: [] }))
        ]);
        setProducts(productsData || []);
        
        // Calculate real stats
        const totalProducts = productsData?.length || 0;
        const totalOrders = ordersData?.length || 0;
        const totalRevenue = ordersData?.reduce((sum, order) => sum + (order.total || 0), 0) || 0;
        const avgRating = ordersData?.length > 0 
          ? (ordersData.reduce((sum, order) => sum + (order.rating || 0), 0) / ordersData.length).toFixed(1)
          : 0;
        
        setStats({
          totalProducts,
          totalOrders,
          totalRevenue: totalRevenue.toFixed(2),
          avgRating,
        });
      } catch (err) {
        console.error('Failed to fetch seller data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSellerData();
  }, [user, navigate]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
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
          <p className="text-3xl font-bold mt-2">{value}</p>
        </div>
        <Icon size={32} className="opacity-50" />
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
        {/* Header with User Info */}
        <motion.div
          className="flex flex-col md:flex-row justify-between items-start mb-6 md:mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="mb-4 md:mb-0">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Seller Dashboard</h1>
            <p className="text-gray-600">Welcome back, {user?.name}! 👋</p>
          </div>
          <motion.button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition w-full md:w-auto"
            whileHover={{ scale: 1.05 }}
          >
            <LogOut size={20} /> Logout
          </motion.button>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <StatCard
            icon={Package}
            title="Total Products"
            value={stats.totalProducts}
            color="from-blue-500 to-blue-600"
          />
          <StatCard
            icon={BarChart2}
            title="Total Orders"
            value={stats.totalOrders}
            color="from-purple-500 to-purple-600"
          />
          <StatCard
            icon={DollarSign}
            title="Total Revenue"
            value={`$${stats.totalRevenue}`}
            color="from-green-500 to-green-600"
          />
          <StatCard
            icon={TrendingUp}
            title="Avg Rating"
            value={`${stats.avgRating}⭐`}
            color="from-yellow-500 to-yellow-600"
          />
        </motion.div>

        {/* Action Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.button
            variants={itemVariants}
            onClick={() => navigate('/seller/products/add')}
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition text-left group"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Add New Product</h3>
              <Plus className="text-blue-600 group-hover:scale-110 transition" size={24} />
            </div>
            <p className="text-gray-600">List new products in your store</p>
          </motion.button>

          <motion.button
            variants={itemVariants}
            onClick={() => navigate('/seller/products')}
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition text-left group"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Manage Products</h3>
              <Package className="text-green-600 group-hover:scale-110 transition" size={24} />
            </div>
            <p className="text-gray-600">{stats.totalProducts} products total</p>
          </motion.button>

          <motion.button
            variants={itemVariants}
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition text-left group"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Store Settings</h3>
              <Settings className="text-purple-600 group-hover:scale-110 transition" size={24} />
            </div>
            <p className="text-gray-600">Customize your store profile</p>
          </motion.button>
        </motion.div>

        {/* Recent Products */}
        <motion.div
          className="bg-white rounded-xl shadow-lg p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Recent Products</h2>
            <motion.button
              onClick={() => navigate('/seller/products')}
              className="text-blue-600 hover:text-blue-800 font-semibold"
              whileHover={{ x: 5 }}
            >
              View All →
            </motion.button>
          </div>

          {products && products.length > 0 ? (
            <motion.div
              className="overflow-x-auto"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-gray-700 font-semibold">Product Name</th>
                    <th className="text-left py-3 px-4 text-gray-700 font-semibold">Price</th>
                    <th className="text-left py-3 px-4 text-gray-700 font-semibold">Stock</th>
                    <th className="text-left py-3 px-4 text-gray-700 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {products.slice(0, 5).map((product, idx) => (
                    <motion.tr
                      key={idx}
                      variants={itemVariants}
                      className="border-b border-gray-100 hover:bg-gray-50 transition"
                    >
                      <td className="py-3 px-4 text-gray-900">{product.name}</td>
                      <td className="py-3 px-4 font-semibold text-blue-600">${product.price}</td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          product.stock > 0
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {product.stock} in stock
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800">
                          Active
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          ) : (
            <motion.div
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="text-gray-600 mb-4">No products yet</p>
              <motion.button
                onClick={() => navigate('/seller/products/add')}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition inline-flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
              >
                <Plus size={20} /> Add Your First Product
              </motion.button>
            </motion.div>
          )}
        </motion.div>

        {/* Order Management */}
        <motion.div
          className="bg-white rounded-xl shadow-lg p-6 mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Recent Orders</h2>
            <motion.button
              onClick={() => navigate('/seller/orders')}
              className="text-blue-600 hover:text-blue-800 font-semibold"
              whileHover={{ x: 5 }}
            >
              View All Orders →
            </motion.button>
          </div>

          {stats.totalOrders > 0 ? (
            <motion.div
              className="space-y-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Mock order items - replace with real data */}
              {Array.from({ length: Math.min(stats.totalOrders, 3) }, (_, idx) => (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold text-gray-900">Order #{1000 + idx}</p>
                      <p className="text-sm text-gray-600">Customer: John Doe</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600">${(Math.random() * 100 + 20).toFixed(2)}</p>
                      <button
                        onClick={() => {
                          const receipt = `Receipt for Order #${1000 + idx}\nCustomer: John Doe\nAmount: $${(Math.random() * 100 + 20).toFixed(2)}\nDate: ${new Date().toLocaleDateString()}`;
                          const printWindow = window.open('', '_blank');
                          printWindow.document.write(`<pre>${receipt}</pre>`);
                          printWindow.document.close();
                          printWindow.print();
                        }}
                        className="text-blue-600 hover:text-blue-800 text-sm font-semibold"
                      >
                        Print Receipt
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">Status: Processing</p>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="text-gray-600">No orders yet</p>
            </motion.div>
          )}
        </motion.div>

        {/* Sales Overview & Inventory Alerts - lengthen seller panel */}
        <motion.div
          className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-lg p-6 lg:col-span-2">
            <h3 className="text-xl font-bold mb-4">Sales Overview</h3>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 p-4 bg-gray-50 rounded">
                <p className="text-sm text-gray-500">Revenue (30d)</p>
                <p className="text-2xl font-bold text-green-600 mt-2">${(Math.random()*5000+1000).toFixed(2)}</p>
                <div className="h-24 bg-white rounded mt-4 flex items-center justify-center text-gray-400">[Mini chart placeholder]</div>
              </div>
              <div className="w-48 p-4 bg-gray-50 rounded">
                <p className="text-sm text-gray-500">Conversion</p>
                <p className="text-2xl font-bold text-blue-600 mt-2">{(Math.random()*10+1).toFixed(1)}%</p>
                <p className="text-xs text-gray-400 mt-2">vs last 30d</p>
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold mb-4">Inventory Alerts</h3>
            <div className="space-y-3">
              {products.filter(p=>p.stock<=5).slice(0,5).map((p,idx)=> (
                <div key={idx} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold">{p.name}</p>
                    <p className="text-xs text-gray-500">Stock: {p.stock}</p>
                  </div>
                  <button onClick={() => navigate('/seller/products')} className="text-sm text-blue-600">Manage</button>
                </div>
              ))}
              {products.filter(p=>p.stock<=5).length===0 && <div className="text-sm text-gray-500">All good — no low stock items.</div>}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default SellerDashboard;
