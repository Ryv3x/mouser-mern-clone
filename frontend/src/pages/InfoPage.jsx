import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import Loader from '../components/common/Loader';
import { motion } from 'framer-motion';

const InfoPage = () => {
  const { slug } = useParams();
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/public/help/${slug}`);
        setPage(data);
      } catch (err) {
        console.error('Failed to load page', err);
        setPage(null);
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetchPage();
  }, [slug]);

  if (loading) return <Loader />;
  if (!page) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-600">Page not found.</p>
    </div>
  );

  return (
    <motion.div
      className="min-h-screen bg-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* hero heading */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 py-20 text-center">
        <h1 className="text-5xl font-extrabold text-white">{page.title}</h1>
      </div>

      <div className="container mx-auto max-w-4xl px-4 py-12">
        <div
          className="prose prose-lg text-gray-800"
          dangerouslySetInnerHTML={{ __html: page.content }}
        />
        <div className="mt-8">
          <Link to="/" className="text-blue-600 hover:underline">← Back to home</Link>
        </div>
      </div>
    </motion.div>
  );
};

export default InfoPage;
