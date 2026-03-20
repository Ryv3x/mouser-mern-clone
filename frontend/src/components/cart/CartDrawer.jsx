import React from 'react';

const CartDrawer = ({ open, onClose, children }) => {
  return (
    <div className={`${open ? 'block' : 'hidden'} cart-drawer fixed right-0 top-0 w-80 h-full bg-white shadow-lg`}> 
      <button onClick={onClose}>Close</button>
      {children}
    </div>
  );
};

export default CartDrawer;
