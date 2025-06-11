import { getTokens, getGoogleUserInfo } from '../auth/googleApiClient';

export const exchangeCodeAndFetchUser = async (code: string) => {
  const tokens = await getTokens(code);
  if (!tokens.access_token) {
    throw new Error('No access token received from Google');
  }
  const userInfo = await getGoogleUserInfo(tokens.access_token);
  
  // לדוגמה: חיפוש או יצירת משתמש במסד נתונים
  // const user = await UserModel.findOrCreate(userInfo);

  return {
    user: userInfo,
    tokens,
  };
};
