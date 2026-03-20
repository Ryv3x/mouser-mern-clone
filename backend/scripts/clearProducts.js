import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';
import connectDB from '../config/db.js';

dotenv.config();

const clearProducts = async () => {
  try {
    await connectDB();
    console.log('🗑️  Clearing all products...');
    
    const result = await Product.deleteMany({});
    console.log(`✅ Deleted ${result.deletedCount} products from the database`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error clearing products:', error.message);
    process.exit(1);
  }
};

clearProducts();
