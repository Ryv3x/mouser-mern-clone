import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, ThumbsUp } from 'lucide-react';
import { useSelector } from 'react-redux';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';

const ProductReviews = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [serverRating, setServerRating] = useState(0);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    rating: 5,
    title: '',
    content: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const user = useSelector((s) => s.auth.user);
  const navigate = useNavigate();
  
  useEffect(() => {
    let mounted = true;
    const fetchReviews = async () => {
      try {
        setLoadingReviews(true);
        const { data } = await (await import('../../services/api')).default.get(`/products/${productId}/reviews`);
        if (!mounted) return;
        const mapped = (data.reviews || []).map((r) => ({
          id: r._id || r.id,
          author: r.name || r.author || 'Anonymous',
          rating: r.rating || 0,
          date: r.createdAt ? new Date(r.createdAt).toISOString().split('T')[0] : (r.date || ''),
          title: r.title || '',
          content: r.content || r.comment || '',
          helpful: r.helpful || 0,
        }));
        setReviews(mapped);
        setServerRating(data.rating || 0);
      } catch (err) {
        // ignore for now
      } finally {
        if (mounted) setLoadingReviews(false);
      }
    };
    fetchReviews();
    return () => {
      mounted = false;
    };
  }, [productId]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      setSubmitting(true);
      const payload = { rating: formData.rating, title: formData.title, content: formData.content };
      const { data } = await api.post(`/products/${productId}/reviews`, payload);
      const added = data.review;
      // normalize returned review for UI
      const uiReview = {
        id: added._id || Date.now(),
        author: added.name || (user.name || user.email),
        rating: added.rating,
        date: new Date().toISOString().split('T')[0],
        title: added.title,
        content: added.content,
        helpful: added.helpful || 0,
      };
      const newReviews = [uiReview, ...reviews];
      setReviews(newReviews);
      // update serverRating locally
      setServerRating((newReviews.reduce((s, r) => s + (r.rating || 0), 0) / newReviews.length) || 0);
      setFormData({ rating: 5, title: '', content: '' });
      setShowForm(false);
    } catch (err) {
      console.error('Submit review error', err);
      // optionally show toast
    } finally {
      setSubmitting(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
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

  const computedAvg = reviews.length ? (reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length) : 0;
  const avgRating = (serverRating || computedAvg).toFixed(1);

  return (
    <motion.div
      className="mt-12 pt-8 border-t"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Customer Reviews</h3>

        {/* Review Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div variants={itemVariants} className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg">
            <p className="text-gray-600 mb-2">Average Rating</p>
            <div className="flex items-center gap-3">
              <p className="text-4xl font-bold text-blue-600">{avgRating}</p>
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={20}
                    className={i < Math.round(avgRating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                  />
                ))}
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-2">Based on {reviews.length} reviews</p>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg">
            <p className="text-gray-600 mb-2">5 Stars</p>
            <p className="text-3xl font-bold text-green-600">
              {reviews.filter((r) => r.rating === 5).length}
            </p>
          </motion.div>

          <motion.div variants={itemVariants}>
            <motion.button
              onClick={() => setShowForm(!showForm)}
              className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 transition"
              whileHover={{ scale: 1.02 }}
            >
              Write a Review
            </motion.button>
          </motion.div>
        </div>

        {/* Review Form */}
        {showForm && (
          <motion.form
            onSubmit={handleSubmitReview}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-50 p-6 rounded-lg mb-8"
          >
            <h4 className="font-bold text-gray-900 mb-4">Share Your Experience</h4>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <motion.button
                      key={star}
                      type="button"
                      onClick={() => setFormData({ ...formData, rating: star })}
                      className="p-2 hover:bg-yellow-100 rounded"
                      whileHover={{ scale: 1.1 }}
                    >
                      <Star
                        size={24}
                        className={
                          star <= formData.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                        }
                      />
                    </motion.button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  placeholder="Sum up your experience"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Review</label>
                <textarea
                  placeholder="What did you like or dislike?"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none h-24"
                  required
                />
              </div>

              <div className="flex gap-4">
                <motion.button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                  whileHover={{ scale: 1.02 }}
                >
                  Submit Review
                </motion.button>
                <motion.button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-400 transition"
                  whileHover={{ scale: 1.02 }}
                >
                  Cancel
                </motion.button>
              </div>
            </div>
          </motion.form>
        )}

        {/* Reviews List */}
        <motion.div className="space-y-4" variants={containerVariants} initial="hidden" animate="visible">
          {reviews.map((review) => (
            <motion.div
              key={review.id}
              variants={itemVariants}
              className="bg-white border border-gray-200 p-6 rounded-lg hover:shadow-md transition"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-semibold text-gray-900">{review.author}</p>
                  <p className="text-sm text-gray-500">{review.date}</p>
                </div>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={
                        i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                      }
                    />
                  ))}
                </div>
              </div>

              {review.title && (
                <p className="font-semibold text-gray-900 mb-2">{review.title}</p>
              )}

              <p className="text-gray-700 mb-4">{review.content}</p>

              <motion.button
                className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition"
                whileHover={{ x: 5 }}
              >
                <ThumbsUp size={16} />
                <span className="text-sm">Helpful ({review.helpful})</span>
              </motion.button>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default ProductReviews;
