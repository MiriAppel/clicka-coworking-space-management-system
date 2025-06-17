import e, { Request, Response } from 'express';
import * as authService from '../services/authService';
import { LoginResponse, User } from './../../../../types/auth';
import jwt from 'jsonwebtoken';

export const handleGoogleAuthCode = async (req: Request, res: Response<LoginResponse | { error: string }>) => {
    console.log('Received Google auth code:', req.body.code);
    
  try {
    const { code } = req.body;
    const userData = await authService.exchangeCodeAndFetchUser(code);
        
    const jwtToken = jwt.sign(
      { userId: userData.user.id, email: userData.user.email },
      process.env.JWT_SECRET!,
      { expiresIn: '8h' }
    );
    res.cookie('session', jwtToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 8 * 60 * 60 * 1000, // 8 שעות
    });


    const loginResponse: LoginResponse = {
      user: userData.user,
      token: userData.token, // Make sure userData.token exists and is correct
      expiresAt: userData.expiresAt // Ensure this is in ISO string format
    };

    res.status(200).json(loginResponse);
  } catch (error) {
    console.error('Google login failed:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
};
