import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'seller', 'admin'], default: 'user' },
    sellerApproved: { type: Boolean, default: false },
    banned: { type: Boolean, default: false },
    banReason: { type: String, default: '' },
    emailVerified: { type: Boolean, default: false },
    emailVerificationToken: { type: String, default: null },
    emailVerificationExpires: { type: Date, default: null },
    phone: { type: String, default: '' },
    address: { type: String, default: '' },
    description: { type: String, default: '' },
    logo: { type: String, default: '' },
    availableTime: { type: String, default: '' },
    bestProducts: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }
    ],
    bannerColor: { type: String, default: '#ffffff' },
    deliveryOptions: { type: [String], default: [] },
    featuredCategories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
    // Structured availability slots (e.g. { day: 'Mon-Fri', from: '09:00', to: '18:00' })
    availableTimes: [
      {
        dayRange: { type: String, default: '' },
        from: { type: String, default: '' },
        to: { type: String, default: '' },
      },
    ],
    preferences: {
      emailNotifications: { type: Boolean, default: true },
      orderUpdates: { type: Boolean, default: true },
      promotions: { type: Boolean, default: false },
      newsletter: { type: Boolean, default: false },
    },
    notifications: [
      {
        type: { type: String, default: 'info' },
        message: String,
        read: { type: Boolean, default: false },
        meta: mongoose.Schema.Types.Mixed,
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// hash password when it's new or modified
userSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return; // nothing to do
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);
export default User;
