import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Facebook, Twitter, Linkedin, Mail, Phone, MapPin, Heart, Send } from 'lucide-react';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
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

  return (
    <motion.footer
      className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white pt-16 pb-8"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <div className="container mx-auto px-4">
        {/* Newsletter Subscription */}
        <motion.div
          className="mb-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="grid md:grid-cols-2 gap-8 items-center"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div variants={itemVariants}>
              <h2 className="text-3xl font-bold mb-3">Subscribe to Our Newsletter</h2>
              <p className="text-blue-100 text-lg">
                Get the latest products, deals, and exclusive offers delivered to your inbox. Be the first to know!
              </p>
            </motion.div>

            <motion.form onSubmit={handleSubscribe} variants={itemVariants} className="flex gap-2">
              <div className="flex-1">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email..."
                  className="w-full px-6 py-4 rounded-lg focus:outline-none text-gray-700 font-medium"
                  required
                />
              </div>
              <motion.button
                type="submit"
                className="px-8 py-4 bg-white text-blue-600 rounded-lg font-bold hover:bg-blue-50 transition flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Send size={20} />
              </motion.button>
            </motion.form>

            {subscribed && (
              <motion.div
                className="md:col-span-2 bg-green-500 text-white p-4 rounded-lg text-center"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                ✅ Thanks for subscribing! Check your email for our latest updates.
              </motion.div>
            )}
          </motion.div>
        </motion.div>

        {/* Main Footer Content */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Brand */}
          <motion.div variants={itemVariants}>
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <span className="w-10 h-10 bg-primary rounded text-center leading-10 font-bold text-gray-900">M</span>
              Mouser Clone
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Your trusted source for quality electronics components. Fast shipping, competitive pricing, and exceptional customer service.
            </p>
            {/* Social Links */}
            <div className="flex gap-3">
              <motion.a
                href="#"
                className="p-3 bg-gray-700 rounded-full hover:bg-primary transition"
                whileHover={{ scale: 1.15, rotate: 10 }}
              >
                <Facebook size={18} />
              </motion.a>
              <motion.a
                href="#"
                className="p-3 bg-gray-700 rounded-full hover:bg-blue-400 transition"
                whileHover={{ scale: 1.15, rotate: 10 }}
              >
                <Twitter size={18} />
              </motion.a>
              <motion.a
                href="#"
                className="p-3 bg-gray-700 rounded-full hover:bg-blue-700 transition"
                whileHover={{ scale: 1.15, rotate: 10 }}
              >
                <Linkedin size={18} />
              </motion.a>
            </div>
          </motion.div>

          {/* Manufacturers */}
          <motion.div variants={itemVariants}>
            <h4 className="text-lg font-bold mb-6">Manufacturers</h4>
            <ul className="space-y-3 text-gray-400">
              <li>
                <Link to="/manufacturers" className="hover:text-white transition flex items-center gap-2">
                  → View All Manufacturers
                </Link>
              </li>
            </ul>
          </motion.div>
          {/* Quick Links */}
          <motion.div variants={itemVariants}>
            <h4 className="text-lg font-bold mb-6">Quick Links</h4>
            <ul className="space-y-3 text-gray-400">
              <li>
                <a href="/" className="hover:text-white transition flex items-center gap-2">
                  → Home
                </a>
              </li>
              <li>
                <a href="/products" className="hover:text-white transition flex items-center gap-2">
                  → Products
                </a>
              </li>
              <li>
                <a href="/" className="hover:text-white transition flex items-center gap-2">
                  → Categories
                </a>
              </li>
              <li>
                <a href="/info/contact-us" className="hover:text-white transition flex items-center gap-2">
                  → Contact Us
                </a>
              </li>
              <li>
                <a href="/" className="hover:text-white transition flex items-center gap-2">
                  → Track Order
                </a>
              </li>
            </ul>
          </motion.div>

          {/* Support */}
          <motion.div variants={itemVariants}>
            <h4 className="text-lg font-bold mb-6">Support</h4>
            <ul className="space-y-3 text-gray-400">
              <li>
                <a href="/info/help-center" className="hover:text-white transition flex items-center gap-2">
                  → Help Center
                </a>
              </li>
              <li>
                <a href="/info/contact-us" className="hover:text-white transition flex items-center gap-2">
                  → Contact Us
                </a>
              </li>
              <li>
                <a href="/info/shipping-info" className="hover:text-white transition flex items-center gap-2">
                  → Shipping Info
                </a>
              </li>
              <li>
                <a href="/info/returns" className="hover:text-white transition flex items-center gap-2">
                  → Returns
                </a>
              </li>
              <li>
                <a href="/info/faq" className="hover:text-white transition flex items-center gap-2">
                  → FAQ
                </a>
              </li>
            </ul>
          </motion.div>

          {/* Legal */}
          <motion.div variants={itemVariants}>
            <h4 className="text-lg font-bold mb-6">Legal</h4>
            <ul className="space-y-3 text-gray-400">
              <li>
                <a href="/" className="hover:text-white transition flex items-center gap-2">
                  → Privacy Policy
                </a>
              </li>
              <li>
                <a href="/" className="hover:text-white transition flex items-center gap-2">
                  → Terms & Conditions
                </a>
              </li>
              <li>
                <a href="/" className="hover:text-white transition flex items-center gap-2">
                  → Cookie Policy
                </a>
              </li>
              <li>
                <a href="/" className="hover:text-white transition flex items-center gap-2">
                  → Disclaimer
                </a>
              </li>
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div variants={itemVariants}>
            <h4 className="text-lg font-bold mb-6">Contact Info</h4>
            <ul className="space-y-4 text-gray-400">
              <li className="flex items-start gap-3">
                <Phone size={20} className="text-blue-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-white font-semibold">Phone</p>
                  <p className="text-sm">+1 (888) 555-0123</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail size={20} className="text-blue-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-white font-semibold">Email</p>
                  <p className="text-sm">support@mouser.com</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={20} className="text-blue-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-white font-semibold">Address</p>
                  <p className="text-sm">123 Tech Street, Silicon Valley, CA 94025</p>
                </div>
              </li>
            </ul>
          </motion.div>
        </motion.div>

        {/* Divider */}
        <motion.div
          className="border-t border-gray-700 my-8"
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        />

        {/* Bottom Section */}
        <motion.div
          className="flex flex-col md:flex-row items-center justify-between gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.p variants={itemVariants} className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} Mouser Clone. All rights reserved.
          </motion.p>

          <motion.p variants={itemVariants} className="text-gray-400 text-sm flex items-center gap-2">
            Made with
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <Heart size={16} className="text-red-500 fill-red-500" />
            </motion.span>
            by Developers
          </motion.p>

          {/* Payment Methods */}
          <motion.div variants={itemVariants} className="flex gap-3 text-xs">
            <span className="px-3 py-1 bg-gray-700 rounded text-gray-300">💳 Credit Card</span>
            <span className="px-3 py-1 bg-gray-700 rounded text-gray-300">🏦 Bank Transfer</span>
            <span className="px-3 py-1 bg-gray-700 rounded text-gray-300">📱 PayPal</span>
          </motion.div>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;
