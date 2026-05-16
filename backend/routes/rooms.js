import { Router } from 'express';
import { getRooms, getRoomById, getRoomByCode, createRoom, joinRoom, updateRoom, deleteRoom, startGame } from '../controllers/roomController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/', getRooms);
router.get('/:id', getRoomById);
router.get('/code/:code', getRoomByCode);
router.post('/', authenticate, createRoom);
router.post('/join', authenticate, joinRoom);
router.put('/:id', authenticate, updateRoom);
router.delete('/:id', authenticate, deleteRoom);
router.post('/:id/start', authenticate, startGame);

export default router;
