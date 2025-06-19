import { LoginRequest, LoginResponse, User } from '../../../../types/auth';
import { getTokens, getGoogleUserInfo } from '../auth/googleApiClient';

export const exchangeCodeAndFetchUser = async (code: string): Promise<LoginResponse> => {
  try {
    const tokens = await getTokens(code);
    if (!tokens.access_token) {
      throw new Error('No access token received from Google');
    }
    const userInfo = await getGoogleUserInfo(tokens.access_token);
    console.log(userInfo);
    const user: User = {
      id: userInfo.id,
      email: userInfo.email,
      firstName: userInfo.given_name,
      lastName: userInfo.family_name,
      role: userInfo.role,
      googleId: userInfo.id, // Google user ID
      lastLogin: new Date().toISOString(),
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    //need to save access token and refresh token in the database nad crypt them
    // const encryptedAccessToken = encrypt(tokens.access_token);
    // const encryptedRefreshToken = encrypt(tokens.refresh_token || '');
    // Save user and tokens to the database here
    console.log('Access Token:', tokens.access_token);
    console.log('Refresh Token:', tokens.refresh_token);
    return {
      user,
      token: tokens.access_token,
      refreshToken: tokens.refresh_token!, // Optional, if you want to store it
      expiresAt: tokens.expires_at
    };
  } catch (error) {
    console.error('שגיאה בהחלפת קוד או בשליפת משתמש:', error);
    throw new Error('ההתחברות עם Google נכשלה');
  }
  // לדוגמה: חיפוש או יצירת משתמש במסד נתונים
  // const user = await UserModel.findOrCreate(userInfo);

};
