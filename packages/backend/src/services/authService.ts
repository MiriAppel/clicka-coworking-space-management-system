import { createClient } from '@supabase/supabase-js';
import { LoginRequest, LoginResponse, User } from "shared-types";
import { getTokens, getGoogleUserInfo } from '../auth/googleApiClient';
import jwt from 'jsonwebtoken';
import { saveUserTokens } from './tokenService';
import { UserService } from './user-service';


export const generateJwtToken = (payload: { userId: string; email: string; googleId: string }): string => {
  return jwt.sign(
  {    userId: payload.userId,
    email: payload.email,
    googleId: payload.googleId
  },
    process.env.JWT_SECRET!,
    { expiresIn:  '8h' } // 8 hours
  );
};

export const verifyJwtToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_SECRET!) as { userId: string; email: string; googleId: string };
};

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
    //need to check if the user have permission to login
    // const checkUser=await UserService.loginByGoogleId(user.googleId)
    // if(checkUser===null){
    //   throw new Error('User not found or not authorized to login');
    // }
//---------------------------------------------------
    await saveUserTokens(user.id, tokens.refresh_token || '');

    console.log('Access Token:', tokens.access_token);
    console.log('Refresh Token:', tokens.refresh_token);
    const jwtToken = generateJwtToken({
      userId: user.id,
      email: user.email,
      googleId: user.googleId!
    });
    return {
      user,
      token: jwtToken,
      // refreshToken: tokens.refresh_token!, // Optional, if you want to store it
      expiresAt: tokens.expires_at
    };

  } catch (error) {
    console.error('שגיאה בהחלפת קוד או בשליפת משתמש:', error);
    throw new Error('ההתחברות עם Google נכשלה');
  }
  // לדוגמה: חיפוש או יצירת משתמש במסד נתונים
  // const user = await UserModel.findOrCreate(userInfo);

};
