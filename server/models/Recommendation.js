import mongoose from 'mongoose';

const recommendationSchema = new mongoose.Schema(
  {
    pitchbook: { type: mongoose.Schema.Types.ObjectId, ref: 'Pitchbook', index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    priority: { type: String, default: 'Medium', enum: ['High', 'Medium', 'Low'] },
    owner: { type: String, default: '' },
    expectedImpact: { type: String, default: 'Medium' },
    status: { type: String, default: 'Not started', enum: ['Not started', 'In progress', 'Completed', 'Reopened'] },
  },
  { timestamps: true }
);

export default mongoose.model('Recommendation', recommendationSchema);
