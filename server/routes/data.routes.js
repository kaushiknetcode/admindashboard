import express from 'express';
import { submitVotingData, getVotingData } from '../controllers/data.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.post('/submit', authenticate, submitVotingData);
router.get('/votes', authenticate, getVotingData);

export default router;