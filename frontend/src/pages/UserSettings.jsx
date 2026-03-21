import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react';
import api from '../services/api';
import { logout } from '../store/authSlice';

const UserSettings = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState('password');
  const [profileForm, setProfileForm] = useState({ name: user?.name || '', avatar: user?.avatar || '', banner: user?.banner || '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  // Password change form
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // Preferences form
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    orderUpdates: true,
    promotions: false,
    newsletter: false,
  });

  if (!user) {
    navigate('/login');
    return null;
  }

  const showMessage = (msg, type = 'success') => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(''), 4000);
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      showMessage('Please fill in all password fields', 'error');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showMessage('New passwords do not match', 'error');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      showMessage('New password must be at least 6 characters', 'error');
      return;
    }

    try {
      setLoading(true);
      await api.put('/users/change-password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });

      showMessage('Password changed successfully! Please log in again.', 'success');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });

      // Log out after 2 seconds
      setTimeout(() => {
        dispatch(logout());
        navigate('/login');
      }, 2000);
    } catch (err) {
      showMessage(
        err.response?.data?.message || 'Failed to change password',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePreferencesSave = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await api.put('/users/preferences', preferences);
      showMessage('Preferences updated successfully!', 'success');
    } catch (err) {
      showMessage(
        err.response?.data?.message || 'Failed to update preferences',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (
      window.confirm(
        'Are you sure you want to delete your account? This action cannot be undone.'
      )
    ) {
      try {
        setLoading(true);
        await api.delete('/users/account');
        showMessage('Account deleted successfully', 'success');
        setTimeout(() => {
          dispatch(logout());
          navigate('/');
        }, 2000);
      } catch (err) {
        showMessage(
          err.response?.data?.message || 'Failed to delete account',
          'error'
        );
      } finally {
        setLoading(false);
      }
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: 'user' },
    { id: 'password', label: 'Change Password', icon: Lock },
    { id: 'preferences', label: 'Preferences', icon: 'settings' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: 'easeOut' },
    },
  };

  return (
    <motion.div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-28 pb-12">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">Manage your account security and preferences</p>
        </motion.div>

        {/* Message */}
        {message && (
          <motion.div
            className={`mb-6 p-4 rounded-lg flex items-start gap-3 ${
              messageType === 'success'
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {messageType === 'success' ? (
              <CheckCircle size={20} className="flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
            )}
            <span>{message}</span>
          </motion.div>
        )}

        {/* Settings Container */}
        <motion.div
          className="bg-white rounded-xl shadow-lg overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Tabs */}
          <div className="border-b border-gray-200 flex">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-6 py-4 font-medium transition text-center ${
                  activeTab === tab.id
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                whileHover={{ backgroundColor: 'rgba(0,0,0,0.02)' }}
              >
                {tab.label}
              </motion.button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {/* Password Tab */}
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <motion.form
                onSubmit={async (e) => {
                  e.preventDefault();
                  try {
                    setLoading(true);
                    await api.put('/users/profile', profileForm);
                    showMessage('Profile updated successfully!', 'success');
                    setTimeout(() => window.location.reload(), 800);
                  } catch (err) {
                    showMessage(err.response?.data?.message || 'Failed to update profile', 'error');
                  } finally {
                    setLoading(false);
                  }
                }}
                className="space-y-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Avatar URL</label>
                  <input
                    type="text"
                    value={profileForm.avatar}
                    onChange={(e) => setProfileForm({ ...profileForm, avatar: e.target.value })}
                    placeholder="https://.../avatar.png"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                  />
                  <p className="text-xs text-gray-500 mt-1">Recommended avatar size: 320x320 px (square)</p>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Banner URL (optional)</label>
                  <input
                    type="text"
                    value={profileForm.banner}
                    onChange={(e) => setProfileForm({ ...profileForm, banner: e.target.value })}
                    placeholder="https://.../banner.jpg"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                  />
                  <p className="text-xs text-gray-500 mt-1">Recommended banner size for manufacturer page: 1400×300 px</p>
                </motion.div>

                <motion.button
                  type="submit"
                  disabled={loading}
                  className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Saving...' : 'Save Profile'}
                </motion.button>
              </motion.form>
            )}

            {activeTab === 'password' && (
              <motion.form
                onSubmit={handlePasswordChange}
                className="space-y-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.current ? 'text' : 'password'}
                      value={passwordForm.currentPassword}
                      onChange={(e) =>
                        setPasswordForm({
                          ...passwordForm,
                          currentPassword: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 transition pr-12"
                      placeholder="Enter your current password"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowPasswords({
                          ...showPasswords,
                          current: !showPasswords.current,
                        })
                      }
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500"
                    >
                      {showPasswords.current ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </button>
                  </div>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.new ? 'text' : 'password'}
                      value={passwordForm.newPassword}
                      onChange={(e) =>
                        setPasswordForm({
                          ...passwordForm,
                          newPassword: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 transition pr-12"
                      placeholder="Enter a new password (min. 6 characters)"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowPasswords({
                          ...showPasswords,
                          new: !showPasswords.new,
                        })
                      }
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500"
                    >
                      {showPasswords.new ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </button>
                  </div>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.confirm ? 'text' : 'password'}
                      value={passwordForm.confirmPassword}
                      onChange={(e) =>
                        setPasswordForm({
                          ...passwordForm,
                          confirmPassword: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 transition pr-12"
                      placeholder="Confirm your new password"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowPasswords({
                          ...showPasswords,
                          confirm: !showPasswords.confirm,
                        })
                      }
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500"
                    >
                      {showPasswords.confirm ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </button>
                  </div>
                </motion.div>

                <motion.button
                  type="submit"
                  disabled={loading}
                  className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {loading ? 'Updating...' : 'Update Password'}
                </motion.button>
              </motion.form>
            )}

            {/* Preferences Tab */}
            {activeTab === 'preferences' && (
              <motion.form
                onSubmit={handlePreferencesSave}
                className="space-y-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <div className="space-y-4">
                  <motion.label
                    variants={itemVariants}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={preferences.emailNotifications}
                      onChange={(e) =>
                        setPreferences({
                          ...preferences,
                          emailNotifications: e.target.checked,
                        })
                      }
                      className="w-5 h-5 rounded border-2 border-gray-300 text-blue-600 cursor-pointer"
                    />
                    <div>
                      <p className="font-medium text-gray-900">Email Notifications</p>
                      <p className="text-sm text-gray-600">
                        Receive important account notifications
                      </p>
                    </div>
                  </motion.label>

                  <motion.label
                    variants={itemVariants}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={preferences.orderUpdates}
                      onChange={(e) =>
                        setPreferences({
                          ...preferences,
                          orderUpdates: e.target.checked,
                        })
                      }
                      className="w-5 h-5 rounded border-2 border-gray-300 text-blue-600 cursor-pointer"
                    />
                    <div>
                      <p className="font-medium text-gray-900">Order Updates</p>
                      <p className="text-sm text-gray-600">
                        Get notified about order status changes
                      </p>
                    </div>
                  </motion.label>

                  <motion.label
                    variants={itemVariants}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={preferences.promotions}
                      onChange={(e) =>
                        setPreferences({
                          ...preferences,
                          promotions: e.target.checked,
                        })
                      }
                      className="w-5 h-5 rounded border-2 border-gray-300 text-blue-600 cursor-pointer"
                    />
                    <div>
                      <p className="font-medium text-gray-900">Promotional Offers</p>
                      <p className="text-sm text-gray-600">
                        Receive emails about special deals and offers
                      </p>
                    </div>
                  </motion.label>

                  <motion.label
                    variants={itemVariants}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={preferences.newsletter}
                      onChange={(e) =>
                        setPreferences({
                          ...preferences,
                          newsletter: e.target.checked,
                        })
                      }
                      className="w-5 h-5 rounded border-2 border-gray-300 text-blue-600 cursor-pointer"
                    />
                    <div>
                      <p className="font-medium text-gray-900">Newsletter</p>
                      <p className="text-sm text-gray-600">
                        Subscribe to our weekly newsletter
                      </p>
                    </div>
                  </motion.label>
                </div>

                <motion.button
                  type="submit"
                  disabled={loading}
                  className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  variants={itemVariants}
                >
                  {loading ? 'Saving...' : 'Save Preferences'}
                </motion.button>
              </motion.form>
            )}
          </div>
        </motion.div>

        {/* Danger Zone */}
        <motion.div
          className="mt-8 p-6 bg-red-50 border-2 border-red-200 rounded-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-bold text-red-900 mb-1">Delete Account</h3>
              <p className="text-red-700 text-sm">
                Permanently delete your account and all associated data. This action
                cannot be undone.
              </p>
            </div>
            <motion.button
              onClick={handleDeleteAccount}
              disabled={loading}
              className="px-6 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition disabled:opacity-50 flex-shrink-0"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Delete
            </motion.button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default UserSettings;
