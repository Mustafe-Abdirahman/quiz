import { Router } from 'express';
import { getAttempts, getUserAttempts, saveAttempt, getLeaderboard, getUserStats } from '../controllers/attemptController.js';
import { authenticate, adminOnly } from '../middleware/auth.js';

const router = Router();

router.get('/', authenticate, adminOnly, getAttempts);
router.get('/leaderboard', getLeaderboard);
router.get('/user/:userId', authenticate, getUserAttempts);
router.get('/user/:userId/stats', authenticate, getUserStats);
router.post('/', authenticate, saveAttempt);

export default router;
