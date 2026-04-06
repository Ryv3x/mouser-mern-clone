import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    manufacturer: String,
    manufacturerPartNumber: String,
    description: String,
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    subcategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    price: { type: Number, required: true },
    // Seller-specific minimum quantity and optional seller-set price
    minQuantity: { type: Number, default: 1 },
    sellerPrice: { type: Number },
    stock: { type: Number, default: 0 },
    images: [String],
    datasheetUrl: String,
    specifications: mongoose.Schema.Types.Mixed,
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    active: { type: Boolean, default: false },
    reviewStatus: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    reviewNote: { type: String },
  },
  { timestamps: true }
);

const Product = mongoose.model('Product', productSchema);
export default Product;
