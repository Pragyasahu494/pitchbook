import mongoose from 'mongoose';

const pitchbookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    clientName: { type: String, required: true, trim: true },
    industry: { type: String, required: true, trim: true },
    region: { type: String, default: 'North America' },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client' },
    status: {
      type: String,
      default: 'draft',
      enum: ['draft', 'generating', 'ready', 'archived'],
    },
    currentStage: {
      type: String,
      default: 'Discovery',
      enum: ['Discovery', 'Analysis', 'Draft', 'Review', 'Approval', 'Execution'],
    },
    sectionsReady: { type: Number, default: 0 },
  },
  { timestamps: true }
);

pitchbookSchema.index({ title: 'text', clientName: 'text', industry: 'text' });

export default mongoose.model('Pitchbook', pitchbookSchema);
