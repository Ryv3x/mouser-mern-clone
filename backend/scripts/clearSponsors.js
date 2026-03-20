import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import Sponsor from '../models/Sponsor.js';

dotenv.config();

const clear = async () => {
  try {
    await connectDB();
    const res = await Sponsor.deleteMany({});
    console.log(`Deleted ${res.deletedCount} sponsors`);
    process.exit(0);
  } catch (err) {
    console.error('Error clearing sponsors:', err);
    process.exit(1);
  }
};

clear();
