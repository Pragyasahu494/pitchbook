import { Router } from 'express';
import { chat, getHistory, clearHistory } from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/chat', protect, chat);
router.get('/history/:pitchbookId', protect, getHistory);
router.delete('/history/:pitchbookId', protect, clearHistory);

export default router;
