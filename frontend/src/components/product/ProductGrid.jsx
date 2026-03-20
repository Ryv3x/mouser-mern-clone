import React from 'react';
import ProductCard from './ProductCard';

const ProductGrid = ({ products = [] }) => {
  const safeProducts = Array.isArray(products) ? products : [];
  
  if (safeProducts.length === 0) {
    return <div className="text-center text-gray-500 py-8">No products found</div>;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {safeProducts.map((p, idx) => (
        <ProductCard key={p._id || p.id} product={p} index={idx} />
      ))}
    </div>
  );
};

export default ProductGrid;
