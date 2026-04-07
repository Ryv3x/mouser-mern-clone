import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, CheckCircle } from 'lucide-react';
import { removeFromCart, updateQuantity } from '../store/cartSlice';
import Button from '../components/ui/Button';

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart.items || []);
  const user = useSelector((state) => state.auth.user);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
    exit: { opacity: 0, x: 20 },
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity || 0), 0);
  const shipping = subtotal > 50 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

if (cart.length === 0) {
  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="container mx-auto px-4">

        <motion.div
          className="flex flex-col items-center justify-center py-16"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >

          <motion.div variants={itemVariants} className="mb-6">
            <ShoppingBag size={64} className="text-gray-400" />
          </motion.div>

          <motion.h2
            variants={itemVariants}
            className="text-3xl font-bold text-gray-900 mb-3"
          >
            Your cart is empty
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="text-gray-600 mb-8 text-center"
          >
            Looks like you haven't added anything yet.
            Start exploring our products!
          </motion.p>

          <motion.button
            variants={itemVariants}
            onClick={() => navigate("/")}
            className="bg-primary text-gray-900 px-8 py-3 rounded-lg font-semibold flex items-center gap-2 hover:bg-primary-600 transition"
            whileHover={{ scale: 1.05 }}
          >
            Continue Shopping
            <ArrowRight size={20} />
          </motion.button>

        </motion.div>

      </div>
    </motion.div>
  );
}

  return (
    <motion.div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="container mx-auto px-4">
        <motion.div className="grid md:grid-cols-3 gap-8" variants={containerVariants} initial="hidden" animate="visible">
          <motion.div className="md:col-span-2 bg-white rounded-xl shadow p-6" variants={itemVariants}>
            <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
            <div className="space-y-4">
              {cart.map((item) => (
                <motion.div key={item._id} className="flex items-center gap-4 border-b pb-4" variants={itemVariants}>
                  <img src={item.images?.[0] || item.imageUrl || 'https://via.placeholder.com/80'} alt={item.name} className="w-20 h-20 object-cover rounded" />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-600">{item.manufacturer}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-blue-600">${(item.price || 0).toFixed(2)}</p>
                        <p className="text-sm text-gray-600">Subtotal: ${(item.price * item.quantity || 0).toFixed(2)}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-3">
                      <Button variant="secondary" className="px-3 py-1" onClick={() => dispatch(updateQuantity({ _id: item._id, quantity: Math.max(1, item.quantity - 1) }))}>-</Button>
                      <span className="px-4">{item.quantity}</span>
                      <Button variant="secondary" className="px-3 py-1" onClick={() => dispatch(updateQuantity({ _id: item._id, quantity: item.quantity + 1 }))}>+</Button>
                      <Button variant="danger" className="ml-4" onClick={() => dispatch(removeFromCart(item._id))}>Remove</Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div className="bg-white rounded-xl shadow p-6" variants={itemVariants}>
            <h3 className="text-xl font-bold mb-4">Order Summary</h3>
            <div className="space-y-2 text-gray-700">
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
              <div className="flex justify-between font-bold text-lg mt-2">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <Button variant="primary" className="w-full mt-6" onClick={() => navigate('/checkout')}>Proceed to Checkout</Button>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default CartPage;