import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../services/api';

const SellerProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/seller/products');
        setProducts(data || []);
      } catch (err) {
        console.error('Failed to load seller products:', err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const del = async (id) => {
    if (!confirm('Delete this product?')) return;
    try {
      await api.delete(`/seller/products/${id}`);
      setProducts((p) => p.filter((x) => x._id !== id));
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  return (
    <motion.div className="min-h-screen p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Your Products</h2>
        <button onClick={() => navigate('/seller/products/add')} className="bg-blue-600 text-white px-4 py-2 rounded">Add Product</button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12"><div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full"></div></div>
      ) : products.length === 0 ? (
        <div className="text-gray-600 py-8">No products yet</div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="text-left p-3">Name</th>
                <th className="text-left p-3">Price</th>
                <th className="text-left p-3">Stock</th>
                <th className="text-left p-3">Review</th>
                <th className="text-left p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((pr) => (
                <tr key={pr._id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{pr.name}</td>
                  <td className="p-3 text-blue-600 font-semibold">${pr.price}</td>
                  <td className="p-3">{pr.stock}</td>
                  <td className="p-3">
                    {pr.reviewStatus === 'pending' ? (
                      <span className="px-2 py-1 text-sm rounded bg-yellow-100 text-yellow-800">In review</span>
                    ) : pr.reviewStatus === 'rejected' ? (
                      <span className="px-2 py-1 text-sm rounded bg-red-100 text-red-800">Rejected</span>
                    ) : (
                      <span className="px-2 py-1 text-sm rounded bg-green-100 text-green-800">Approved</span>
                    )}
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <button onClick={() => navigate(`/seller/products/edit/${pr._id}`)} className="px-3 py-1 bg-yellow-400 rounded">Edit</button>
                      <button onClick={() => del(pr._id)} className="px-3 py-1 bg-red-500 text-white rounded">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}
    </motion.div>
  );
};

export default SellerProducts;
