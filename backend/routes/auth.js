import { Router } from 'express';
import { login, register, getSession, updateProfile } from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.post('/login', login);
router.post('/register', register);
router.get('/session', authenticate, getSession);
router.put('/profile', authenticate, updateProfile);

export default router;
