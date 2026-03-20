import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Home from '../pages/Home';
import Products from '../pages/Products';
import CategoryPage from '../pages/CategoryPage';
import ProductDetails from '../pages/ProductDetails';
import SearchPage from '../pages/SearchPage';
import CartPage from '../pages/CartPage';
import CheckoutPage from '../pages/CheckoutPage';
import Login from '../pages/Login';
import Register from '../pages/Register';
import VerifyEmail from '../pages/VerifyEmail';
import SellerDashboard from '../pages/SellerDashboard';
import SellerProducts from '../pages/SellerProducts';
import SellerAddProduct from '../pages/SellerAddProduct';
import SellerEditProduct from '../pages/SellerEditProduct';
import SellerProfile from '../pages/SellerProfile';
import AdminDashboard from '../pages/AdminDashboard';
import AdminSellerApplications from '../pages/AdminSellerApplications';
import AdminProducts from '../pages/AdminProducts';
import AdminSponsors from '../pages/AdminSponsors';
import AdminSellers from '../pages/AdminSellers';
import AdminCategories from '../pages/AdminCategories';
import AdminHelpPages from '../pages/AdminHelpPages';
import AdminHomeSettings from '../pages/AdminHomeSettings';
import ApplySeller from '../pages/ApplySeller';
import InfoPage from '../pages/InfoPage';
import Sponsors from '../pages/Sponsors';
import AllManufacturers from '../pages/AllManufacturers';
import UserProfile from '../pages/UserProfile';
import UserSettings from '../pages/UserSettings';
import NotFound from '../pages/NotFound';
import AnimatedWrapper from '../components/layout/AnimatedWrapper';
import ProtectedRoute from './ProtectedRoute';
import RoleRoute from './RoleRoute';

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<AnimatedWrapper><Home /></AnimatedWrapper>} />
    <Route path="/products" element={<AnimatedWrapper><Products /></AnimatedWrapper>} />
    <Route path="/info/:slug" element={<AnimatedWrapper><InfoPage /></AnimatedWrapper>} />
    <Route path="/category/:categorySlug" element={<AnimatedWrapper><CategoryPage /></AnimatedWrapper>} />
    <Route path="/category/:categorySlug/:subcategorySlug" element={<AnimatedWrapper><CategoryPage /></AnimatedWrapper>} />
    <Route path="/product/:productId" element={<AnimatedWrapper><ProductDetails /></AnimatedWrapper>} />
    <Route path="/seller/:sellerId" element={<AnimatedWrapper><SellerProfile /></AnimatedWrapper>} />
    <Route path="/manufacturers" element={<AnimatedWrapper><AllManufacturers /></AnimatedWrapper>} />
    <Route path="/sponsors" element={<AnimatedWrapper><Sponsors /></AnimatedWrapper>} />
    <Route path="/search" element={<AnimatedWrapper><SearchPage /></AnimatedWrapper>} />
    <Route path="/cart" element={<AnimatedWrapper><CartPage /></AnimatedWrapper>} />
    <Route path="/checkout" element={<ProtectedRoute><AnimatedWrapper><CheckoutPage /></AnimatedWrapper></ProtectedRoute>} />
    <Route path="/user/profile" element={<ProtectedRoute><AnimatedWrapper><UserProfile /></AnimatedWrapper></ProtectedRoute>} />
    <Route path="/user/settings" element={<ProtectedRoute><AnimatedWrapper><UserSettings /></AnimatedWrapper></ProtectedRoute>} />
    <Route path="/login" element={<AnimatedWrapper><Login /></AnimatedWrapper>} />
    <Route path="/register" element={<AnimatedWrapper><Register /></AnimatedWrapper>} />
    <Route path="/verify-email/:token" element={<AnimatedWrapper><VerifyEmail /></AnimatedWrapper>} />

    <Route path="/seller/dashboard" element={
      <RoleRoute role="seller">
        <AnimatedWrapper><SellerDashboard /></AnimatedWrapper>
      </RoleRoute>
    } />

    <Route path="/seller/products" element={
      <RoleRoute role="seller">
        <AnimatedWrapper><SellerProducts /></AnimatedWrapper>
      </RoleRoute>
    } />

    <Route path="/seller/products/add" element={
      <RoleRoute role="seller">
        <AnimatedWrapper><SellerAddProduct /></AnimatedWrapper>
      </RoleRoute>
    } />

    <Route path="/seller/products/edit/:id" element={
      <RoleRoute role="seller">
        <AnimatedWrapper><SellerEditProduct /></AnimatedWrapper>
      </RoleRoute>
    } />

    <Route path="/admin/dashboard" element={
      <RoleRoute role="admin">
        <AnimatedWrapper><AdminDashboard /></AnimatedWrapper>
      </RoleRoute>
    } />

    <Route path="/admin/seller-applications" element={
      <RoleRoute role="admin">
        <AnimatedWrapper><AdminSellerApplications /></AnimatedWrapper>
      </RoleRoute>
    } />

    <Route path="/admin/products" element={
      <RoleRoute role="admin">
        <AnimatedWrapper><AdminProducts /></AnimatedWrapper>
      </RoleRoute>
    } />

    <Route path="/admin/sponsors" element={
      <RoleRoute role="admin">
        <AnimatedWrapper><AdminSponsors /></AnimatedWrapper>
      </RoleRoute>
    } />

    <Route path="/admin/sellers" element={
      <RoleRoute role="admin">
        <AnimatedWrapper><AdminSellers /></AnimatedWrapper>
      </RoleRoute>
    } />

    <Route path="/admin/categories" element={
      <RoleRoute role="admin">
        <AnimatedWrapper><AdminCategories /></AnimatedWrapper>
      </RoleRoute>
    } />

    <Route path="/admin/help-pages" element={
      <RoleRoute role="admin">
        <AnimatedWrapper><AdminHelpPages /></AnimatedWrapper>
      </RoleRoute>
    } />

    <Route path="/admin/home-settings" element={
      <RoleRoute role="admin">
        <AnimatedWrapper><AdminHomeSettings /></AnimatedWrapper>
      </RoleRoute>
    } />

    <Route path="/apply" element={<ProtectedRoute><AnimatedWrapper><ApplySeller /></AnimatedWrapper></ProtectedRoute>} />

    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default AppRoutes;