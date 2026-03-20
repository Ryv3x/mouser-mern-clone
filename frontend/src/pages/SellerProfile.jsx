import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, MapPin, Phone, Mail, ShoppingBag, Award, Clock } from 'lucide-react';
import api from '../services/api';
import ProductGrid from '../components/product/ProductGrid';
import Loader from '../components/common/Loader';

const backendBase = import.meta.env.VITE_API_URL ? String(import.meta.env.VITE_API_URL).replace(/\/api$/, '') : 'http://localhost:5000';

const SellerProfile = () => {
  const { sellerId } = useParams();
  const navigate = useNavigate();
  const [seller, setSeller] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const authUser = useSelector((state) => state.auth.user);
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', description: '', logo: '', logoPreview: '', phone: '', address: '', availableTimes: [] });

  useEffect(() => {
    const fetchSellerData = async () => {
      try {
        setLoading(true);
        
        // Fetch seller info
        const { data: sellerData } = await api.get(`/seller/${sellerId}`);
        setSeller(sellerData);

        // Fetch seller products
        const { data: productsData } = await api.get(`/seller/${sellerId}/products`);
        setProducts(productsData || []);

        // Calculate stats
        if (sellerData) {
          const totalProducts = productsData?.length || 0;
          const avgRating = Number(sellerData.rating) || 0;
          setStats({
            totalProducts,
            avgRating: avgRating.toFixed(1),
            joinDate: new Date(sellerData.createdAt).toLocaleDateString(),
          });
        }
      } catch (err) {
        console.error('Failed to fetch seller data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (sellerId) {
      fetchSellerData();
    }
  }, [sellerId]);

  if (loading) return <Loader />;

  if (!seller) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Seller Not Found</h2>
          <button
            onClick={() => navigate('/products')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Seller Header */}
      <motion.section
        className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-12 px-4 sm:px-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto max-w-6xl">
          <motion.div
            className="flex flex-col sm:flex-row items-start sm:items-center gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Avatar */}
            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-white/20 rounded-full flex items-center justify-center text-5xl">
              {seller.logo ? (
                <img src={seller.logo.startsWith('data:') ? seller.logo : (seller.logo.startsWith('/uploads') ? `${backendBase}${seller.logo}` : seller.logo)} alt={seller.name} className="w-full h-full rounded-full object-cover" />
              ) : (
                '🏪'
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h1 className="text-3xl sm:text-4xl font-bold mb-2">{seller.name}</h1>
                {authUser && (authUser._id === seller._id || authUser.role === 'admin') && (
                  <div>
                    {!editMode ? (
                      <button onClick={() => {
                        setEditMode(true);
                        setEditForm({
                          name: seller.name || '',
                          description: seller.description || '',
                          logo: seller.logo || '',
                          logoPreview: '',
                          phone: seller.phone || '',
                          address: seller.address || '',
                          availableTimes: seller.availableTimes || (seller.availableTime ? [{ dayRange: seller.availableTime, from: '', to: '' }] : []),
                          bannerColor: seller.bannerColor || '#ffffff',
                          deliveryOptions: (seller.deliveryOptions || []).join(', '),
                        });
                      }} className="px-3 py-1 bg-white text-blue-600 rounded-lg font-semibold">Edit Profile</button>
                    ) : (
                      <div className="flex gap-2">
                        <button onClick={async () => {
                          try {
                                const payload = { ...editForm };
                                // convert deliveryOptions back into array for backend
                                if (typeof payload.deliveryOptions === 'string') {
                                  payload.deliveryOptions = payload.deliveryOptions.split(',').map((s) => s.trim()).filter(Boolean);
                                }
                                // send availableTimes as-is
                                const { data } = await api.put(`/seller/${seller._id}`, payload);
                              setSeller(data.seller || data);
                              setEditMode(false);
                            } catch (err) {
                            console.error('Failed to save seller profile', err);
                            alert('Save failed');
                          }
                        }} className="px-3 py-1 bg-green-600 text-white rounded-lg font-semibold">Save</button>
                        <button onClick={() => setEditMode(false)} className="px-3 py-1 bg-gray-200 text-gray-800 rounded-lg">Cancel</button>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={20}
                      className={i < Math.round(stats?.avgRating) ? 'fill-yellow-300 text-yellow-300' : 'text-gray-400'}
                    />
                  ))}
                </div>
                <span className="text-lg font-semibold">{stats?.avgRating} out of 5</span>
              </div>
              {editMode ? (
                <div>
                  <textarea value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} className="w-full p-3 rounded-lg text-gray-900" rows={4} />

                  <div className="mt-4 grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Available Times</label>
                      <div className="space-y-3">
                        {(editForm.availableTimes || []).map((slot, idx) => (
                          <div key={idx} className="flex gap-2 items-center">
                            <input value={slot.dayRange || ''} onChange={(e) => {
                              const next = { ...editForm };
                              next.availableTimes = [...(next.availableTimes || [])];
                              next.availableTimes[idx] = { ...next.availableTimes[idx], dayRange: e.target.value };
                              setEditForm(next);
                            }} placeholder="Day range (e.g. Mon-Fri)" className="flex-1 p-2 rounded-lg border" />
                            <input value={slot.from || ''} onChange={(e) => {
                              const next = { ...editForm };
                              next.availableTimes = [...(next.availableTimes || [])];
                              next.availableTimes[idx] = { ...next.availableTimes[idx], from: e.target.value };
                              setEditForm(next);
                            }} placeholder="from (09:00)" className="w-28 p-2 rounded-lg border" />
                            <input value={slot.to || ''} onChange={(e) => {
                              const next = { ...editForm };
                              next.availableTimes = [...(next.availableTimes || [])];
                              next.availableTimes[idx] = { ...next.availableTimes[idx], to: e.target.value };
                              setEditForm(next);
                            }} placeholder="to (18:00)" className="w-28 p-2 rounded-lg border" />
                            <button onClick={() => {
                              const next = { ...editForm };
                              next.availableTimes = [...(next.availableTimes || [])];
                              next.availableTimes.splice(idx, 1);
                              setEditForm(next);
                            }} className="px-2 py-1 bg-red-500 text-white rounded">Remove</button>
                          </div>
                        ))}
                        <div>
                          <button onClick={() => {
                            const next = { ...editForm };
                            next.availableTimes = [...(next.availableTimes || []), { dayRange: '', from: '', to: '' }];
                            setEditForm(next);
                          }} className="px-3 py-1 bg-blue-600 text-white rounded">Add Availability</button>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4 items-center">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Banner Color</label>
                        <input type="color" value={editForm.bannerColor || '#ffffff'} onChange={(e) => setEditForm({ ...editForm, bannerColor: e.target.value })} className="w-16 h-10 p-1 rounded" />
                      </div>

                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Options (comma separated)</label>
                        <input value={editForm.deliveryOptions || ''} onChange={(e) => setEditForm({ ...editForm, deliveryOptions: e.target.value })} className="w-full p-2 rounded-lg border" placeholder="e.g. Shipping, Pickup, Local Delivery" />
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Profile Image</label>
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 bg-gray-100 rounded-full overflow-hidden">
                        {editForm.logoPreview ? (
                          <img src={editForm.logoPreview} alt="preview" className="w-full h-full object-cover" />
                        ) : editForm.logo ? (
                          <img src={editForm.logo.startsWith('/uploads') ? `${backendBase}${editForm.logo}` : editForm.logo} alt="preview" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-2xl">🏪</div>
                        )}
                      </div>
                      <div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={async (e) => {
                            const file = e.target.files && e.target.files[0];
                            if (!file) return;
                            // create object URL for fast preview
                            try {
                              if (editForm.logoPreview) {
                                try { URL.revokeObjectURL(editForm.logoPreview); } catch (er) {}
                              }
                              const obj = URL.createObjectURL(file);
                              // also read data URL so backend receives it on save
                              const reader = new FileReader();
                              reader.onload = () => {
                                setEditForm({ ...editForm, logo: reader.result, logoPreview: obj });
                              };
                              reader.readAsDataURL(file);
                            } catch (err) {
                              console.error('Image preview error', err);
                            }
                          }}
                        />
                        <p className="text-sm text-gray-500 mt-2">You can upload a profile image (PNG/JPEG). Will be saved to your seller profile.</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-blue-100 max-w-2xl">{seller.description}</p>
              )}
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section
        className="bg-gray-50 py-8 px-4 sm:px-6 border-b border-gray-200"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto max-w-6xl">
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-4 gap-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ staggerChildren: 0.1 }}
          >
            <motion.div
              className="bg-white rounded-lg p-6 text-center border border-gray-200"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <ShoppingBag className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{stats?.totalProducts}</div>
              <div className="text-sm text-gray-600">Products</div>
            </motion.div>

            <motion.div
              className="bg-white rounded-lg p-6 text-center border border-gray-200"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <Award className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{stats?.avgRating}</div>
              <div className="text-sm text-gray-600">Rating</div>
            </motion.div>

            <motion.div
              className="bg-white rounded-lg p-6 text-center border border-gray-200"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-sm text-gray-600">Member Since</div>
              <div className="text-lg font-bold text-gray-900">{stats?.joinDate}</div>
            </motion.div>

            <motion.div
              className="bg-white rounded-lg p-6 text-center border border-gray-200"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <Mail className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-sm text-gray-600">Contact</div>
              <a href={`mailto:${seller.email}`} className="text-blue-600 hover:text-blue-700 font-semibold text-sm">
                Email us
              </a>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Seller Details */}
      <motion.section
        className="py-12 px-4 sm:px-6"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto max-w-6xl">
          <motion.div
            className="bg-white rounded-lg border border-gray-200 p-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">About This Seller</h2>
            <div className="space-y-4">
              {seller.address && (
                <div className="flex gap-4">
                  <MapPin className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Address</h3>
                    <p className="text-gray-600">{seller.address}</p>
                  </div>
                </div>
              )}
              {seller.phone && (
                <div className="flex gap-4">
                  <Phone className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Phone</h3>
                    <a href={`tel:${seller.phone}`} className="text-blue-600 hover:text-blue-700">
                      {seller.phone}
                    </a>
                  </div>
                </div>
              )}
              {seller.email && (
                <div className="flex gap-4">
                  <Mail className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Email</h3>
                    <a href={`mailto:${seller.email}`} className="text-blue-600 hover:text-blue-700">
                      {seller.email}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Products Section */}
      <motion.section
        className="py-16 px-4 sm:px-6 bg-gray-50"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto max-w-6xl">
          <motion.h2
            className="text-3xl font-bold text-gray-900 mb-12 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Products from {seller.name}
          </motion.h2>

          {products.length > 0 ? (
            <ProductGrid products={products} />
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No products available yet.</p>
            </div>
          )}
        </div>
      </motion.section>
    </div>
  );
};

export default SellerProfile;
