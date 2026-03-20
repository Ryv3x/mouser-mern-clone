import React from 'react';

const SellerProductForm = ({ product, onSubmit }) => {
  return (
    <form onSubmit={onSubmit} className="seller-product-form">
      {/* Form fields will go here */}
      <button type="submit" className="btn btn-primary">
        {product ? 'Update' : 'Add'} Product
      </button>
    </form>
  );
};

export default SellerProductForm;
