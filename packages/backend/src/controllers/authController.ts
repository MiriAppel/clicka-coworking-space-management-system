import { Request, Response } from 'express';
import * as authService from '../services/authService';
import * as tokenService from '../services/tokenService';
import { LoginResponse } from "shared-types";

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
    console.log('Login result:', loginResult);
    tokenService.setAuthCookie(res, loginResult.token, loginResult.sessionId!);
    const response = {
      ...loginResult,
      message: 'התחברת בהצלחה. נותקת ממכשירים אחרים.'
    };
    res.status(200).json(response);
  } catch (error: any) {
    console.log('in auth controller catch ',error)
    if ((error as any).message === 'User not found or not authorized to login') {
      res.status(HttpStatusCode.Forbidden).json({ error: 'User not found or not authorized to login' });
    } else if (error.message === 'User not found') {
      res.status(HttpStatusCode.Unauthorized).json({ error: 'User not found' });
    }
    else {
      console.error('Google login failed:', error);
      res.status(500).json({ error: 'Authentication failed' });
    }
  }

};

export const logout = async (req: Request, res: Response) => {
  try {
    const userId = await tokenService.getUserFromCookie(req);
    if (userId) {
      await tokenService.logoutUser(userId, res);
    }
  } catch (error) {
    console.error('Logout failed:', error);
  }
  finally {
    // Clear the auth cookie
    tokenService.clearAuthCookie(res);
  }
  res.status(200).json({ message: 'Logged out successfully' });
};

export const refreshTokenHandler = async (req: Request, res: Response) => {
  try {
    const sessionToken = req.cookies.session;
    const sessionId = req.cookies.sessionId;
    if (!sessionToken || !sessionId) {
      res.status(401).json({ error: 'not authenticated' });
      return;
    }
    const newJwt = await tokenService.refreshUserToken(sessionToken, sessionId);
    tokenService.setAuthCookie(res, newJwt, sessionId);
    res.status(200).json({ message: 'Token refreshed successfully' });
  } catch (err) {
    console.error('Error refreshing token', err);
    if ((err as any).message === 'INVALID_SESSION') {
      // Session expired- need to login again
      tokenService.clearAuthCookie(res);
      res.status(401).json({
        error: 'Session expired',
        message: 'Please login again'
      });
      return;
    }
    res.status(500).json({ error: 'Error refreshing token' });
  }
}    