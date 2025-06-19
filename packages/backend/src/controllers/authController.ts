import e, { Request, Response } from 'express';
import * as authService from '../services/authService';
import { LoginRequest, LoginResponse, User } from './../../../../types/auth';
import jwt from 'jsonwebtoken';
import { decrypt } from '../services/cryptoService';
import { refreshAccessToken } from '../auth/googleApiClient';

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
      token: jwtToken,
      expiresAt: userData.expiresAt
    };

    res.status(200).json(loginResponse);
  } catch (error) {
    console.error('Google login failed:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
};

export const logout = (req: Request, res: Response) => {
  res.clearCookie('session', {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
  });

  res.status(200).json({ message: 'Logged out successfully' });
};

// export const refreshTokenHandler = async (req: Request, res: Response) => {
//   try {
//     const sessionToken = req.cookies.session;
//     if (!sessionToken) return res.status(401).json({ error: 'לא מחובר' });

//     const payload = jwt.verify(sessionToken, process.env.JWT_SECRET!) as any;
//     const userId = payload.userId;

//     // שליפת refresh token
//     //need to access DB to get the refresh token
//     const record = await userTokens.findUnique({ where: { userId } });
//     //------------------------------------------------------------------
//     if (!record?.refreshToken) return res.status(401).json({ error: 'אין טוקן לרענון' });

//     const refreshToken = decrypt(record.refreshToken);
//     const tokens = await refreshAccessToken(refreshToken);

//     const newJwt = jwt.sign(
//       { userId, email: payload.email },
//       process.env.JWT_SECRET!,
//       { expiresIn: '8h' }
//     );

//     res.cookie('session', newJwt, {
//       httpOnly: true,
//       secure: true,
//       sameSite: 'strict',
//       maxAge: 8 * 60 * 60 * 1000,
//     });

//     return res.status(200).json({ message: 'הטוקן חודש בהצלחה' });

//   } catch (err) {
//     console.error('שגיאה ברענון טוקן', err);
//     return res.status(500).json({ error: 'שגיאה בעת רענון טוקן' });
//   }
// };