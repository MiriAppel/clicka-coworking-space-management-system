import { Request, Response } from 'express';
import * as authService from '../services/authService';

export const handleGoogleAuthCode = async (req: Request, res: Response) => {
    console.log('Received Google auth code:', req.body.code);
    
  try {
    const { code } = req.body;
    const userData = await authService.exchangeCodeAndFetchUser(code);
    console.log(userData);
    
    res.status(200).json(userData);
  } catch (error) {
    console.error('Google login failed:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
};
