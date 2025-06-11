
import { handleGoogleAuthCode } from '../controllers/authController';

const express = require('express')
const router = express.Router();

router.post('/google', handleGoogleAuthCode);

export default router;
