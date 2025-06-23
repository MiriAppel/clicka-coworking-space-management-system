
import { handleGoogleAuthCode, logout, refreshTokenHandler } from '../controllers/authController';
import { verifySession } from '../middlewares/authMiddleware';
import express from 'express';

const routerAuth = express.Router();

routerAuth.post('/refresh', refreshTokenHandler);
routerAuth.post('/google', handleGoogleAuthCode);
routerAuth.post('/logout',  logout);
routerAuth.get('/verify', verifySession,(req,res) => {
    const user= (req as any).user;
    res.status(200).json({ user });
});  


export default routerAuth;
