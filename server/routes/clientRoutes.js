import { Router } from 'express';
import { listClients, getClient, createClient, updateClient, listIndustries, getIndustry } from '../controllers/marketController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', listClients);
router.get('/:id', getClient);
router.post('/', protect, createClient);
router.put('/:id', protect, updateClient);

export default router;
