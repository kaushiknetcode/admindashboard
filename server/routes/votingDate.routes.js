import express from 'express';
import { 
  getVotingDates,
  updateDateStatus,
  setCurrentDate 
} from '../controllers/votingDate.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticate, getVotingDates);
router.patch('/:date/status', authenticate, updateDateStatus);
router.post('/current', authenticate, setCurrentDate);

export default router;