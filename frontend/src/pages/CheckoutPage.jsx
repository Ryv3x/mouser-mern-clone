import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  MapPin,
  Lock,
  CheckCircle
} from 'lucide-react';

import api from '../services/api';
import { clearCart } from '../store/cartSlice';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart.items || []);
  const user = useSelector((state) => state.auth.user);

  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    promoCode: '',
    orderNotes: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const shipping = subtotal > 50 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const [promoDiscount, setPromoDiscount] = useState(0);
  const total = subtotal + shipping + tax - promoDiscount;

  const applyPromo = () => {
    const code = formData.promoCode.trim().toLowerCase();
    if (!code) return alert('Enter promo code');
    // simple demo promo codes
    if (code === 'SAVE10') {
      setPromoDiscount(Math.min(10, subtotal * 0.1));
      alert('Promo applied: 10% off');
    } else if (code === 'FREESHIP') {
      setPromoDiscount(shipping);
      alert('Promo applied: Free shipping');
    } else {
      alert('Invalid promo code');
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    try {
      // Allow "idk" as valid input for any field
      const isValidField = (value) => value && value.trim() !== '' && value.toLowerCase() !== 'idk';
      
      if (
        !isValidField(formData.fullName) ||
        !isValidField(formData.address) ||
        !isValidField(formData.city) ||
        !isValidField(formData.zipCode) ||
        !isValidField(formData.cardNumber)
      ) {
        alert('Please fill all required fields (or use "idk" if unknown)');
        return;
      }

      setLoading(true);

      const orderData = {
        items: cart,
        shippingAddress: {
          fullName: formData.fullName,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          phone: formData.phone,
        },
        shippingCost: shipping,
        tax,
        total,
      };

      const { data: order } = await api.post('/orders', orderData);

      // Send receipt to seller
      if (order && order.items && order.items.length > 0) {
        const sellerId = order.items[0].seller; // Assuming first item's seller
        await api.post('/admin/notify-user/' + sellerId, {
          title: 'New Order Received',
          message: `Order #${order._id} placed. Total: $${total.toFixed(2)}. Customer: ${formData.fullName}`,
        });
      }

      setOrderPlaced(true);

      dispatch(clearCart());

      setTimeout(() => {
        navigate('/');
      }, 3000);

    } catch (error) {
      console.error(error);
      alert('Order failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  if (orderPlaced) {
    return (
      <motion.div
        className="min-h-screen flex items-center justify-center bg-green-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="text-center">
          <CheckCircle size={80} className="text-green-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold">Order Placed Successfully</h1>
          <p className="text-gray-600 mt-2">
            Redirecting to homepage...
          </p>
        </div>
      </motion.div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">
            Cart is empty
          </h2>
          <button
            onClick={() => navigate('/')}
            className="bg-primary text-gray-900 px-6 py-2 rounded"
          >
            Go Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-gray-50 py-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="max-w-6xl mx-auto px-4 grid lg:grid-cols-3 gap-8">

        {/* FORM */}
        <form
          onSubmit={handlePlaceOrder}
          className="lg:col-span-2 bg-white p-6 rounded shadow"
        >

          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <MapPin size={20} />
            Shipping Info
          </h2>

          <div className="grid md:grid-cols-2 gap-4">

            <input
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleInputChange}
              className="border p-3 rounded"
              required
            />

            <input
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              className="border p-3 rounded"
              required
            />

            <input
              name="phone"
              placeholder="Phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="border p-3 rounded md:col-span-2"
            />

            <input
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleInputChange}
              className="border p-3 rounded md:col-span-2"
              required
            />

            <input
              name="city"
              placeholder="City"
              value={formData.city}
              onChange={handleInputChange}
              className="border p-3 rounded"
              required
            />

            <input
              name="state"
              placeholder="State"
              value={formData.state}
              onChange={handleInputChange}
              className="border p-3 rounded"
            />

            <input
              name="zipCode"
              placeholder="Zip Code"
              value={formData.zipCode}
              onChange={handleInputChange}
              className="border p-3 rounded"
              required
            />

            <div className="md:col-span-2 flex items-center gap-3">
              <input
                name="promoCode"
                placeholder="Promo code (e.g. SAVE10 or FREESHIP)"
                value={formData.promoCode}
                onChange={handleInputChange}
                className="border p-3 rounded flex-1"
              />
              <button type="button" onClick={applyPromo} className="bg-indigo-600 text-white px-4 py-2 rounded">Apply</button>
            </div>

            <textarea
              name="orderNotes"
              placeholder="Order notes (delivery instructions, etc.)"
              value={formData.orderNotes}
              onChange={handleInputChange}
              className="border p-3 rounded md:col-span-2 h-24"
            />

          </div>

          <h2 className="text-xl font-bold mt-6 mb-4 flex items-center gap-2">
            <Lock size={20} />
            Payment Info
          </h2>

          <input
            name="cardNumber"
            placeholder="Card Number"
            value={formData.cardNumber}
            onChange={handleInputChange}
            className="border p-3 rounded w-full mb-4"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-primary text-gray-900 w-full py-3 rounded flex items-center justify-center gap-2"
          >
            {loading ? 'Processing...' : 'Place Order'}
            <ArrowRight size={18} />
          </button>

        </form>


        {/* SUMMARY */}
        <div className="bg-white p-6 rounded shadow">

          <h2 className="text-xl font-bold mb-4">
            Order Summary
          </h2>

          {cart.map((item, i) => (
            <div key={i} className="flex justify-between mb-2">
              <span>
                {item.name} x {item.quantity}
              </span>
              <span>
                ${(item.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}

          <hr className="my-4"/>

          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>

          <div className="flex justify-between">
            <span>Shipping</span>
            <span>${shipping.toFixed(2)}</span>
          </div>

          <div className="flex justify-between">
            <span>Tax</span>
            <span>${tax.toFixed(2)}</span>
          </div>

          <div className="flex justify-between font-bold text-lg mt-3">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>

        </div>

      </div>
    </motion.div>
  );
};

export default CheckoutPage;