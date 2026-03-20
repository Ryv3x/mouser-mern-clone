# Mouser MERN Clone - Complete Setup Guide

## 🚀 Getting Started

### Prerequisites
- Node.js v16+ installed
- MongoDB Atlas account or local MongoDB running
- Git

---

## 📦 Backend Setup

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Create `.env` File
Create `backend/.env` with:
```
MONGO_URI=mongodb://localhost:27017/mouser-clone
# OR for MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/mouser-clone

JWT_SECRET=your-secret-key-change-this
NODE_ENV=development
PORT=5000
```

### 3. Seed Sample Products
```bash
cd backend
node scripts/seedProducts.js
```

You should see:
```
✅ Successfully inserted 10 sample products
```

### 4. Start Backend Server
```bash
npm run dev
```

Server runs at `http://localhost:5000`

---

## 🎨 Frontend Setup

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Create `.env.local` File
Create `frontend/.env.local` with:
```
VITE_API_URL=http://localhost:5000/api
```

### 3. Start Frontend Dev Server
```bash
npm run dev
```

Frontend runs at `http://localhost:5173`

---

## 🔐 Authentication & Admin Access

### Default Test Accounts

#### Admin Account
- **Email**: admin@mouser.com
- **Password**: admin123

#### Seller Account
- **Email**: seller@mouser.com
- **Password**: seller123

#### Regular User Account
- **Email**: user@mouser.com
- **Password**: user123

### How to Register
1. Go to `http://localhost:5173/register`
2. Fill in: Name, Email, Password, Confirm Password
3. Click "Register"
4. You'll be logged in automatically

### How to Access Admin Panel

**Method 1: Direct Link**
1. Login with admin account (admin@mouser.com)
2. Go to: `http://localhost:5173/admin/dashboard`
3. You'll see admin stats and options

**Method 2: Using Header**
1. Login as admin
2. Look at top-right corner of header
3. Click yellow "Admin" button
4. Opens dropdown menu with links:
   - Admin Dashboard
   - Seller Applications
   - Products Management
   - Sponsors Management

### Admin Features Available
- **Dashboard**: View stats on sellers, products, sponsors
- **Seller Applications**: Review and approve new sellers
- **Products Management**: View all products
- **Sponsors Management**: Add/edit/delete sponsors

---

## 🛒 Product Management (Seller)

### How to Become a Seller

**Option 1: Using Default Seller Account**
- Email: seller@mouser.com
- Password: seller123
- Already approved seller

**Option 2: Create New Seller Account**
1. Register as normal user
2. Apply for seller from profile
3. Admin must approve (in /admin/seller-applications)
4. Once approved, you get seller dashboard

### Add Products as Seller
1. Login as seller
2. Go to: `http://localhost:5173/seller/products/add`
3. Fill in:
   - Product Name
   - Description
   - Price
   - Category
   - Manufacturer
   - Stock quantity
   - Images (URL)
4. Click "Add Product"

### View Your Products
1. Go to: `http://localhost:5173/seller/products`
2. See all your listed products
3. Click product to edit details
4. Manage inventory and pricing

### Seller Dashboard
- Access: `http://localhost:5173/seller/dashboard`
- View stats:
  - Total Products
  - Total Orders
  - Revenue Earned
  - Average Rating

---

## 🛍️ Shopping Features

### Search Products
1. Use search bar in header (top-right)
2. Type product name or keyword
3. See filtered results with:
   - Price filter
   - Manufacturer filter
   - Sort options

### Browse Categories
1. Click "Categories" in header
2. Select a category to see products
3. Use side filters to refine search

### View Product Details
1. Click any product card
2. See:
   - Full images gallery
   - Complete specifications
   - Price and stock status
   - Customer reviews (if any)
3. Add to cart and proceed to checkout

### Shopping Cart Features
- Add/remove items
- Adjust quantities
- Free shipping on orders over $50
- See real-time totals with tax

### Checkout
1. Click "Cart" in header
2. Review items and totals
3. Click "Proceed to Checkout"
4. Enter shipping address
5. Enter payment details
6. Click "Place Order"
7. See confirmation message

---

## 📧 Newsletter Subscription

- Available in footer
- Enter your email to subscribe
- Get latest product updates and deals

---

## 💬 Live Chat Feature

- Floating chat button in bottom-right corner
- Click to open chat window
- Available 24/7 for support

---

## 🗂️ Project Structure

```
mouser-mern-clone/
├── backend/
│   ├── config/          # Database config
│   ├── controllers/      # Business logic
│   ├── middleware/       # Auth, error handling
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API endpoints
│   ├── scripts/         # Seed scripts
│   ├── server.js        # Express app
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   │   ├── layout/  # Header, Footer
│   │   │   ├── product/ # ProductCard, ProductGrid
│   │   │   └── common/  # Shared components
│   │   ├── pages/       # Page components
│   │   ├── routes/      # Route definitions
│   │   ├── store/       # Redux slices
│   │   ├── services/    # API calls (api.js)
│   │   └── App.jsx
│   └── package.json
```

---

## 🐛 Troubleshooting

### Login shows 404 error
1. Make sure backend is running: `npm run dev` in backend folder
2. Check `VITE_API_URL` in frontend `.env.local`
3. Verify MongoDB connection in backend logs

### No products showing
1. Run seed script: `node scripts/seedProducts.js` in backend
2. Check MongoDB connection
3. Restart both servers

### Header categories not loading
1. Backend must be running
2. Check console errors (F12 -> Console)
3. Clear browser cache (Ctrl+Shift+Delete)

### Admin panel access denied
1. Make sure you're logged in as admin
2. Check user role in browser DevTools: `localStorage.getItem('auth')`
3. Ensure `role` is `'admin'` in the JSON

---

## 📝 API Endpoints (Backend)

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product details
- `POST /api/products` - Create product (seller)
- `PUT /api/products/:id` - Update product (seller)
- `DELETE /api/products/:id` - Delete product (seller)

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:slug` - Get category products

### Admin
- `GET /api/admin/seller-applications` - View seller apps
- `POST /api/admin/approve-seller/:id` - Approve seller
- `GET /api/admin/sponsorslist` - View sponsors
- `POST /api/admin/sponsors` - Add sponsor

### Seller
- `GET /api/seller/products` - Your products
- `POST /api/seller/products` - Add product
- `PUT /api/seller/products/:id` - Edit product

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get your orders

---

## 🎯 Next Steps

1. ✅ Start backend: `npm run dev` (in backend folder)
2. ✅ Start frontend: `npm run dev` (in frontend folder)
3. ✅ Open http://localhost:5173
4. ✅ Login with test account
5. ✅ Browse products and test features

---

## 📞 Support

For issues or questions:
1. Check this documentation
2. Look at browser console (F12)
3. Check backend server logs
4. Use floating chat button on site

---

**Happy shopping on Mouser Clone! 🎉**
