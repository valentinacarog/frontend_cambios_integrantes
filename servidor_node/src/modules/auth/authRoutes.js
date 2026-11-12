import { Router } from 'express';
import { login, register, getMe } from './authController.js';
import { verifyToken } from '../../middlewares/authMiddleware.js';

const router = Router();

router.post('/login', login);
router.post('/register', register);
router.get('/me', verifyToken, getMe);

export default router;
