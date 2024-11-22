import express from 'express';
import { 
  getZonalStats, 
  getPlaceStats,
  getDateWiseStats,
  getActivityLogs 
} from '../controllers/stats.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/zonal', authenticate, getZonalStats);
router.get('/place/:placeId', authenticate, getPlaceStats);
router.get('/datewise', authenticate, getDateWiseStats);
router.get('/activity', authenticate, getActivityLogs);

export default router;