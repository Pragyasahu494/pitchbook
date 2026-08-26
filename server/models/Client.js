import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    industry: { type: String, required: true, trim: true },
    region: { type: String, default: 'North America' },
    revenue: { type: String, default: '' },
    employees: { type: Number, default: 0 },
    growth: { type: String, default: '' },
    relationshipManager: { type: String, default: '' },
    engagementObjective: { type: String, default: '' },
  },
  { timestamps: true }
);

clientSchema.index({ name: 'text', industry: 'text' });

export default mongoose.model('Client', clientSchema);
