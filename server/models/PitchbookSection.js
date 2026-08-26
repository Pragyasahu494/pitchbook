import mongoose from 'mongoose';

const pitchbookSectionSchema = new mongoose.Schema(
  {
    pitchbook: { type: mongoose.Schema.Types.ObjectId, ref: 'Pitchbook', required: true, index: true },
    sectionKey: { type: String, required: true, index: true },
    title: { type: String, required: true },
    content: { type: mongoose.Schema.Types.Mixed, default: '' },
    data: { type: mongoose.Schema.Types.Mixed, default: {} },
    status: { type: String, default: 'ready', enum: ['pending', 'generating', 'ready', 'error'] },
  },
  { timestamps: true }
);

pitchbookSectionSchema.index({ pitchbook: 1, sectionKey: 1 }, { unique: true });

export default mongoose.model('PitchbookSection', pitchbookSectionSchema);
