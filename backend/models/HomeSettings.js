import mongoose from 'mongoose';

const homeSettingsSchema = new mongoose.Schema(
  {
    heroTitle: { type: String, default: 'Welcome to Mouser' },
    heroSlogan: { type: String, default: '' },
    heroSubtitle: { type: String, default: 'Your trusted source for electronic components and gadgets' },
    heroButtonText: { type: String, default: 'Shop Now' },
    heroBgImage: { type: String, default: '' },
    heroBgColor: { type: String, default: 'from-blue-600 to-blue-700' },
    featuredProductIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    displayedCategoryIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
  },
  { timestamps: true }
);

const HomeSettings = mongoose.model('HomeSettings', homeSettingsSchema);
export default HomeSettings;
