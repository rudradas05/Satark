import { Router } from 'express';
import { signup, login, changePassword } from './auth.controller';
import { authGuard } from '../../middleware/authGuard';

const router = Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/change-password', authGuard, changePassword);

export default router;
