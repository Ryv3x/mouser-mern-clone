import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setProducts, setLoading } from '../store/productSlice';
import { setSponsors } from '../store/adminSlice';
import api from '../services/api';
import ProductGrid from '../components/product/ProductGrid';
import Loader from '../components/common/Loader';
import SponsorCard from '../components/product/SponsorCard';
import { motion } from 'framer-motion';
import {
  ChevronRight,
  Star,
  Truck,
  Shield,
  Headphones,
  Award,
  Users,
  Package,
  TrendingUp,
  Clock,
  CheckCircle,
  ShoppingCart,
  Heart,
  Zap,
  Globe,
  Mail
} from 'lucide-react';

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, status } = useSelector((state) => state.products);
  const admin = useSelector((state) => state.admin);
  const sponsors = Array.isArray(admin?.sponsors) ? admin.sponsors : [];
  const categories = Array.isArray(admin?.categories) ? admin.categories : [];
  const [localCategories, setLocalCategories] = useState([]);
  const [homeSettings, setHomeSettings] = useState(null);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [displayedCategories, setDisplayedCategories] = useState([]);
  const [bgImageError, setBgImageError] = useState(false);
  const [activeTab, setActiveTab] = useState('featured');
  const [email, setEmail] = useState('');
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);

  useEffect(() => {
    const fetchAll = async () => {
      dispatch(setLoading());
      try {
        const [{ data: productsData }, { data: sponsorsData }, { data: categoriesData }, { data: settingsData }] = await Promise.all([
          api.get('/products'),
          api.get('/sponsors'),
          api.get('/categories'),
          api.get('/home-settings').catch(() => ({ data: null })),
        ]);

        dispatch(setProducts(productsData));
        dispatch(setSponsors(sponsorsData));

        if (categoriesData && !categories.length) {
          setLocalCategories(categoriesData);
        }

        if (settingsData) {
          setHomeSettings(settingsData);
          if (settingsData.featuredProductIds && settingsData.featuredProductIds.length > 0) {
            setDisplayedProducts(settingsData.featuredProductIds);
          } else {
            setDisplayedProducts(productsData);
          }

          if (settingsData.displayedCategoryIds && settingsData.displayedCategoryIds.length > 0) {
              // Normalize displayedCategoryIds to an array of category objects or ids
              let ids = settingsData.displayedCategoryIds;
              if (!Array.isArray(ids)) {
                ids = String(ids).split(',').map((s) => s.trim()).filter(Boolean);
              }
              // If we have full category objects (categoriesData), map ids to objects
              const allCats = categoriesData || categories || [];
              const mapped = ids.map((id) => {
                const found = allCats.find((c) => c && (c._id === id || c.slug === id || c.name === id));
                return found || id;
              });
              setDisplayedCategories(mapped);
          } else {
            const allCats = categoriesData || categories;
            setDisplayedCategories(allCats);
          }
        } else {
          setDisplayedProducts(productsData);
          setDisplayedCategories(categoriesData || categories);
        }
      } catch (err) {
        console.error(err);
        setDisplayedProducts(items);
        const allCats = categories.length > 0 ? categories : localCategories;
        setDisplayedCategories(allCats);
      }
    };
    fetchAll();
  }, [dispatch, categories.length]);

  const settings = homeSettings || {
    heroTitle: 'Welcome to Mouser Electronics',
    heroSlogan: 'Powering Innovation Worldwide',
    heroSubtitle: 'Your trusted source for electronic components, development boards, and cutting-edge technology solutions',
    heroButtonText: 'Start Shopping',
    heroBgImage: '',
    heroBgColor: 'from-blue-600 to-purple-700',
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would send to backend
    setNewsletterSubmitted(true);
    setEmail('');
    setTimeout(() => setNewsletterSubmitted(false), 3000);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Enhanced Hero Banner */}
      <motion.section
        className="relative overflow-hidden text-white py-20 px-4 sm:px-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Background */}
        {settings.heroBgImage && !bgImageError ? (
          <>
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url('${settings.heroBgImage}')` }}
              onError={() => setBgImageError(true)}
            />
            <div className="absolute inset-0 bg-black/50" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500" />
        )}

        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h1 className="text-5xl sm:text-6xl font-bold mb-4 leading-tight">
                {settings.heroTitle}
              </h1>
              {settings.heroSlogan && (
                <p className="text-xl sm:text-2xl font-semibold text-blue-200 mb-6">
                  {settings.heroSlogan}
                </p>
              )}
              <p className="text-lg sm:text-xl text-blue-100 mb-8 leading-relaxed">
                {settings.heroSubtitle}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <motion.button
                  onClick={() => navigate('/products')}
                  className="px-8 py-4 bg-white text-blue-600 font-bold rounded-lg hover:bg-gray-100 transition-all flex items-center justify-center gap-2 shadow-lg"
                  whileHover={{ scale: 1.05, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  {settings.heroButtonText}
                  <ChevronRight size={20} />
                </motion.button>
                <motion.button
                  onClick={() => navigate('/categories')}
                  className="px-8 py-4 border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-blue-600 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Browse Categories
                </motion.button>
              </div>

              {/* Trust indicators */}
              <div className="flex flex-wrap items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="text-green-400" size={16} />
                  <span>Free Shipping</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="text-green-400" size={16} />
                  <span>Secure Payment</span>
                </div>
                <div className="flex items-center gap-2">
                  <Headphones className="text-green-400" size={16} />
                  <span>24/7 Support</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="hidden lg:block"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="relative">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold mb-2">10K+</div>
                      <div className="text-blue-200">Products</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold mb-2">50K+</div>
                      <div className="text-blue-200">Customers</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold mb-2">99%</div>
                      <div className="text-blue-200">Satisfaction</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold mb-2">24/7</div>
                      <div className="text-blue-200">Support</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Why Choose Us Section */}
      <motion.section
        className="py-20 px-4 sm:px-6 bg-gray-50"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto max-w-6xl">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Mouser?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We're committed to providing the best electronic components and customer service in the industry.
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              {
                icon: Truck,
                title: "Free Shipping",
                description: "Free shipping on orders over $50. Fast delivery worldwide."
              },
              {
                icon: Shield,
                title: "Secure Payment",
                description: "100% secure payment processing with multiple payment options."
              },
              {
                icon: Award,
                title: "Quality Guarantee",
                description: "All products come with manufacturer warranty and quality assurance."
              },
              {
                icon: Headphones,
                title: "Expert Support",
                description: "24/7 technical support from our team of electronics experts."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow text-center"
                variants={itemVariants}
                whileHover={{ y: -5 }}
              >
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="text-blue-600" size={32} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Enhanced Categories Section */}
      {displayedCategories.length > 0 && (
        <motion.section
          className="py-20 px-4 sm:px-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="container mx-auto max-w-6xl">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Shop by Category</h2>
              <p className="text-xl text-gray-600">Find exactly what you need from our comprehensive range of electronic components</p>
            </motion.div>

            <motion.div
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {displayedCategories.slice(0, 12).map((cat, index) => (
                <motion.div
                  key={cat._id}
                  onClick={() => navigate(`/products?category=${cat._id}`)}
                  className="bg-white rounded-xl p-6 text-center cursor-pointer border border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all group"
                  variants={itemVariants}
                  whileHover={{ y: -8, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">
                    {cat.icon || ['📦', '🔌', '💡', '🔧', '📡', '🖥️'][index % 6]}
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base group-hover:text-blue-600 transition-colors">
                    {cat.name}
                  </h3>
                  <div className="text-xs text-gray-500 mt-1">
                    {Math.floor(Math.random() * 500) + 50} products
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              className="text-center mt-12"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <button
                onClick={() => navigate('/categories')}
                className="px-8 py-3 bg-primary text-gray-900 font-semibold rounded-lg hover:bg-primary-600 transition-colors inline-flex items-center gap-2"
              >
                View All Categories
                <ChevronRight size={20} />
              </button>
            </motion.div>
          </div>
        </motion.section>
      )}

      {/* Featured Products with Tabs */}
      <motion.section
        className="py-20 px-4 sm:px-6 bg-gray-50"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto max-w-6xl">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-2">
🔥 Trending Electronics
</h2>
<p className="text-gray-600 text-lg">
Most popular components engineers are buying right now.
</p>
            <p className="text-xl text-gray-600">Discover our most popular and trending electronic components</p>
          </motion.div>

        {/* Product Tabs + Products Layout */}
<div className="grid grid-cols-1 lg:grid-cols-4 gap-10 mt-12">

  {/* LEFT SIDEBAR */}
  <div className="lg:col-span-1">
    <div className="bg-white rounded-xl shadow-md border p-4 flex flex-col gap-3">

      <h3 className="text-lg font-semibold mb-2">Browse Products</h3>

      {[
        { id: 'featured', label: 'Featured', icon: Star },
        { id: 'new', label: 'New Arrivals', icon: Zap },
        { id: 'popular', label: 'Popular', icon: TrendingUp },
        { id: 'bestseller', label: 'Best Sellers', icon: Award }
      ].map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`w-full px-4 py-3 rounded-lg flex items-center gap-3 transition-all
          ${activeTab === tab.id
            ? 'bg-primary text-gray-900'
            : 'text-gray-600 hover:bg-gray-100'}`}
        >
          <tab.icon size={18} />
          {tab.label}
        </button>
      ))}

    </div>
  </div>

  {/* RIGHT PRODUCT GRID */}
  <div className="lg:col-span-3">

    {status === 'loading' ? (
      <Loader />
    ) : (
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <ProductGrid
          products={displayedProducts.length > 0 ? displayedProducts : items}
        />
      </motion.div>
    )}

  </div>

</div>

</div>

</motion.section>

{/* Stats Section */}
<motion.section
        className="py-20 px-4 sm:px-6 bg-primary text-gray-900"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto max-w-6xl">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              { number: '10,000+', label: 'Products', icon: Package },
              { number: '50,000+', label: 'Happy Customers', icon: Users },
              { number: '99.9%', label: 'Uptime', icon: CheckCircle },
              { number: '24/7', label: 'Support', icon: Headphones }
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="flex flex-col items-center"
                variants={itemVariants}
              >
                <stat.icon className="text-blue-200 mb-4" size={48} />
                <div className="text-4xl font-bold mb-2">{stat.number}</div>
                <div className="text-blue-200">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Testimonials Section */}
      <motion.section
        className="py-20 px-4 sm:px-6"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto max-w-6xl">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Customers Say</h2>
            <p className="text-xl text-gray-600">Don't just take our word for it - hear from our satisfied customers</p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              {
                name: "Sarah Johnson",
                role: "Electronics Engineer",
                content: "Mouser has everything I need for my projects. The selection is incredible and the delivery is always fast.",
                rating: 5,
                avatar: "SJ"
              },
              {
                name: "Mike Chen",
                role: "Maker & Inventor",
                content: "As a hobbyist, I love how easy it is to find components. The search and filtering make shopping a breeze.",
                rating: 5,
                avatar: "MC"
              },
              {
                name: "Dr. Emily Rodriguez",
                role: "Research Scientist",
                content: "The quality of components and technical support is outstanding. Mouser is my go-to for all research needs.",
                rating: 5,
                avatar: "ER"
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                variants={itemVariants}
                whileHover={{ y: -5 }}
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="text-yellow-400 fill-current" size={20} />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 italic">"{testimonial.content}"</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold mr-4">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-gray-500 text-sm">{testimonial.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Sponsors Section */}
      {sponsors && sponsors.length > 0 && (
        <motion.section
          className="py-20 px-4 sm:px-6 bg-gray-50"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="container mx-auto max-w-6xl">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Trusted Partners</h2>
              <p className="text-xl text-gray-600">We work with industry-leading manufacturers to bring you the best components</p>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {sponsors.map((s) => (
                <motion.div
                  key={s._id}
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                >
                  <SponsorCard sponsor={s} />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.section>
      )}

      {/* Newsletter Section */}
      <motion.section
        className="py-20 px-4 sm:px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Mail className="mx-auto mb-6" size={64} />
            <h2 className="text-4xl font-bold mb-4">Stay Updated</h2>
            <p className="text-xl mb-8 text-blue-100">
              Get the latest news about new products, special offers, and industry insights delivered to your inbox.
            </p>

            {newsletterSubmitted ? (
              <motion.div
                className="bg-green-500 text-white px-6 py-4 rounded-lg inline-block"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <CheckCircle className="inline mr-2" size={20} />
                Thank you for subscribing! We'll be in touch soon.
              </motion.div>
            ) : (
              <motion.form
                onSubmit={handleNewsletterSubmit}
                className="max-w-md mx-auto flex gap-4"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
                  required
                />
                <motion.button
                  type="submit"
                  className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Subscribe
                </motion.button>
              </motion.form>
            )}
          </motion.div>
        </div>
      </motion.section>

      {/* Final CTA Section */}
      <motion.section
        className="py-20 px-4 sm:px-6"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Ready to Start Your Project?</h2>
            <p className="text-xl text-gray-600 mb-8">
              Join thousands of engineers, makers, and innovators who trust Mouser for their electronic component needs.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                onClick={() => navigate('/register')}
                className="px-8 py-4 bg-primary text-gray-900 font-bold rounded-lg hover:bg-primary-600 transition-colors inline-flex items-center justify-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ShoppingCart size={20} />
                Create Account
              </motion.button>
              <motion.button
                onClick={() => navigate('/products')}
                className="px-8 py-4 border-2 border-blue-600 text-blue-600 font-bold rounded-lg hover:bg-blue-50 transition-colors inline-flex items-center justify-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Browse Products
                <ChevronRight size={20} />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default Home;