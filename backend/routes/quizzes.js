import { Router } from 'express';
import { getQuizzes, getQuizById, createQuiz, updateQuiz, deleteQuiz, incrementPlayCount, assignQuiz, getAssignments } from '../controllers/quizController.js';
import { authenticate, adminOnly, optionalAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', optionalAuth, getQuizzes);
router.get('/:id', getQuizById);
router.post('/', authenticate, adminOnly, createQuiz);
router.put('/:id', authenticate, adminOnly, updateQuiz);
router.delete('/:id', authenticate, adminOnly, deleteQuiz);
router.post('/:id/play', incrementPlayCount);
router.post('/:id/assign', authenticate, adminOnly, assignQuiz);
router.get('/:id/assignments', authenticate, adminOnly, getAssignments);

export default router;
