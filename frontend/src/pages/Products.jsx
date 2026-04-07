import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Filter, ChevronDown, X } from 'lucide-react';
import api from '../services/api';
import ProductGrid from '../components/product/ProductGrid';
import Loader from '../components/common/Loader';

const Products = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    minPrice: 0,
    maxPrice: 10000,
    manufacturer: '',
    sortBy: 'newest',
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const categoryParam = searchParams.get('category');
        const url = categoryParam ? `/products?category=${categoryParam}` : '/products';
        const { data } = await api.get(url);
        setProducts(data);
      } catch (err) {
        console.error('Failed to load products:', err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [searchParams]);

  const filteredProducts = products
    .filter((p) => p.price >= filters.minPrice && p.price <= filters.maxPrice)
    .filter((p) => !filters.manufacturer || p.manufacturer === filters.manufacturer)
    .sort((a, b) => {
      if (filters.sortBy === 'price-low') return a.price - b.price;
      if (filters.sortBy === 'price-high') return b.price - a.price;
      if (filters.sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });

  const manufacturers = [...new Set(products.map((p) => p.manufacturer))].filter(Boolean);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  if (loading) return <Loader />;

  return (
    <motion.div
      className="min-h-screen bg-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <motion.section
        className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-12 px-4 sm:px-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto max-w-6xl">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">All Products</h1>
            <p className="text-blue-100 text-lg max-w-2xl mx-auto">
              Browse our complete collection of electronic components and gadgets
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* Main Content */}
      <div className="container mx-auto max-w-7xl px-4 py-12">
        <div className="flex gap-8">
          {/* Sidebar Filters - Desktop */}
          <motion.div
            className="hidden lg:block w-64 flex-shrink-0"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              className="bg-white border border-gray-200 rounded-lg p-6 sticky top-24"
              variants={itemVariants}
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Filter size={20} /> Filters
              </h2>

              {/* Price Range */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-4">Price Range</h3>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="10000"
                    value={filters.maxPrice}
                    onChange={(e) =>
                      setFilters({ ...filters, maxPrice: parseInt(e.target.value) })
                    }
                    className="w-full"
                  />
                  <div className="flex gap-2 text-sm">
                    <span className="text-gray-600">${filters.minPrice}</span>
                    <span className="text-gray-600">-</span>
                    <span className="text-gray-600">${filters.maxPrice}</span>
                  </div>
                </div>
              </div>

              {/* Manufacturer */}
              {manufacturers.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Manufacturer</h3>
                  <select
                    value={filters.manufacturer}
                    onChange={(e) =>
                      setFilters({ ...filters, manufacturer: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                  >
                    <option value="">All Manufacturers</option>
                    {manufacturers.map((mfg) => (
                      <option key={mfg} value={mfg}>
                        {mfg}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Sort */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Sort By</h3>
                <select
                  value={filters.sortBy}
                  onChange={(e) =>
                    setFilters({ ...filters, sortBy: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                >
                  <option value="newest">Newest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name: A to Z</option>
                </select>
              </div>
            </motion.div>
          </motion.div>

          {/* Products Section */}
          <motion.div
            className="flex-1"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Mobile Filter Button */}
            <motion.button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden mb-6 w-full px-4 py-3 bg-primary text-gray-900 rounded-lg flex items-center justify-center gap-2 hover:bg-primary-600 transition-colors"
              variants={itemVariants}
            >
              <Filter size={20} /> {showFilters ? 'Hide' : 'Show'} Filters
            </motion.button>

            {/* Mobile Filters */}
            {showFilters && (
              <motion.div
                className="lg:hidden mb-6 bg-white border border-gray-200 rounded-lg p-6"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                {/* Price Range */}
                <div className="mb-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Price Range</h3>
                  <input
                    type="range"
                    min="0"
                    max="10000"
                    value={filters.maxPrice}
                    onChange={(e) =>
                      setFilters({ ...filters, maxPrice: parseInt(e.target.value) })
                    }
                    className="w-full"
                  />
                  <div className="flex gap-2 text-sm mt-2">
                    <span className="text-gray-600">${filters.minPrice}</span>
                    <span className="text-gray-600">-</span>
                    <span className="text-gray-600">${filters.maxPrice}</span>
                  </div>
                </div>

                {/* Manufacturer */}
                {manufacturers.length > 0 && (
                  <div className="mb-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Manufacturer</h3>
                    <select
                      value={filters.manufacturer}
                      onChange={(e) =>
                        setFilters({ ...filters, manufacturer: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                    >
                      <option value="">All Manufacturers</option>
                      {manufacturers.map((mfg) => (
                        <option key={mfg} value={mfg}>
                          {mfg}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Sort */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Sort By</h3>
                  <select
                    value={filters.sortBy}
                    onChange={(e) =>
                      setFilters({ ...filters, sortBy: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                  >
                    <option value="newest">Newest</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="name">Name: A to Z</option>
                  </select>
                </div>
              </motion.div>
            )}

            {/* Results Info */}
            <motion.div
              className="mb-6 flex items-center justify-between"
              variants={itemVariants}
            >
              <p className="text-gray-600">
                Showing <span className="font-bold">{filteredProducts.length}</span> products
              </p>
            </motion.div>

            {/* Products Grid */}
            {filteredProducts.length > 0 ? (
              <ProductGrid products={filteredProducts} />
            ) : (
              <motion.div
                className="text-center py-12"
                variants={itemVariants}
              >
                <p className="text-gray-600 text-lg">No products found matching your filters.</p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Products;
