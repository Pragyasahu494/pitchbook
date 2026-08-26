import { Router } from 'express';
import { listCompetitors, listMA, listTargets } from '../controllers/marketController.js';

const router = Router();

router.get('/competitors', listCompetitors);
router.get('/ma', listMA);
router.get('/targets', listTargets);

export default router;
