import mongoose from 'mongoose';
import Pitchbook from '../models/Pitchbook.js';
import PitchbookSection from '../models/PitchbookSection.js';
import Recommendation from '../models/Recommendation.js';
import { generateFullPitchbook, regenerateSection, SECTION_KEYS, SECTION_TITLES } from '../services/pitchbookService.js';

export async function listPitchbooks(req, res, next) {
  try {
    const filter = {};
    if (req.user) filter.$or = [{ owner: req.user._id }, { owner: { $exists: false } }, { owner: null }];
    const pitchbooks = await Pitchbook.find(filter).sort({ updatedAt: -1 }).lean();
    res.json({ success: true, data: pitchbooks });
  } catch (err) {
    next(err);
  }
}

export async function getPitchbook(req, res, next) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid pitchbook id' });
    }
    const pitchbook = await Pitchbook.findById(id).lean();
    if (!pitchbook) {
      return res.status(404).json({ success: false, message: 'Pitchbook not found' });
    }
    const sections = await PitchbookSection.find({ pitchbook: id }).lean();
    const recommendations = await Recommendation.find({ pitchbook: id }).lean();
    res.json({ success: true, data: { ...pitchbook, sections, recommendations } });
  } catch (err) {
    next(err);
  }
}

export async function createPitchbook(req, res, next) {
  try {
    const { title, clientName, industry, region, client } = req.body;
    if (!title || !clientName || !industry) {
      return res.status(400).json({ success: false, message: 'Title, clientName, and industry are required' });
    }
    const pitchbook = await Pitchbook.create({
      title,
      clientName,
      industry,
      region: region || 'North America',
      owner: req.user?._id,
      client: client || undefined,
    });
    res.status(201).json({ success: true, data: pitchbook });
  } catch (err) {
    next(err);
  }
}

export async function updatePitchbook(req, res, next) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid pitchbook id' });
    }
    const updates = (({ title, clientName, industry, region, status, currentStage }) => ({ title, clientName, industry, region, status, currentStage }))(req.body);
    Object.keys(updates).forEach((k) => updates[k] === undefined && delete updates[k]);
    const pitchbook = await Pitchbook.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
    if (!pitchbook) {
      return res.status(404).json({ success: false, message: 'Pitchbook not found' });
    }
    res.json({ success: true, data: pitchbook });
  } catch (err) {
    next(err);
  }
}

export async function deletePitchbook(req, res, next) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid pitchbook id' });
    }
    const pitchbook = await Pitchbook.findByIdAndDelete(id);
    if (!pitchbook) {
      return res.status(404).json({ success: false, message: 'Pitchbook not found' });
    }
    await PitchbookSection.deleteMany({ pitchbook: id });
    await Recommendation.deleteMany({ pitchbook: id });
    res.json({ success: true, message: 'Pitchbook deleted' });
  } catch (err) {
    next(err);
  }
}

export async function generatePitchbook(req, res, next) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid pitchbook id' });
    }
    const result = await generateFullPitchbook(id);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

export async function generateSectionController(req, res, next) {
  try {
    const { id, sectionKey } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid pitchbook id' });
    }
    if (!SECTION_KEYS.includes(sectionKey)) {
      return res.status(400).json({ success: false, message: `Invalid section key: ${sectionKey}` });
    }
    const section = await regenerateSection(id, sectionKey);
    res.json({ success: true, data: section });
  } catch (err) {
    next(err);
  }
}

export async function listRecommendations(req, res, next) {
  try {
    const filter = {};
    if (req.query.pitchbook) filter.pitchbook = req.query.pitchbook;
    const recs = await Recommendation.find(filter).sort({ createdAt: -1 }).lean();
    res.json({ success: true, data: recs });
  } catch (err) {
    next(err);
  }
}

export async function updateRecommendation(req, res, next) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid recommendation id' });
    }
    const updates = (({ title, description, priority, owner, expectedImpact, status }) => ({ title, description, priority, owner, expectedImpact, status }))(req.body);
    Object.keys(updates).forEach((k) => updates[k] === undefined && delete updates[k]);
    const rec = await Recommendation.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
    if (!rec) {
      return res.status(404).json({ success: false, message: 'Recommendation not found' });
    }
    res.json({ success: true, data: rec });
  } catch (err) {
    next(err);
  }
}

export { SECTION_KEYS, SECTION_TITLES };
