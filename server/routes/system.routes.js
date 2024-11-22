import express from 'express';
import { resetSystem } from '../controllers/system.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.post('/reset', authenticate, resetSystem);

export default router;