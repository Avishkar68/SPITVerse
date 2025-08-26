import { Router } from 'express';
const router = Router();
import { login } from '../controllers/authController.js';

// POST /api/auth/login
router.post('/login', login);

export default router;
