import mongoose from 'mongoose';

const competitorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    industry: { type: String, required: true, trim: true },
    marketShare: { type: Number, default: 0 },
    revenue: { type: String, default: '' },
    growth: { type: String, default: '' },
    category: { type: String, default: '' },
  },
  { timestamps: true }
);

competitorSchema.index({ name: 'text', industry: 'text' });

export default mongoose.model('Competitor', competitorSchema);
