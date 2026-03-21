import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [productsMap, setProductsMap] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const { data: cats } = await api.get('/categories');
        setCategories(cats || []);

        // Fetch a few products per category (client-side slice)
        const map = {};
        await Promise.all((cats || []).map(async (c) => {
          try {
            const { data: prods } = await api.get(`/products?category=${c._id}`);
            map[c._id] = (prods || []).slice(0, 4);
          } catch (err) {
            map[c._id] = [];
          }
        }));
        setProductsMap(map);
      } catch (err) {
        console.error('Failed to load categories:', err);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div className="text-center py-12">Loading categories...</div>;

  return (
    <motion.div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-28 pb-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900">All Categories</h1>
          <p className="text-gray-600 mt-2">Browse by category — tap a category to see more</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {categories.map((cat) => (
            <div key={cat._id} className="bg-white rounded-xl p-4 text-center border border-gray-200 hover:shadow-lg transition cursor-pointer" onClick={() => navigate(`/products?category=${cat._id}`)}>
              <div className="mb-3 h-20 flex items-center justify-center">
                {cat.iconImage ? (
                  <img src={cat.iconImage} alt={cat.name} className="w-16 h-16 object-cover rounded-md" />
                ) : (
                  <div className="text-4xl">{cat.icon || '📦'}</div>
                )}
              </div>
              <h3 className="font-semibold text-gray-900 text-sm truncate">{cat.name}</h3>
              <p className="text-xs text-gray-500 mt-1">/{cat.slug}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 space-y-8">
          {categories.map((cat) => (
            <div key={cat._id} className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  {cat.iconImage ? <img src={cat.iconImage} alt="icon" className="w-12 h-12 object-cover rounded"/> : <div className="text-2xl">{cat.icon || '📦'}</div>}
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{cat.name}</h3>
                    <p className="text-sm text-gray-500">Showing a few featured products</p>
                  </div>
                </div>
                <button onClick={() => navigate(`/category/${cat.slug}`)} className="text-sm text-blue-600">View all →</button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {(productsMap[cat._id] || []).map((p) => (
                  <div key={p._id} className="border rounded-lg p-2 text-center">
                    <div className="h-24 mb-2 overflow-hidden">
                      {p.images?.[0] ? <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" /> : <div className="h-24 flex items-center justify-center bg-gray-100">No image</div>}
                    </div>
                    <p className="text-sm font-medium text-gray-800 truncate">{p.name}</p>
                    <p className="text-xs text-gray-500">${(p.price||0).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Categories;
