import { Router } from 'express';
import Pitchbook from '../models/Pitchbook.js';
import Client from '../models/Client.js';
import Industry from '../models/Industry.js';
import Competitor from '../models/Competitor.js';
import MATransaction from '../models/MATransaction.js';
import PotentialTarget from '../models/PotentialTarget.js';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const q = (req.query.q || '').trim();
    if (!q || q.length < 2) {
      return res.json({ success: true, data: { pitchbooks: [], clients: [], industries: [], competitors: [], ma: [], targets: [] } });
    }
    const regex = { $regex: q, $options: 'i' };

    const [pitchbooks, clients, industries, competitors, ma, targets] = await Promise.all([
      Pitchbook.find({ $or: [{ title: regex }, { clientName: regex }, { industry: regex }] }).limit(10).lean(),
      Client.find({ $or: [{ name: regex }, { industry: regex }] }).limit(10).lean(),
      Industry.find({ name: regex }).limit(10).lean(),
      Competitor.find({ $or: [{ name: regex }, { industry: regex }] }).limit(10).lean(),
      MATransaction.find({ $or: [{ company: regex }, { acquirer: regex }, { industry: regex }] }).limit(10).lean(),
      PotentialTarget.find({ $or: [{ company: regex }, { industry: regex }] }).limit(10).lean(),
    ]);

    res.json({
      success: true,
      data: { pitchbooks, clients, industries, competitors, ma, targets },
    });
  } catch (err) {
    next(err);
  }
});

export default router;
