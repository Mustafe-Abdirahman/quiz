import { Router } from 'express';
import { getQuestions, getQuestionsByQuizId, createQuestion, updateQuestion, deleteQuestion } from '../controllers/questionController.js';
import { authenticate, adminOnly } from '../middleware/auth.js';

const router = Router();

router.get('/', getQuestions);
router.get('/quiz/:quizId', getQuestionsByQuizId);
router.post('/', authenticate, adminOnly, createQuestion);
router.put('/:id', authenticate, adminOnly, updateQuestion);
router.delete('/:id', authenticate, adminOnly, deleteQuestion);

export default router;
