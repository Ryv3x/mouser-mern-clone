import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/User.js';
import connectDB from '../config/db.js';

dotenv.config();

const seedUsers = async () => {
  try {
    await connectDB();
    console.log('Connected to MongoDB ✅');

    // Clear existing users
    await User.deleteMany({});
    console.log('Cleared existing users');

    // Hash passwords
    const adminPassword = await bcryptjs.hash('admin123', 10);
    const sellerPassword = await bcryptjs.hash('seller123', 10);
    const userPassword = await bcryptjs.hash('user123', 10);

    // Create test users
    const users = [
      {
        name: 'Admin User',
        email: 'admin@mouser.com',
        password: adminPassword,
        role: 'admin',
        sellerApproved: true,
      },
      {
        name: 'Seller User',
        email: 'seller@mouser.com',
        password: sellerPassword,
        role: 'seller',
        sellerApproved: true,
      },
      {
        name: 'Regular User',
        email: 'user@mouser.com',
        password: userPassword,
        role: 'user',
        sellerApproved: false,
      },
    ];

    // Insert users
    const createdUsers = await User.insertMany(users);
    console.log(`✅ Successfully created ${createdUsers.length} test users:\n`);
    
    createdUsers.forEach((user, idx) => {
      console.log(`${idx + 1}. ${user.email} (${user.role})`);
    });

    console.log('\n📝 Login Credentials:');
    console.log('─────────────────────────────────────');
    console.log('Admin:  admin@mouser.com / admin123');
    console.log('Seller: seller@mouser.com / seller123');
    console.log('User:   user@mouser.com / user123');
    console.log('─────────────────────────────────────\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding users:', error.message);
    process.exit(1);
  }
};

seedUsers();
