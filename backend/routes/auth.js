import { Router } from 'express';
import { login, register, getSession } from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.post('/login', login);
router.post('/register', register);
router.get('/session', authenticate, getSession);

export default router;
