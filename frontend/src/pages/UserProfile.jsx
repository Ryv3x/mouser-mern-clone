import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Calendar, Edit2, CheckCircle } from 'lucide-react';
import api from '../services/api';

const UserProfile = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchProfile();
  }, [user, navigate]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/users/profile');
      setProfile(data);
      setEditForm({
        name: data.name || '',
        phone: data.phone || '',
        address: data.address || '',
      });
    } catch (err) {
      console.error('Failed to fetch profile:', err);
      setMessage('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const { data } = await api.put('/users/profile', editForm);
      setProfile(data);
      setEditMode(false);
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error('Failed to update profile:', err);
      setMessage(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditMode(false);
    if (profile) {
      setEditForm({
        name: profile.name || '',
        phone: profile.phone || '',
        address: profile.address || '',
      });
    }
  };

  if (loading) {
    return (
      <motion.div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-28 pb-12 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity }}
          className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full"
        />
      </motion.div>
    );
  }

  if (!profile) {
    return (
      <motion.div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-28 pb-12 flex items-center justify-center">
        <p className="text-xl text-gray-600">Failed to load profile</p>
      </motion.div>
    );
  }

  return (
    <motion.div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-28 pb-12">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Profile</h1>
          <p className="text-gray-600">Manage your personal information</p>
        </motion.div>

        {/* Message */}
        {message && (
          <motion.div
            className={`mb-6 p-4 rounded-lg ${
              message.includes('success') || message.includes('successfully')
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {message}
          </motion.div>
        )}

        {/* Profile Card */}
        <motion.div
          className="bg-white rounded-xl shadow-lg overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-8 text-white">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-3xl font-bold">{profile.name}</h2>
                <div className="flex items-center gap-2 mt-2">
                  <CheckCircle size={18} className="text-blue-200" />
                  <span className="text-blue-100 capitalize">
                    {profile.role === 'user' ? 'Customer' : profile.role}
                  </span>
                </div>
              </div>
              <motion.button
                onClick={() => {
                  if (editMode) handleCancel();
                  else setEditMode(true);
                }}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg flex items-center gap-2 transition"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Edit2 size={18} />
                {editMode ? 'Cancel' : 'Edit'}
              </motion.button>
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-8">
            {!editMode ? (
              // View Mode
              <motion.div
                className="space-y-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {/* Email */}
                <div className="flex items-start gap-4">
                  <Mail className="text-blue-600 flex-shrink-0 mt-1" size={24} />
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Email Address</p>
                    <p className="text-lg text-gray-900">{profile.email}</p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-4">
                  <Phone className="text-blue-600 flex-shrink-0 mt-1" size={24} />
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Phone Number</p>
                    <p className="text-lg text-gray-900">{profile.phone || 'Not provided'}</p>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start gap-4">
                  <MapPin className="text-blue-600 flex-shrink-0 mt-1" size={24} />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 font-medium">Address</p>
                    <p className="text-lg text-gray-900">{profile.address || 'Not provided'}</p>
                  </div>
                </div>

                {/* Joined Date */}
                <div className="flex items-start gap-4 pt-4 border-t border-gray-200">
                  <Calendar className="text-blue-600 flex-shrink-0 mt-1" size={24} />
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Member Since</p>
                    <p className="text-lg text-gray-900">
                      {new Date(profile.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
              </motion.div>
            ) : (
              // Edit Mode
              <motion.div
                className="space-y-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 transition"
                    placeholder="Enter your full name"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 transition"
                    placeholder="Enter your phone number"
                  />
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <textarea
                    value={editForm.address}
                    onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 transition"
                    placeholder="Enter your address"
                    rows={3}
                  />
                </div>

                {/* Buttons */}
                <div className="flex gap-4 pt-4">
                  <motion.button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </motion.button>
                  <motion.button
                    onClick={handleCancel}
                    disabled={saving}
                    className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition disabled:opacity-50"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancel
                  </motion.button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <motion.button
            onClick={() => navigate('/user/settings')}
            className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition border-l-4 border-blue-600"
            whileHover={{ y: -4 }}
          >
            <h3 className="font-bold text-lg text-gray-900 mb-2">Account Settings</h3>
            <p className="text-gray-600 text-sm">Change password and security settings</p>
          </motion.button>

          {profile.role === 'seller' && (
            <motion.button
              onClick={() => navigate(`/seller/${profile._id}`)}
              className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition border-l-4 border-green-600"
              whileHover={{ y: -4 }}
            >
              <h3 className="font-bold text-lg text-gray-900 mb-2">Seller Profile</h3>
              <p className="text-gray-600 text-sm">View and manage your seller storefront</p>
            </motion.button>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default UserProfile;
