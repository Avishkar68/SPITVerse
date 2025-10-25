import { Router } from 'express';
const router = Router();
import userController from '../controllers/userController.js';

const { getProfile, updateProfile,getTopRankers, getAggregateDashboard, getFullDB } = userController;

// GET /api/users/profile?id=<id> or ?email=<email>
router.get('/profile', getProfile);

// PUT /api/users/profile?id=... or ?email=...
router.put('/profile', updateProfile);

// GET /api/dashboard/summary
router.get('/dashboard/summary', getAggregateDashboard);

// GET /api/dashboard/full   -> returns all users, posts, comments
router.get('/dashboard/full', getFullDB);

router.get('/top-rankers', getTopRankers);

export default router;
