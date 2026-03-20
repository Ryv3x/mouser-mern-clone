import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/authSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Menu, X, Search, ChevronDown, User, LogOut, Settings } from 'lucide-react';
import NotificationBell from '../ui/NotificationBell';
import api from '../../services/api';

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const cart = useSelector((state) => state.cart?.items || []);
  const reduxCategories = useSelector((state) => state.admin?.categories || []);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [showCategories, setShowCategories] = useState(false);
  const [categories, setCategories] = useState([]);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const categoriesRef = useRef(null);
  const userMenuRef = useRef(null);

  // Fetch categories from API on component mount or sync from Redux
  useEffect(() => {
    // If we have categories in Redux, use them
    if (reduxCategories.length > 0) {
      setCategories(reduxCategories);
      return;
    }

    // Otherwise fetch from API
    const fetchCategories = async () => {
      try {
        const { data } = await api.get('/categories');
        setCategories(data || []);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
        setCategories([]);
      }
    };
    fetchCategories();
  }, [reduxCategories]);

  // Click outside detection for category and user menu dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Only close categories if it's open and click is outside
      if (showCategories && categoriesRef.current && !categoriesRef.current.contains(event.target)) {
        setShowCategories(false);
      }
      // Only close user menu if it's open and click is outside
      if (showUserMenu && userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    // Add listener on document
    document.addEventListener('mousedown', handleClickOutside);

    // Cleanup listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCategories, showUserMenu]);

  // Mutual exclusivity: close categories when user menu opens
  useEffect(() => {
    if (showUserMenu) {
      setShowCategories(false);
    }
  }, [showUserMenu]);

  // Mutual exclusivity: close user menu when categories opens
  useEffect(() => {
    if (showCategories) {
      setShowUserMenu(false);
    }
  }, [showCategories]);

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(`/search?q=${searchInput}`);
      setSearchInput('');
      setMobileMenuOpen(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.4, ease: 'easeOut' },
    },
  };

  return (
    <motion.header
      className="fixed w-full top-0 z-50 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 shadow-lg"
      initial={{ opacity: 0, y: -60 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="container mx-auto px-4 py-4">
        <motion.div
          className="flex justify-between items-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Logo & Branding */}
              <motion.div variants={itemVariants}>
            <Link to="/" className="flex items-center gap-2 text-white group">
              <motion.div
                className="w-9 h-9 bg-white rounded-lg flex items-center justify-center group-hover:scale-105"
                whileHover={{ scale: 1.05, rotate: 4 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <span className="text-blue-700 font-bold text-base">M</span>
              </motion.div>
              <span className="font-bold text-lg hidden sm:inline">Mouser</span>
            </Link>
          </motion.div>

          {/* Desktop Navigation - Center */}
          <motion.nav className="hidden lg:flex items-center gap-8" variants={containerVariants} initial="hidden" animate="visible">
            <motion.div variants={itemVariants}>
              <Link to="/" className="text-white hover:text-blue-100 font-medium transition duration-300">
                Home
              </Link>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Link to="/products" className="text-white hover:text-blue-100 font-medium transition duration-300">
                Products
              </Link>
            </motion.div>


            {/* Desktop categories dropdown */}
            <motion.div ref={categoriesRef} variants={itemVariants} className="relative">
              <button
                onClick={() => setShowCategories(!showCategories)}
                className="text-white hover:text-blue-100 font-medium transition duration-300 flex items-center gap-1"
              >
                Categories <ChevronDown size={16} />
              </button>
              <AnimatePresence>
                {showCategories && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-xl py-2 w-56"
                  >
                    {categories.map((cat) => (
                      <Link
                        key={cat.slug}
                        to={`/category/${cat.slug}`}
                        className="block px-4 py-2 text-gray-700 hover:bg-blue-100 transition"
                        onClick={() => setShowCategories(false)}
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Link to="/cart" className="relative text-white hover:text-blue-100 font-medium transition duration-300">
                <motion.div className="flex items-center gap-1" whileHover={{ scale: 1.1 }}>
                  <ShoppingCart size={20} />
                  {cart.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                      {cart.length}
                    </span>
                  )}
                </motion.div>
              </Link>
            </motion.div>
          </motion.nav>

          {/* Search Bar - Desktop */}
          <motion.form onSubmit={handleSearch} className="hidden md:flex items-center" variants={itemVariants}>
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Search products..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                // set explicit height so the adjacent button can mirror it
                className="px-4 py-2 h-10 rounded-l-lg focus:outline-none w-48 text-gray-700"
              />
              <motion.button
                type="submit"
                // match the input height; h-full was unreliable inside flex container
                className="px-3 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 transition h-10 flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
              >
                <Search size={18} />
              </motion.button>
            </div>
          </motion.form>

          {/* User Profile */}
          <motion.div className="flex items-center gap-2 sm:gap-3 justify-end" variants={containerVariants} initial="hidden" animate="visible">
            {user ? (
              <>
                <motion.div variants={itemVariants}>
                  <NotificationBell />
                </motion.div>
                {/* User Profile Dropdown */}
                <motion.div ref={userMenuRef} variants={itemVariants} className="relative">
                  <motion.button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="p-2 text-white hover:bg-white/10 rounded-lg transition -mt-px"
                    whileHover={{ scale: 1.1 }}
                  >
                    <User size={22} />
                  </motion.button>
                  <AnimatePresence>
                    {showUserMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl overflow-hidden z-50"
                      >
                        <div className="px-4 py-3 border-b border-gray-200">
                          <p className="font-semibold text-gray-900">{user.name}</p>
                          <p className="text-xs text-gray-600">{user.email}</p>
                        </div>
                        <div className="space-y-1 py-2">
                          <Link
                            to={user.role === 'seller' ? `/seller/${user._id}` : `/user/profile`}
                            className="block px-4 py-2 text-gray-700 hover:bg-blue-50 transition"
                            onClick={() => setShowUserMenu(false)}
                          >
                            View Profile
                          </Link>
                          {user.role === 'admin' && (
                            <Link
                              to="/admin/dashboard"
                              className="block px-4 py-2 text-gray-700 hover:bg-blue-50 transition"
                              onClick={() => setShowUserMenu(false)}
                            >
                              Admin Dashboard
                            </Link>
                          )}
                          {user.role === 'seller' && (
                            <Link
                              to="/seller/dashboard"
                              className="block px-4 py-2 text-gray-700 hover:bg-blue-50 transition"
                              onClick={() => setShowUserMenu(false)}
                            >
                              Seller Dashboard
                            </Link>
                          )}
                          {user.role && user.role !== 'seller' && user.role !== 'admin' && (
                            <Link
                              to="/apply"
                              className="block px-4 py-2 text-gray-700 hover:bg-blue-50 transition"
                              onClick={() => setShowUserMenu(false)}
                            >
                              Apply to Sell
                            </Link>
                          )}
                          <Link
                            to="/user/settings"
                            className="px-4 py-2 text-gray-700 hover:bg-blue-50 transition flex items-center gap-2"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <Settings size={16} /> Settings
                          </Link>
                          <button
                            onClick={() => {
                              handleLogout();
                              setShowUserMenu(false);
                            }}
                            className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition flex items-center gap-2 border-t border-gray-200"
                          >
                            <LogOut size={16} /> Logout
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </>
            ) : (
              <>
                <motion.div variants={itemVariants} className="hidden sm:block">
                  <Link
                    to="/login"
                    className="px-4 py-2 text-white border-2 border-white rounded-lg font-semibold hover:bg-white hover:text-blue-700 transition duration-300 text-sm"
                  >
                    Login
                  </Link>
                </motion.div>
                <motion.div variants={itemVariants} className="hidden sm:block">
                  <Link
                    to="/register"
                    className="px-4 py-2 bg-white text-blue-700 rounded-lg font-semibold hover:bg-blue-100 transition duration-300 text-sm"
                  >
                    Sign Up
                  </Link>
                </motion.div>
              </>
            )}

            {/* Mobile Menu Button */}
            <motion.button
              variants={itemVariants}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden text-white"
              whileHover={{ scale: 1.1 }}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.button>
          </motion.div>
          </motion.div>


        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="lg:hidden mt-4 space-y-3"
            >
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="flex-1 px-4 py-2 rounded-lg focus:outline-none text-gray-700"
                />
                <motion.button
                  type="submit"
                  className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  whileHover={{ scale: 1.05 }}
                >
                  <Search size={18} />
                </motion.button>
              </form>

              {/* Mobile Navigation Links */}
              <motion.div className="space-y-2" variants={containerVariants} initial="hidden" animate="visible">
                <motion.div variants={itemVariants}>
                  <Link
                    to="/"
                    className="block px-4 py-2 text-white hover:bg-blue-500 rounded-lg transition"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Home
                  </Link>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Link
                    to="/products"
                    className="block px-4 py-2 text-white hover:bg-blue-500 rounded-lg transition"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Products
                  </Link>
                </motion.div>


                {/* Mobile Categories */}
                <motion.div variants={itemVariants}>
                  <button
                    onClick={() => setShowCategories(!showCategories)}
                    className="w-full text-left px-4 py-2 text-white hover:bg-blue-500 rounded-lg transition flex items-center justify-between"
                  >
                    Categories <ChevronDown size={16} />
                  </button>
                  <AnimatePresence>
                    {showCategories && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="ml-4 mt-2 space-y-2"
                      >
                        {categories.map((cat) => (
                          <Link
                            key={cat.slug}
                            to={`/category/${cat.slug}`}
                            className="block px-4 py-2 text-blue-100 hover:text-white transition"
                            onClick={() => {
                              setMobileMenuOpen(false);
                              setShowCategories(false);
                            }}
                          >
                            → {cat.name}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                <motion.div variants={itemVariants}>
                    <Link
                      to="/cart"
                      className="px-4 py-2 text-white hover:bg-blue-500 rounded-lg transition flex items-center gap-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                    <ShoppingCart size={18} />
                    Cart {cart.length > 0 && `(${cart.length})`}
                  </Link>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Link
                    to="/sponsors"
                    className="block px-4 py-2 text-white hover:bg-blue-500 rounded-lg transition"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sponsors
                  </Link>
                </motion.div>

                {user ? (
                  <>
                    <motion.div variants={itemVariants} className="border-t border-blue-500 pt-2 mt-2">
                      <p className="px-4 py-2 text-blue-100 font-semibold">Hi, {user.name}</p>
                    </motion.div>
                    {user.role === 'admin' && (
                      <motion.div variants={itemVariants}>
                        <Link
                          to="/admin/dashboard"
                          className="block px-4 py-2 bg-yellow-400 text-blue-800 rounded-lg font-semibold transition"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Admin Dashboard
                        </Link>
                      </motion.div>
                    )}
                    {user.role === 'seller' && (
                      <motion.div variants={itemVariants}>
                        <Link
                          to="/seller/dashboard"
                          className="block px-4 py-2 bg-green-400 text-blue-800 rounded-lg font-semibold transition"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Seller Dashboard
                        </Link>
                      </motion.div>
                    )}
                    {user.role && user.role !== 'seller' && user.role !== 'admin' && (
                      <motion.div variants={itemVariants}>
                        <Link
                          to="/apply"
                          className="block px-4 py-2 bg-white text-blue-700 rounded-lg font-semibold transition"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Apply to Sell
                        </Link>
                      </motion.div>
                    )}
                    <motion.div variants={itemVariants}>
                      <Link
                        to="/user/settings"
                        className="block px-4 py-2 text-blue-100 hover:bg-blue-500 rounded-lg transition"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Settings
                      </Link>
                    </motion.div>
                    <motion.div variants={itemVariants}>
                      <button
                        onClick={() => {
                          handleLogout();
                          setMobileMenuOpen(false);
                        }}
                        className="w-full px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition"
                      >
                        Logout
                      </button>
                    </motion.div>
                  </>
                ) : (
                  <>
                    <motion.div variants={itemVariants}>
                      <Link
                        to="/login"
                        className="block px-4 py-2 text-white hover:bg-blue-500 rounded-lg transition"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Login
                      </Link>
                    </motion.div>
                    <motion.div variants={itemVariants}>
                      <Link
                        to="/register"
                        className="block px-4 py-2 bg-white text-blue-700 rounded-lg transition"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Sign Up
                      </Link>
                    </motion.div>
                  </>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};

export default Header;

