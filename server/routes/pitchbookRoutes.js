import { Router } from 'express';
import {
  listPitchbooks,
  getPitchbook,
  createPitchbook,
  updatePitchbook,
  deletePitchbook,
  generatePitchbook,
  generateSectionController,
  listRecommendations,
  updateRecommendation,
} from '../controllers/pitchbookController.js';
import { protect, optionalAuth } from '../middleware/authMiddleware.js';

const router = Router();

router.route('/')
  .get(optionalAuth, listPitchbooks)
  .post(protect, createPitchbook);

router.route('/:id')
  .get(optionalAuth, getPitchbook)
  .put(protect, updatePitchbook)
  .delete(protect, deletePitchbook);

router.post('/:id/generate', protect, generatePitchbook);
router.post('/:id/sections/:sectionKey/generate', protect, generateSectionController);

router.route('/recommendations')
  .get(listRecommendations);
router.route('/recommendations/:id')
  .put(protect, updateRecommendation);

export default router;
