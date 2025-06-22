
import { handleGoogleAuthCode, logout } from '../controllers/authController';
import { verifySession } from '../middlewares/authMiddleware';
import express from 'express';

const router = express.Router();

router.post('/google', handleGoogleAuthCode);
router.post('/logout',  logout);
router.get('/verify', verifySession,(req,res) => {
    const user= (req as any).user;
    res.status(200).json({ user });
});

export default router;
