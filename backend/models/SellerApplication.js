import mongoose from 'mongoose';

const sellerApplicationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    companyName: String,
    contactName: String,
    phone: String,
    email: String,
    website: String,
    vatNumber: String,
    gstNumber: String,
    address: String,
    productCategories: [String],
    sampleProductUrl: String,
    bio: String,
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  },
  { timestamps: true }
);

const SellerApplication = mongoose.model('SellerApplication', sellerApplicationSchema);
export default SellerApplication;
