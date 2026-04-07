import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { setSponsors } from '../store/adminSlice';
import api from '../services/api';
import SponsorCard from '../components/product/SponsorCard';
import Loader from '../components/common/Loader';

const Sponsors = () => {
  const dispatch = useDispatch();
  const sponsors = useSelector((state) => state.admin?.sponsors || []);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (sponsors.length === 0) {
      const fetchSponsors = async () => {
        try {
          setLoading(true);
          const { data } = await api.get('/sponsors');
          dispatch(setSponsors(data || []));
        } catch (err) {
          console.error('Failed to fetch sponsors:', err);
        } finally {
          setLoading(false);
        }
      };
      fetchSponsors();
    }
  }, [sponsors.length, dispatch]);

  if (loading && sponsors.length === 0) return <Loader />;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <motion.section
        className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-16 px-4 sm:px-6"
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
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">Our Sponsors</h1>
            <p className="text-lg text-blue-100 max-w-2xl mx-auto">
              Meet the trusted partners who help us bring you the best products and services
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* Sponsors Grid */}
      <motion.section
        className="py-16 px-4 sm:px-6"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto max-w-6xl">
          {sponsors.length > 0 ? (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ staggerChildren: 0.1 }}
            >
              {sponsors.map((sponsor) => (
                <motion.div
                  key={sponsor._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="group"
                >
                  <SponsorCard sponsor={sponsor} />
                  {sponsor.website && (
                    <motion.a
                      href={sponsor.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                      whileHover={{ x: 5 }}
                    >
                      Visit Website
                      <ExternalLink size={16} />
                    </motion.a>
                  )}
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No sponsors available yet.</p>
            </div>
          )}
        </div>
      </motion.section>

      {/* Info Section */}
      <motion.section
        className="bg-gray-50 py-16 px-4 sm:px-6 border-t border-gray-200"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto max-w-6xl">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Interested in Sponsorship?</h2>
            <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
              If you'd like to become a sponsor and reach our growing community, we'd love to hear from you.
            </p>
            <motion.a
              href="mailto:sponsors@mouser.com"
              className="inline-block px-8 py-3 bg-primary text-gray-900 rounded-lg font-semibold hover:bg-primary-600 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Contact Us
            </motion.a>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default Sponsors;
