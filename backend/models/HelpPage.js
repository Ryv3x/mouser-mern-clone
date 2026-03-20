import mongoose from 'mongoose';

const helpPageSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    content: { type: String, default: '' },
  },
  { timestamps: true }
);

const HelpPage = mongoose.model('HelpPage', helpPageSchema);
export default HelpPage;
