import { Router } from 'express';
import { getQuizzes, getQuizById, createQuiz, updateQuiz, deleteQuiz, incrementPlayCount } from '../controllers/quizController.js';
import { authenticate, adminOnly } from '../middleware/auth.js';

const router = Router();

router.get('/', getQuizzes);
router.get('/:id', getQuizById);
router.post('/', authenticate, adminOnly, createQuiz);
router.put('/:id', authenticate, adminOnly, updateQuiz);
router.delete('/:id', authenticate, adminOnly, deleteQuiz);
router.post('/:id/play', incrementPlayCount);

export default router;
