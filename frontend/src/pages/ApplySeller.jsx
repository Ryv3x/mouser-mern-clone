import React, { useState } from 'react';
import { motion } from 'framer-motion';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';

const ApplySeller = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    companyName: '',
    phone: '',
    address: '',
    bio: '',
    website: '',
    vatNumber: '',
    productCategories: '',
    sampleProductUrl: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const { data } = await api.post('/seller/apply', form);
      setSuccess(true);
      setTimeout(() => navigate('/'), 2500);
    } catch (err) {
      console.error('Apply failed:', err);
      alert(err.response?.data?.message || 'Application failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <motion.div className="min-h-screen flex items-center justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="text-center p-6 bg-white rounded shadow">
          <h2 className="text-2xl font-bold mb-2">Application Submitted</h2>
          <p className="text-gray-600">Thanks — your seller application was submitted. Admin will review it shortly.</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50 py-16 px-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="container mx-auto max-w-3xl">
        <motion.div 
          className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Apply to Become a Seller</h2>
            <p className="text-gray-600">Complete the form below and our team will review your application.</p>
          </div>

          <form onSubmit={submit} className="space-y-6">
            {/* Company Info Section */}
            <div className="bg-gradient-to-r from-blue-50 to-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Business Information</h3>
              
              <motion.div whileHover={{ scale: 1.01 }} className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Company Name *</label>
                <input 
                  required 
                  value={form.companyName} 
                  onChange={(e) => setForm({ ...form, companyName: e.target.value })} 
                  placeholder="Business / Company Name" 
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition" 
                />
              </motion.div>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <motion.div whileHover={{ scale: 1.01 }}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                  <input 
                    required 
                    value={form.phone} 
                    onChange={(e) => setForm({ ...form, phone: e.target.value })} 
                    placeholder="Phone Number" 
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition" 
                  />
                </motion.div>

                <motion.div whileHover={{ scale: 1.01 }}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                  <input 
                    value={form.website} 
                    onChange={(e) => setForm({ ...form, website: e.target.value })} 
                    placeholder="https://example.com (optional)" 
                    type="url"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition" 
                  />
                </motion.div>
              </div>

              <motion.div whileHover={{ scale: 1.01 }} className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <input 
                  value={form.address} 
                  onChange={(e) => setForm({ ...form, address: e.target.value })} 
                  placeholder="Business Address" 
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition" 
                />
              </motion.div>

              <div className="grid md:grid-cols-2 gap-4">
                <motion.div whileHover={{ scale: 1.01 }}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">VAT / Tax ID</label>
                  <input 
                    value={form.vatNumber} 
                    onChange={(e) => setForm({ ...form, vatNumber: e.target.value })} 
                    placeholder="VAT Number (optional)" 
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition" 
                  />
                </motion.div>

                <motion.div whileHover={{ scale: 1.01 }}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Categories</label>
                  <input 
                    value={form.productCategories} 
                    onChange={(e) => setForm({ ...form, productCategories: e.target.value })} 
                    placeholder="e.g., Electronics, Sensors" 
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition" 
                  />
                </motion.div>
              </div>
            </div>

            {/* Products Section */}
            <div className="bg-gradient-to-r from-green-50 to-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Products & Details</h3>

              <motion.div whileHover={{ scale: 1.01 }} className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Sample Product Link</label>
                <input 
                  value={form.sampleProductUrl} 
                  onChange={(e) => setForm({ ...form, sampleProductUrl: e.target.value })} 
                  placeholder="Link to your sample product or catalog" 
                  type="url"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200 transition" 
                />
              </motion.div>

              <motion.div whileHover={{ scale: 1.01 }}>
                <label className="block text-sm font-medium text-gray-700 mb-2">About Your Business</label>
                <textarea 
                  value={form.bio} 
                  onChange={(e) => setForm({ ...form, bio: e.target.value })} 
                  placeholder="Tell us about your products, experience, and why you'd like to sell with us..." 
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200 transition resize-none" 
                  rows={5} 
                />
              </motion.div>
            </div>

            {/* Action Buttons */}
            <motion.div className="flex gap-3 pt-4 flex-col sm:flex-row">
              <Button 
                type="submit" 
                variant="primary" 
                disabled={submitting}
                className="flex-1 py-3 text-lg"
              >
                {submitting ? '⏳ Submitting…' : '✓ Submit Application'}
              </Button>
              <Button 
                type="button" 
                variant="secondary" 
                onClick={() => navigate('/')}
                className="flex-1 py-3 text-lg"
              >
                Cancel
              </Button>
            </motion.div>
          </form>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ApplySeller;
