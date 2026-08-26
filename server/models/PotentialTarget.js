import mongoose from 'mongoose';

const potentialTargetSchema = new mongoose.Schema(
  {
    company: { type: String, required: true, trim: true },
    industry: { type: String, required: true, trim: true },
    revenue: { type: String, default: '' },
    fitScore: { type: Number, default: 0, min: 0, max: 100 },
    strategicFit: { type: String, default: 'Moderate', enum: ['Excellent', 'Strong', 'Good', 'Moderate'] },
    recommendation: { type: String, default: 'Monitor' },
  },
  { timestamps: true }
);

potentialTargetSchema.index({ company: 'text', industry: 'text' });

export default mongoose.model('PotentialTarget', potentialTargetSchema);
