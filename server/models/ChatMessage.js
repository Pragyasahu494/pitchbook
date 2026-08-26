import mongoose from 'mongoose';

const chatMessageSchema = new mongoose.Schema(
  {
    pitchbook: { type: mongoose.Schema.Types.ObjectId, ref: 'Pitchbook', index: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    role: { type: String, required: true, enum: ['user', 'assistant', 'system'] },
    content: { type: String, required: true },
    model: { type: String, default: 'demo' },
  },
  { timestamps: true }
);

export default mongoose.model('ChatMessage', chatMessageSchema);
