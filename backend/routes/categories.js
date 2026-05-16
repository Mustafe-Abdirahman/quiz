import { Router } from 'express';
import { getCategories, createCategory, deleteCategory } from '../controllers/categoryController.js';
import { authenticate, adminOnly } from '../middleware/auth.js';

const router = Router();

router.get('/', getCategories);
router.post('/', authenticate, adminOnly, createCategory);
router.delete('/:id', authenticate, adminOnly, deleteCategory);

export default router;
