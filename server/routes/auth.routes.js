import express from 'express';
import { login, validateToken } from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.post('/login', login);
router.get('/validate', authenticate, validateToken);

export default router;