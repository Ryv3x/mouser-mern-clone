import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, MapPin, Phone } from 'lucide-react';
import api from '../services/api';

const AllManufacturers = () => {
  const [manufacturers, setManufacturers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    const fetchManufacturers = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/seller/list');
        setManufacturers(data || []);
      } catch (err) {
        console.error('Failed to fetch manufacturers:', err);
        setManufacturers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchManufacturers();
  }, []);

  const filtered = manufacturers.filter(m =>
    m.name.toLowerCase().includes(searchInput.toLowerCase())
  );

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
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            All Manufacturers
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Explore our trusted network of leading manufacturers and suppliers
          </p>

          {/* Search Bar */}
          <motion.div
            className="max-w-md mx-auto"
            whileHover={{ scale: 1.02 }}
          >
            <input
              type="text"
              placeholder="Search manufacturers..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full px-6 py-3 rounded-lg border-2 border-blue-300 focus:outline-none focus:border-blue-600 text-gray-700"
            />
          </motion.div>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <motion.div
              className="inline-block"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full" />
            </motion.div>
            <p className="text-gray-600 mt-4">Loading manufacturers...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && filtered.length === 0 && (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-xl text-gray-600">
              {searchInput ? 'No manufacturers found matching your search.' : 'No manufacturers available.'}
            </p>
          </motion.div>
        )}

        {/* Manufacturers Grid */}
        {!loading && filtered.length > 0 && (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filtered.map((manufacturer) => (
              <motion.div
                key={manufacturer._id}
                variants={itemVariants}
                whileHover={{ y: -8 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition"
              >
                {/* Banner / Logo Section */}
                {manufacturer.banner ? (
                  <div className="h-40 w-full overflow-hidden">
                    <img src={manufacturer.banner} alt={`${manufacturer.name} banner`} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="h-40 bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center overflow-hidden">
                    {manufacturer.logo ? (
                      <img
                        src={manufacturer.logo}
                        alt={manufacturer.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-5xl">🏭</div>
                    )}
                  </div>
                )}

                {/* Content Section */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {manufacturer.name}
                  </h3>

                  {/* Rating */}
                  {manufacturer.rating && (
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            className={i < Math.round(manufacturer.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">
                        {manufacturer.rating ? manufacturer.rating.toFixed(1) : 'N/A'}
                      </span>
                    </div>
                  )}

                  {/* Description */}
                  {manufacturer.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {manufacturer.description}
                    </p>
                  )}

                  {/* Contact Info */}
                  <div className="space-y-2 mb-6 text-sm text-gray-600">
                    {manufacturer.phone && (
                      <div className="flex items-center gap-2">
                        <Phone size={16} className="text-blue-600" />
                        <span>{manufacturer.phone}</span>
                      </div>
                    )}
                    {manufacturer.address && (
                      <div className="flex items-start gap-2">
                        <MapPin size={16} className="text-blue-600 flex-shrink-0 mt-0.5" />
                        <span className="line-clamp-2">{manufacturer.address}</span>
                      </div>
                    )}
                  </div>

                  {/* View Profile Button */}
                  <Link
                    to={`/seller/${manufacturer._id}`}
                    className="block w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition text-center"
                  >
                    View Profile
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Result Count */}
        {!loading && filtered.length > 0 && (
          <motion.div
            className="text-center mt-12 text-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p>
              Showing <span className="font-semibold text-gray-900">{filtered.length}</span> of{' '}
              <span className="font-semibold text-gray-900">{manufacturers.length}</span> manufacturers
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default AllManufacturers;
