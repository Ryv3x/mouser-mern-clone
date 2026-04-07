import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../services/api';

const SellerEditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', price: '', sellerPrice: '', minQuantity: 1, stock: '', description: '', imageUrl: '', specifications: [] });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/products/${id}`);
        if (data) setForm({
          name: data.name || '',
          price: data.price || '',
          sellerPrice: data.sellerPrice || '',
          minQuantity: data.minQuantity || 1,
          stock: data.stock || '',
          description: data.description || '',
          imageUrl: data.imageUrl || '',
          specifications: data.specifications && typeof data.specifications === 'object' ? Object.entries(data.specifications).map(([k,v])=>({key:k,value:v})) : []
        });
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
      // build specs object from form array
      const specs = {};
      (form.specifications || []).forEach(s => { if (s && s.key) specs[s.key] = s.value; });
      const payload = { ...form, price: parseFloat(form.price || 0), sellerPrice: form.sellerPrice !== '' ? parseFloat(form.sellerPrice) : undefined, minQuantity: parseInt(form.minQuantity || 1, 10), stock: parseInt(form.stock || 0, 10), specifications: specs };
      await api.put(`/products/${id}`, payload);
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

        <div className="mt-4">
          <h4 className="font-semibold mb-2">Specifications</h4>
          {(form.specifications || []).map((s, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <input placeholder="Key" value={s.key} onChange={(e) => { const copy = [...form.specifications]; copy[i] = { ...copy[i], key: e.target.value }; setForm({ ...form, specifications: copy }); }} className="flex-1 p-2 border rounded" />
              <input placeholder="Value" value={s.value} onChange={(e) => { const copy = [...form.specifications]; copy[i] = { ...copy[i], value: e.target.value }; setForm({ ...form, specifications: copy }); }} className="flex-1 p-2 border rounded" />
              <button type="button" onClick={() => setForm({ ...form, specifications: form.specifications.filter((_, idx) => idx !== i) })} className="text-red-600 px-2">Remove</button>
            </div>
          ))}
          <div className="flex gap-2">
            <button type="button" onClick={() => setForm({ ...form, specifications: [...(form.specifications || []), { key: '', value: '' }] })} className="px-3 py-2 bg-green-600 text-white rounded">Add spec</button>
            <button type="button" onClick={() => {
              const specsObj = {};
              (form.specifications || []).forEach(s => { if (s && s.key) specsObj[s.key] = s.value; });
              const blob = new Blob([JSON.stringify(specsObj, null, 2)], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a'); a.href = url; a.download = `${(form.name || 'product').replace(/\s+/g, '_')}_specs.json`; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
            }} className="px-3 py-2 bg-blue-600 text-white rounded">Download spec sheet</button>
          </div>
        </div>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded" disabled={submitting}>{submitting ? 'Saving…' : 'Save Changes'}</button>
      </form>
    </motion.div>
  );
};

export default SellerEditProduct;
