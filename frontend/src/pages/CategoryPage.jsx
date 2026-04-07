import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Filter, ChevronDown, X } from 'lucide-react';
import api from '../services/api';
import ProductGrid from '../components/product/ProductGrid';

const CategoryPage = () => {
  const { categorySlug, subcategorySlug } = useParams();
  const navigate = useNavigate();
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
        const category = subcategorySlug || categorySlug;
        const { data } = await api.get(`/products?category=${category}`);
        setProducts(data);
      } catch (err) {
        console.error('Failed to load products:', err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [categorySlug, subcategorySlug]);

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
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

 return (
  <motion.div
    className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
  >
    <div className="container mx-auto px-4">

      {/* Header */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <button
          onClick={() => navigate("/")}
          className="text-blue-600 hover:text-blue-800 mb-4"
        >
          ← Back to Home
        </button>

        <h1 className="text-4xl font-bold text-gray-900 capitalize">
          {subcategorySlug
            ? subcategorySlug.replace("-", " ")
            : categorySlug?.replace("-", " ")}
        </h1>

        <p className="text-gray-600 mt-2">
          {filteredProducts.length} products found
        </p>
      </motion.div>

      <div className="flex gap-8">

    {/* Filters Sidebar */}
<motion.div
  className={`w-64 ${
    showFilters ? "block" : "hidden md:block"
  } bg-white rounded-xl shadow-md p-6 h-fit sticky top-4`}
  initial={{ opacity: 0, x: -20 }}
  animate={{ opacity: 1, x: 0 }}
>

  <div className="flex items-center justify-between mb-4 md:hidden">

    <h2 className="text-lg font-bold">
      Filters
    </h2>

    <button
      onClick={() => setShowFilters(false)}
      className="p-1 hover:bg-gray-100 rounded"
    >
      <X size={20} />
    </button>

  </div>
       {/* Price Filter */}
<motion.div
  variants={containerVariants}
  initial="hidden"
  animate="visible"
  className="space-y-4"
>

  <motion.div variants={itemVariants}>
    <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
      <Filter size={18} /> Price Range
    </h3>

    <input
      type="range"
      min="0"
      max="10000"
      value={filters.maxPrice}
      onChange={(e) =>
        setFilters({
          ...filters,
          maxPrice: parseFloat(e.target.value),
        })
      }
      className="w-full"
    />

    <div className="flex justify-between text-sm text-gray-600 mt-2">
      <span>${filters.minPrice}</span>
      <span>${filters.maxPrice}</span>
    </div>
  </motion.div>


  {/* Manufacturer Filter */}
  <motion.div variants={itemVariants}>

    <h3 className="font-bold text-gray-900 mb-3">
      Manufacturer
    </h3>

    <select
      value={filters.manufacturer}
      onChange={(e) =>
        setFilters({
          ...filters,
          manufacturer: e.target.value,
        })
      }
      className="w-full border border-gray-300 rounded-lg p-2 text-sm"
    >
      <option value="">All Manufacturers</option>

      {manufacturers.map((m) => (
        <option key={m} value={m}>
          {m}
        </option>
      ))}

    </select>

  </motion.div>


  {/* Sort By */}
  <motion.div variants={itemVariants}>

    <h3 className="font-bold text-gray-900 mb-3">
      Sort By
    </h3>

    <select
      value={filters.sortBy}
      onChange={(e) =>
        setFilters({
          ...filters,
          sortBy: e.target.value,
        })
      }
      className="w-full border border-gray-300 rounded-lg p-2 text-sm"
    >
      <option value="newest">Newest</option>
      <option value="price-low">Price: Low to High</option>
      <option value="price-high">Price: High to Low</option>
      <option value="name">Name (A-Z)</option>
    </select>

  </motion.div>


  {/* Clear Filters */}
  <motion.button
    variants={itemVariants}
    onClick={() =>
      setFilters({
        minPrice: 0,
        maxPrice: 10000,
        manufacturer: "",
        sortBy: "newest",
      })
    }
    className="w-full bg-gray-100 text-gray-900 py-2 rounded-lg font-semibold hover:bg-gray-200 transition"
  >
    Clear Filters
  </motion.button>

</motion.div>   {/* closes filter controls */}

</motion.div>   {/* closes Filters Sidebar — THIS WAS MISSING */}


{/* Products Grid */}
<motion.div className="flex-1">

  <div className="mb-4 md:hidden">
    <button
      onClick={() => setShowFilters(true)}
      className="flex items-center gap-2 bg-primary text-gray-900 px-4 py-2 rounded-lg"
    >
      <Filter size={18} /> Show Filters
    </button>
  </div>


  {loading ? (

    <div className="flex items-center justify-center h-96">
      <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full"></div>
    </div>

  ) : filteredProducts.length > 0 ? (

    <ProductGrid products={filteredProducts} />

  ) : (

    <motion.div
      className="bg-white rounded-xl shadow-md p-12 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <p className="text-gray-600 text-lg">
        No products match your filters. Try adjusting them.
      </p>
    </motion.div>

  )}

        </motion.div>   {/* closes Products Grid */}

</div>          {/* closes flex gap-8 */}

</div>         

</motion.div>   

);
};

export default CategoryPage;