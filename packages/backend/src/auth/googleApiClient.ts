import { google } from 'googleapis';
import dotenv from 'dotenv';

dotenv.config();
//parameters for Google OAuth2 from environment variables
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;

export const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

// function to generate the authentication URL for Google OAuth2

//function to replace the code with the tokens received from Google
export async function getTokens(code: string) {
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);
  return {
    access_token: tokens.access_token!,
    refresh_token: tokens.refresh_token, // חשוב - שומר אותו אם גוגל החזירה
    id_token: tokens.id_token,
    scope: tokens.scope,
    token_type: tokens.token_type,
    expires_in: tokens.expiry_date ? Math.floor((tokens.expiry_date - Date.now()) / 1000) : 8 * 60 * 60, // ברירת מחדל ל־8 שעות
    expires_at: tokens.expiry_date ? new Date(tokens.expiry_date).toISOString() : new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
  };
}


export async function getGoogleUserInfo(access_token: string) {
  const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });

  if (!response.ok) throw new Error('Failed to fetch user info');

  return response.json();
}

