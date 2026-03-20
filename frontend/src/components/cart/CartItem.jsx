import React from 'react';

const CartItem = ({ item, onRemove }) => {
  return (
    <div className="cart-item flex justify-between p-2 border-b">
      <span>{item.name}</span>
      <button onClick={() => onRemove(item.id)}>Remove</button>
    </div>
  );
};

export default CartItem;
