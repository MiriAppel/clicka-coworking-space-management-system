import { LoginRequest, LoginResponse, User } from '../../../../types/auth';
import { getTokens, getGoogleUserInfo } from '../auth/googleApiClient';

export const exchangeCodeAndFetchUser = async (code: string):Promise<LoginResponse> => {
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
    return {
      user,
      token: tokens.access_token,
      expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString() // תוקף ל-8 שעות
    };
  } catch (error) { 
     console.error('שגיאה בהחלפת קוד או בשליפת משתמש:', error);
    throw new Error('ההתחברות עם Google נכשלה');
  }
  // לדוגמה: חיפוש או יצירת משתמש במסד נתונים
  // const user = await UserModel.findOrCreate(userInfo);

};
