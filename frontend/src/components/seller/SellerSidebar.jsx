import React from 'react';
import { NavLink } from 'react-router-dom';

const SellerSidebar = () => {
  return (
    <aside className="seller-sidebar w-48 bg-gray-100 p-4">
      <nav>
        <ul>
          <li>
            <NavLink to="/seller/dashboard">Dashboard</NavLink>
          </li>
          <li>
            <NavLink to="/seller/products">Products</NavLink>
          </li>
          <li>
            <NavLink to="/seller/products/add">Add Product</NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default SellerSidebar;
