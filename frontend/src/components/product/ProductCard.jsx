import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Eye } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addToCart } from '../../store/cartSlice';

const ProductCard = ({ product, index = 0 }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  return (
    <motion.div
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-2xl transition-shadow duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8 }}
    >
      {/* Image Container */}
      <motion.div
        className="relative w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden flex items-center justify-center"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.3 }}
      >
        {(() => {
          const firstImage = Array.isArray(product?.images)
            ? product.images[0]
            : product?.images
            ? String(product.images).split(',')[0]
            : null;
          return firstImage ? (
            <img src={firstImage} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <div className="text-gray-400 text-center">
              <div className="text-4xl">📦</div>
            </div>
          );
        })()}
        <motion.div
          className="absolute inset-0 bg-black bg-opacity-0 flex items-center justify-center gap-2 opacity-0 hover:opacity-100 transition-opacity duration-300"
          whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
        >
          <motion.button
            onClick={() => navigate(`/product/${product._id || product.id}`)}
            className="p-2 bg-white rounded-full text-blue-600 hover:bg-blue-50"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Eye size={20} />
          </motion.button>
          <motion.button
            onClick={() => dispatch(addToCart({ ...product, quantity: 1 }))}
            className="p-2 bg-primary rounded-full text-gray-900 hover:bg-primary-600"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <ShoppingCart size={20} />
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Content */}
      <motion.div
        className="p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
      >
        <h3 className="font-bold text-gray-800 line-clamp-2 mb-2 text-sm hover:text-blue-600 transition duration-300">
          {product?.name || 'Product'}
        </h3>
        {product?.manufacturer && (
          <p className="text-xs text-gray-500 mb-2">{product.manufacturer}</p>
        )}
        {product?.seller && (
          <p className="text-xs text-blue-600 mb-2 cursor-pointer hover:text-blue-800 hover:underline"
            onClick={() => navigate(`/seller/${product.seller._id || product.seller}`)}>
            🏪 {product.seller.name || 'Seller Store'}
          </p>
        )}
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-blue-600">
            ${product?.price || '0.00'}
          </span>
          {product?.stock > 0 ? (
            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
              In Stock
            </span>
          ) : (
            <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
              Out of Stock
            </span>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProductCard;
