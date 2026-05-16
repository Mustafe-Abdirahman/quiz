import { Router } from 'express';
import { getUsers, getUserById, updateUser, deleteUser, createUser } from '../controllers/userController.js';
import { authenticate, adminOnly } from '../middleware/auth.js';

const router = Router();

router.get('/', authenticate, adminOnly, getUsers);
router.post('/', authenticate, adminOnly, createUser);
router.get('/:id', authenticate, getUserById);
router.put('/:id', authenticate, adminOnly, updateUser);
router.delete('/:id', authenticate, adminOnly, deleteUser);

export default router;
