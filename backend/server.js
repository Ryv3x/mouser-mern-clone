import 'dotenv/config';
import express from 'express';
import path from 'path';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import sellerRoutes from './routes/sellerRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import sponsorRoutes from './routes/sponsorRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import userRoutes from './routes/userRoutes.js';
import publicRoutes from './routes/publicRoutes.js';
import homeRoutes from './routes/homeRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';


connectDB();

// seed default help pages if missing
const seedHelpPages = async () => {
  try {
    const HelpPage = (await import('./models/HelpPage.js')).default;
    const defaults = [
      { slug: 'help-center', title: 'Help Center', content: '<p>Welcome to the help center. Choose a topic from above.</p>' },
      { slug: 'contact-us', title: 'Contact Us', content: '<p>You can reach us at <a href="mailto:support@mouser.com">support@mouser.com</a></p>' },
      { slug: 'shipping-info', title: 'Shipping Info', content: '<p>Shipping information goes here.</p>' },
      { slug: 'returns', title: 'Returns', content: '<p>Return policy details go here.</p>' },
      { slug: 'faq', title: 'FAQ', content: '<p>Frequently asked questions will be listed here.</p>' },
    ];

    for (const def of defaults) {
      const exists = await HelpPage.findOne({ slug: def.slug });
      if (!exists) {
        await HelpPage.create(def);
      }
    }
  } catch (err) {
    console.error('Error seeding help pages', err);
  }
};

seedHelpPages();

const app = express();

app.use(cors());
app.use(express.json());

// Serve uploaded files (seller logos, product images, etc.)
app.use('/uploads', express.static(path.join(process.cwd(), 'backend', 'public', 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/seller', sellerRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/sponsors', sponsorRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/home-settings', homeRoutes);
app.use('/api/public', publicRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
