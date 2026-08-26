import mongoose from 'mongoose';
import Client from '../models/Client.js';
import Industry from '../models/Industry.js';
import Competitor from '../models/Competitor.js';
import MATransaction from '../models/MATransaction.js';
import PotentialTarget from '../models/PotentialTarget.js';

export async function listClients(req, res, next) {
  try {
    const clients = await Client.find().sort({ createdAt: -1 }).lean();
    res.json({ success: true, data: clients });
  } catch (err) {
    next(err);
  }
}

export async function getClient(req, res, next) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid client id' });
    }
    const client = await Client.findById(id).lean();
    if (!client) {
      return res.status(404).json({ success: false, message: 'Client not found' });
    }
    res.json({ success: true, data: client });
  } catch (err) {
    next(err);
  }
}

export async function createClient(req, res, next) {
  try {
    const client = await Client.create(req.body);
    res.status(201).json({ success: true, data: client });
  } catch (err) {
    next(err);
  }
}

export async function updateClient(req, res, next) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid client id' });
    }
    const client = await Client.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!client) {
      return res.status(404).json({ success: false, message: 'Client not found' });
    }
    res.json({ success: true, data: client });
  } catch (err) {
    next(err);
  }
}

export async function listIndustries(req, res, next) {
  try {
    const industries = await Industry.find().lean();
    res.json({ success: true, data: industries });
  } catch (err) {
    next(err);
  }
}

export async function getIndustry(req, res, next) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid industry id' });
    }
    const industry = await Industry.findById(id).lean();
    if (!industry) {
      return res.status(404).json({ success: false, message: 'Industry not found' });
    }
    res.json({ success: true, data: industry });
  } catch (err) {
    next(err);
  }
}

export async function listCompetitors(req, res, next) {
  try {
    const filter = {};
    if (req.query.industry) filter.industry = { $regex: req.query.industry, $options: 'i' };
    const competitors = await Competitor.find(filter).sort({ marketShare: -1 }).lean();
    res.json({ success: true, data: competitors });
  } catch (err) {
    next(err);
  }
}

export async function listMA(req, res, next) {
  try {
    const filter = {};
    if (req.query.industry) filter.industry = { $regex: req.query.industry, $options: 'i' };
    const transactions = await MATransaction.find(filter).sort({ date: -1 }).lean();
    res.json({ success: true, data: transactions });
  } catch (err) {
    next(err);
  }
}

export async function listTargets(req, res, next) {
  try {
    const filter = {};
    if (req.query.industry) filter.industry = { $regex: req.query.industry, $options: 'i' };
    const targets = await PotentialTarget.find(filter).sort({ fitScore: -1 }).lean();
    res.json({ success: true, data: targets });
  } catch (err) {
    next(err);
  }
}
