import e, { Request, Response } from 'express';
import * as authService from '../services/authService';
import * as tokenService from '../services/tokenService';
import { LoginRequest, LoginResponse, User } from './../../../../types/auth';
import { decrypt } from '../services/cryptoService';
import { refreshAccessToken } from '../auth/googleApiClient';
import { HttpStatusCode } from 'axios';

export const handleGoogleAuthCode = async (req: Request, res: Response<LoginResponse | { error: string }>) => {
  console.log('Received Google auth code:', req.body.code);

  try {
    const { code } = req.body;
    if (!code) {
      res.status(HttpStatusCode.BadRequest).json({ error: 'Missing authentication code' });
      return;
    }
    const loginResult = await authService.exchangeCodeAndFetchUser(code);
    tokenService.setAuthCookie(res, loginResult.token);
    res.status(200).json(loginResult);
  } catch (error) {
    console.error('Google login failed:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
};

export const logout = (req: Request, res: Response) => {
  tokenService.clearAuthCookie(res);

  res.status(200).json({ message: 'Logged out successfully' });
};

export const refreshTokenHandler = async (req: Request, res: Response) => {
  try {
    const sessionToken = req.cookies.session;
    if (!sessionToken) {
      res.status(401).json({ error: 'not authenticated' });
      return;
    }
    const newJwt = await tokenService.refreshUserToken(sessionToken);
    tokenService.setAuthCookie(res, newJwt);
    res.status(200).json({ message: 'Token refreshed successfully' });

  } catch (err) {
    console.error('Error refreshing token', err);
    res.status(500).json({ error: 'Error refreshing token' });
  }
};