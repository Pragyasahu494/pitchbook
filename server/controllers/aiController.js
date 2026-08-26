import mongoose from 'mongoose';
import ChatMessage from '../models/ChatMessage.js';
import Pitchbook from '../models/Pitchbook.js';
import { answerQuestion } from '../services/aiService.js';
import { isDemoMode } from '../services/aiService.js';

export async function chat(req, res, next) {
  try {
    const { question, pitchbookId } = req.body;
    if (!question || !question.trim()) {
      return res.status(400).json({ success: false, message: 'Question is required' });
    }
    if (!pitchbookId || !mongoose.isValidObjectId(pitchbookId)) {
      return res.status(400).json({ success: false, message: 'A valid pitchbookId is required' });
    }
    const pitchbook = await Pitchbook.findById(pitchbookId);
    if (!pitchbook) {
      return res.status(404).json({ success: false, message: 'Pitchbook not found' });
    }

    const userMsg = await ChatMessage.create({
      pitchbook: pitchbookId,
      user: req.user?._id,
      role: 'user',
      content: question,
      model: isDemoMode() ? 'demo' : (process.env.AI_MODEL || 'gpt-4o'),
    });

    const answer = await answerQuestion({ question, pitchbookId, user: req.user });

    const aiMsg = await ChatMessage.create({
      pitchbook: pitchbookId,
      user: req.user?._id,
      role: 'assistant',
      content: answer,
      model: isDemoMode() ? 'demo' : (process.env.AI_MODEL || 'gpt-4o'),
    });

    res.json({ success: true, data: { userMessage: userMsg, assistantMessage: aiMsg } });
  } catch (err) {
    next(err);
  }
}

export async function getHistory(req, res, next) {
  try {
    const { pitchbookId } = req.params;
    if (!mongoose.isValidObjectId(pitchbookId)) {
      return res.status(400).json({ success: false, message: 'Invalid pitchbook id' });
    }
    const messages = await ChatMessage.find({ pitchbook: pitchbookId }).sort({ createdAt: 1 }).lean();
    res.json({ success: true, data: messages });
  } catch (err) {
    next(err);
  }
}

export async function clearHistory(req, res, next) {
  try {
    const { pitchbookId } = req.params;
    if (!mongoose.isValidObjectId(pitchbookId)) {
      return res.status(400).json({ success: false, message: 'Invalid pitchbook id' });
    }
    await ChatMessage.deleteMany({ pitchbook: pitchbookId });
    res.json({ success: true, message: 'Chat history cleared' });
  } catch (err) {
    next(err);
  }
}
