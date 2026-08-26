import mongoose from 'mongoose';

const maTransactionSchema = new mongoose.Schema(
  {
    company: { type: String, required: true, trim: true },
    acquirer: { type: String, required: true, trim: true },
    dealSize: { type: String, default: '' },
    date: { type: String, default: '' },
    industry: { type: String, default: '' },
  },
  { timestamps: true }
);

maTransactionSchema.index({ company: 'text', acquirer: 'text', industry: 'text' });

export default mongoose.model('MATransaction', maTransactionSchema);
