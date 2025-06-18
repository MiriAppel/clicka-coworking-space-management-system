
import { handleGoogleAuthCode, logout } from '../controllers/authController';
import { verifySession } from '../middlewares/authMiddleware';
import express from 'express';

const router = express.Router();

router.post('/google', handleGoogleAuthCode);
router.post('/logout', verifySession, logout);

export default router;
