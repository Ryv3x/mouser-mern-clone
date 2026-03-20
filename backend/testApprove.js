import mongoose from 'mongoose';
import SellerApplication from './models/SellerApplication.js';
import User from './models/User.js';
import dotenv from 'dotenv';

dotenv.config();

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('connected');
    const app = await SellerApplication.findOne();
    console.log('sample app', app);
    if (app) {
      app.status = 'approved';
      await app.save();
      const user = await User.findById(app.user);
      console.log('associated user', user);
      if (user) {
        user.role = 'seller';
        user.sellerApproved = true;
        user.notifications = user.notifications || [];
        user.notifications.unshift({
          type: 'success', message: 'test', read: false, meta: { application: app._id }
        });
        await user.save();
        console.log('user after save', user);
      }
    }
  } catch(err) {
    console.error('script error', err);
  } finally {
    mongoose.connection.close();
  }
})();
