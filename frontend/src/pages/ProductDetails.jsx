import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart, Share2, ChevronLeft, ChevronRight, Star, Truck, Shield } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../store/cartSlice';
import ProductReviews from '../components/product/ProductReviews';
import ProductSpecifications from '../components/product/ProductSpecifications';
import api from '../services/api';

const ProductDetails = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [imageIndex, setImageIndex] = useState(0);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/products/${productId}`);
        setProduct(data);
        // if product defines a minimum order quantity, use it as initial quantity
        if (data?.minQuantity && Number.isFinite(Number(data.minQuantity))) {
          setQuantity(parseInt(data.minQuantity, 10));
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  const handleAddToCart = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    const minQ = product?.minQuantity ? parseInt(product.minQuantity, 10) : 1;
    const qtyToAdd = Math.max(minQ, quantity);
    if (qtyToAdd !== quantity) setQuantity(qtyToAdd);
    dispatch(addToCart({ ...product, quantity: qtyToAdd }));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
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

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <p>{error}</p>
        </motion.div>
      </div>
    );

  if (!product) return null;

  const images = Array.isArray(product.images)
    ? product.images
    : product.images
    ? String(product.images).split(',')
    : ['https://via.placeholder.com/500?text=No+Image'];
  const nextImage = () => setImageIndex((imageIndex + 1) % images.length);
  const prevImage = () => setImageIndex((imageIndex - 1 + images.length) % images.length);

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <motion.button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6"
          whileHover={{ x: -5 }}
        >
          <ChevronLeft size={20} /> Back
        </motion.button>

        <motion.div
          className="grid md:grid-cols-2 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Image Section */}
          <motion.div variants={itemVariants} className="flex flex-col gap-4">
            <motion.div
              className="relative w-full aspect-square bg-white rounded-2xl shadow-lg overflow-hidden"
              whileHover={{ scale: 1.02 }}
            >
              <img
                src={images[imageIndex]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100"
                  >
                    <ChevronRight size={24} />
                  </button>
                </>
              )}
              <div className="absolute top-4 right-4 bg-primary text-gray-900 px-3 py-1 rounded-full text-sm font-semibold">
                {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
              </div>
            </motion.div>

            {/* Image Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {images.map((img, idx) => (
                  <motion.button
                    key={idx}
                    onClick={() => setImageIndex(idx)}
                    className={`w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 transition ${
                      idx === imageIndex ? 'border-blue-600' : 'border-gray-300'
                    }`}
                    whileHover={{ scale: 1.05 }}
                  >
                    <img src={img} alt={`thumbnail-${idx}`} className="w-full h-full object-cover" />
                  </motion.button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Details Section */}
          <motion.div variants={itemVariants} className="flex flex-col gap-6">
            {/* Product Name & Rating */}
            <div>
              <motion.h1 variants={itemVariants} className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                {product.name}
              </motion.h1>
              <motion.p variants={itemVariants} className="text-gray-600 mb-2">
                Manufacturer: <span className="font-semibold text-gray-900">{product.manufacturer}</span>
              </motion.p>
              <motion.div variants={itemVariants} className="flex items-center gap-2">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-gray-600">(0 reviews)</span>
              </motion.div>
            </div>

            {/* Price & Category */}
            <motion.div variants={itemVariants} className="bg-white rounded-xl p-4 shadow">
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-4xl font-bold text-blue-600">${product.price?.toFixed(2)}</span>
                {product.originalPrice && (
                  <span className="text-lg text-gray-500 line-through">${product.originalPrice?.toFixed(2)}</span>
                )}
              </div>
              <p className="text-sm text-gray-600">Category: <span className="font-semibold">{product.category}</span></p>
            </motion.div>

            {/* Benefits */}
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-2">
              <motion.div variants={itemVariants} className="flex items-center gap-3 text-gray-700">
                <Truck className="text-green-600" size={20} />
                <span>Free shipping on orders over $50</span>
              </motion.div>
              <motion.div variants={itemVariants} className="flex items-center gap-3 text-gray-700">
                <Shield className="text-green-600" size={20} />
                <span>30-day return policy & warranty</span>
              </motion.div>
            </motion.div>

            {/* Quantity Selector */}
            <motion.div variants={itemVariants} className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <span className="text-gray-700 font-semibold">Quantity:</span>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(product?.minQuantity ? parseInt(product.minQuantity, 10) : 1, quantity - 1))}
                    className="px-4 py-2 hover:bg-gray-100"
                  >
                    −
                  </button>
                  <span className="px-6 py-2 font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2 hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
                {product.stock > 0 && <span className="text-green-600 font-semibold">{product.stock} available</span>}
              </div>
              {product.minQuantity && (
                <div className="text-sm text-gray-600">Minimum order: <span className="font-semibold">{product.minQuantity}</span></div>
              )}
            </motion.div>

            {/* Action Buttons */}
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="flex gap-4">
              <motion.button
                variants={itemVariants}
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 bg-primary text-gray-900 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-primary-600 disabled:opacity-50 transition"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <ShoppingCart size={20} /> Add to Cart
              </motion.button>
              <motion.button
                variants={itemVariants}
                className="p-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                whileHover={{ scale: 1.05 }}
              >
                <Heart size={20} />
              </motion.button>
              <motion.button
                variants={itemVariants}
                className="p-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                whileHover={{ scale: 1.05 }}
              >
                <Share2 size={20} />
              </motion.button>
            </motion.div>

            {/* Description */}
            <motion.div variants={itemVariants} className="border-t pt-6">
              <h3 className="text-xl font-bold mb-3">Product Description</h3>
              <p className="text-gray-700 leading-relaxed">
                {product.description || 'High-quality electronic component manufactured to industry standards. Perfect for your projects and applications.'}
              </p>
            </motion.div>

            {/* Specifications */}
            <motion.div variants={itemVariants} className="border-t pt-6">
              <h3 className="text-xl font-bold mb-4">Specifications</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Model', value: product.model || 'N/A' },
                  { label: 'Type', value: product.type || 'Electronic Component' },
                  { label: 'Condition', value: 'New' },
                  { label: 'RoHS Compliant', value: 'Yes' },
                ].map((spec, i) => (
                  <motion.div key={i} variants={itemVariants} className="bg-gray-50 p-3 rounded">
                    <p className="text-sm text-gray-600">{spec.label}</p>
                    <p className="font-semibold text-gray-900">{spec.value}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Reviews Section */}
        <ProductSpecifications specs={product.specifications} />
        <div className="mt-4">
          <button
            onClick={() => {
              const specs = product.specifications || {};
              const blob = new Blob([JSON.stringify(specs, null, 2)], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `${(product.name || 'product').replace(/\s+/g, '_')}_specs.json`;
              document.body.appendChild(a);
              a.click();
              a.remove();
              URL.revokeObjectURL(url);
            }}
            className="px-3 py-2 bg-blue-600 text-white rounded"
          >
            Download Spec Sheet
          </button>
        </div>
        <ProductReviews productId={productId} />

        {/* Frequently Bought Together */}
        <motion.section
          className="mt-16 bg-white rounded-2xl p-8 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-bold mb-6">Frequently Bought Together</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "Arduino UNO R3", price: 24.99, image: "https://via.placeholder.com/200?text=Arduino" },
              { name: "Jumper Wires", price: 8.99, image: "https://via.placeholder.com/200?text=Wires" },
              { name: "Breadboard", price: 12.99, image: "https://via.placeholder.com/200?text=Breadboard" }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
                whileHover={{ scale: 1.02 }}
              >
                <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                <div className="flex-1">
                  <h4 className="font-semibold text-sm">{item.name}</h4>
                  <p className="text-blue-600 font-bold">${item.price}</p>
                </div>
                <input type="checkbox" className="w-5 h-5 text-blue-600" />
              </motion.div>
            ))}
          </div>
          <div className="mt-6 flex justify-between items-center">
            <div className="text-lg">
              <span className="text-gray-600">Total: </span>
              <span className="font-bold text-green-600">$46.97</span>
              <span className="text-sm text-gray-500 ml-2">(Save 10%)</span>
            </div>
            <motion.button
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Add All to Cart
            </motion.button>
          </div>
        </motion.section>

        {/* Technical Specifications */}
        <motion.section
          className="mt-16 bg-white rounded-2xl p-8 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          <h3 className="text-2xl font-bold mb-6">Technical Specifications</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <tbody>
                {[
                  { label: 'Manufacturer Part Number', value: product.manufacturerPartNumber || 'N/A' },
                  { label: 'Manufacturer', value: product.manufacturer || 'N/A' },
                  { label: 'Category', value: product.category || 'N/A' },
                  { label: 'Subcategory', value: product.subcategory || 'N/A' },
                  { label: 'Operating Voltage', value: '3.3V - 5V' },
                  { label: 'Current Consumption', value: '< 50mA' },
                  { label: 'Operating Temperature', value: '-40°C to +85°C' },
                  { label: 'Dimensions', value: '68.6mm x 53.3mm x 12.7mm' },
                  { label: 'Weight', value: '25g' },
                  { label: 'RoHS Compliant', value: 'Yes' },
                  { label: 'REACH Compliant', value: 'Yes' },
                  { label: 'Warranty', value: '1 Year' }
                ].map((spec, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="border border-gray-300 px-4 py-3 font-semibold text-gray-700">{spec.label}</td>
                    <td className="border border-gray-300 px-4 py-3 text-gray-900">{spec.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.section>

        {/* Shipping & Returns */}
        <motion.section
          className="mt-16 grid md:grid-cols-2 gap-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <Truck className="text-blue-600" size={32} />
              <h3 className="text-2xl font-bold">Shipping Information</h3>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Standard Shipping</span>
                <span className="font-semibold">Free (3-5 business days)</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Express Shipping</span>
                <span className="font-semibold">$9.99 (1-2 business days)</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Overnight</span>
                <span className="font-semibold">$19.99 (Next business day)</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">International</span>
                <span className="font-semibold">Calculated at checkout</span>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              Orders placed before 2 PM EST ship the same business day.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="text-green-600" size={32} />
              <h3 className="text-2xl font-bold">Returns & Warranty</h3>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">30-Day Return Policy</h4>
                <p className="text-green-700 text-sm">
                  Return any item within 30 days for a full refund. Items must be in original condition.
                </p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">1-Year Warranty</h4>
                <p className="text-blue-700 text-sm">
                  All products come with manufacturer warranty. Defective items will be replaced or refunded.
                </p>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg">
                <h4 className="font-semibold text-yellow-800 mb-2">Technical Support</h4>
                <p className="text-yellow-700 text-sm">
                  Free technical support available 24/7. Contact our engineers for assistance.
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Related Products */}
        <motion.section
          className="mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-2xl font-bold mb-8">You Might Also Like</h3>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                id: 1,
                name: "Raspberry Pi 4",
                price: 89.99,
                image: "https://via.placeholder.com/250?text=Raspberry+Pi",
                rating: 4.8
              },
              {
                id: 2,
                name: "ESP32 Development Board",
                price: 15.99,
                image: "https://via.placeholder.com/250?text=ESP32",
                rating: 4.6
              },
              {
                id: 3,
                name: "Arduino Mega 2560",
                price: 45.99,
                image: "https://via.placeholder.com/250?text=Arduino+Mega",
                rating: 4.7
              },
              {
                id: 4,
                name: "LED Strip 5M",
                price: 29.99,
                image: "https://via.placeholder.com/250?text=LED+Strip",
                rating: 4.5
              }
            ].map((relatedProduct) => (
              <motion.div
                key={relatedProduct.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
                whileHover={{ y: -5 }}
                onClick={() => navigate(`/product/${relatedProduct.id}`)}
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={relatedProduct.image}
                    alt={relatedProduct.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                  />
                </div>
                <div className="p-4">
                  <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">{relatedProduct.name}</h4>
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="text-yellow-400 fill-current" size={16} />
                    <span className="text-sm text-gray-600">{relatedProduct.rating}</span>
                  </div>
                  <p className="text-blue-600 font-bold text-lg">${relatedProduct.price}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Customer Questions */}
        <motion.section
          className="mt-16 bg-white rounded-2xl p-8 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-2xl font-bold mb-6">Frequently Asked Questions</h3>
          <div className="space-y-4">
            {[
              {
                question: "Is this product RoHS compliant?",
                answer: "Yes, all our products are RoHS compliant and meet international environmental standards."
              },
              {
                question: "Do you provide technical documentation?",
                answer: "Yes, detailed datasheets, schematics, and technical specifications are available for download."
              },
              {
                question: "What's the warranty period?",
                answer: "All products come with a 1-year manufacturer warranty. Extended warranty options are available."
              },
              {
                question: "Can I get volume discounts?",
                answer: "Yes, we offer volume discounts for bulk orders. Contact our sales team for pricing."
              }
            ].map((faq, idx) => (
              <motion.div
                key={idx}
                className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <h4 className="font-semibold text-gray-900 mb-2">{faq.question}</h4>
                <p className="text-gray-600">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Product Highlights */}
        <motion.section
          className="mt-16 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Why Choose This Product?</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              This high-quality component offers exceptional performance and reliability for your projects.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: "⚡",
                title: "High Performance",
                description: "Optimized for speed and efficiency in demanding applications."
              },
              {
                icon: "🛡️",
                title: "Reliable Quality",
                description: "Manufactured to strict quality standards with comprehensive testing."
              },
              {
                icon: "🔧",
                title: "Easy Integration",
                description: "Compatible with popular development platforms and frameworks."
              }
            ].map((highlight, idx) => (
              <motion.div
                key={idx}
                className="text-center bg-white rounded-xl p-6 shadow-lg"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="text-4xl mb-4">{highlight.icon}</div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">{highlight.title}</h4>
                <p className="text-gray-600">{highlight.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>
    </motion.div>
  );
};

export default ProductDetails;
