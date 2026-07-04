import express from 'express';
import { getStudentDashboard } from '../controllers/studentDashboardController.js';
import { protect } from '../middlewares/auth.js'; // Ensure your auth middleware appends the user object to req

const router = express.Router();

router.get('/dashboard', protect, getStudentDashboard);

export default router;
