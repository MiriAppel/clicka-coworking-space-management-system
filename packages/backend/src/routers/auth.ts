
import { handleGoogleAuthCode } from '../controllers/authController';

import express from 'express';
const router = express.Router();

router.post('/google', handleGoogleAuthCode);

export default router;
