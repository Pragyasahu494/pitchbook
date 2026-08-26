import mongoose from 'mongoose';

const industrySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    marketSize: { type: String, default: '' },
    cagr: { type: String, default: '' },
    growth: { type: String, default: '' },
    description: { type: String, default: '' },
    trends: [{ name: String, impact: String, description: String, direction: String, confidence: Number }],
  },
  { timestamps: true }
);

industrySchema.index({ name: 'text' });

export default mongoose.model('Industry', industrySchema);
