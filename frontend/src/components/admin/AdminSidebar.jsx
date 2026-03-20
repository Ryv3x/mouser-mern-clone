import React from 'react';
import { NavLink } from 'react-router-dom';

const AdminSidebar = () => {
  return (
    <aside className="admin-sidebar w-48 bg-gray-100 p-4">
      <nav>
        <ul>
          <li>
            <NavLink to="/admin/dashboard">Dashboard</NavLink>
          </li>
          <li>
            <NavLink to="/admin/seller-applications">Seller Applications</NavLink>
          </li>
          <li>
            <NavLink to="/admin/sellers">Sellers</NavLink>
          </li>
          <li>
            <NavLink to="/admin/products">Products</NavLink>
          </li>
          <li>
            <NavLink to="/admin/categories">Categories</NavLink>
          </li>
          <li>
            <NavLink to="/admin/sponsors">Sponsors</NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
