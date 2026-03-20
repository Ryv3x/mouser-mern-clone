import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../services/api';

const SellerEditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', price: '', stock: '', description: '', imageUrl: '' });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/seller/products/${id}`);
        if (data) setForm({ name: data.name || '', price: data.price || '', stock: data.stock || '', description: data.description || '', imageUrl: data.imageUrl || '' });
      } catch (err) {
        console.error('Failed to load product:', err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  const submit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const payload = { ...form, price: parseFloat(form.price || 0), stock: parseInt(form.stock || 0, 10) };
      await api.put(`/seller/products/${id}`, payload);
      navigate('/seller/products');
    } catch (err) {
      console.error('Update failed:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full"></div></div>;

  return (
    <motion.div className="min-h-screen p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h2 className="text-2xl font-bold mb-4">Edit Product</h2>
      <form onSubmit={submit} className="space-y-4 max-w-xl">
        <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Product name" className="w-full p-2 border rounded" required />
        <input value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="Price" className="w-full p-2 border rounded" required />
        <input value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} placeholder="Stock" className="w-full p-2 border rounded" required />
        <input value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} placeholder="Image URL" className="w-full p-2 border rounded" />
        <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" className="w-full p-2 border rounded" rows={4} />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded" disabled={submitting}>{submitting ? 'Saving…' : 'Save Changes'}</button>
      </form>
    </motion.div>
  );
};

export default SellerEditProduct;
