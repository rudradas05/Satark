import { Router } from 'express';
import { signup, login, changePassword } from './auth.controller';
import { authMiddleware } from '../../middleware/auth';

const router = Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/change-password', authMiddleware, changePassword);

export default router;
