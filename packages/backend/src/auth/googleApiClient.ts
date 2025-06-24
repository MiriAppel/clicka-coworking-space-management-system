import dotenv from 'dotenv';
dotenv.config();

import { google } from 'googleapis';
import axios from 'axios';


const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;

if (!CLIENT_ID || !CLIENT_SECRET || !REDIRECT_URI) {
  throw new Error('Missing Google OAuth environment variables!');
}

console.log("GOOGLE_CLIENT_ID:", CLIENT_ID);
console.log("GOOGLE_CLIENT_SECRET:", CLIENT_SECRET ? '***' : 'MISSING');
console.log("GOOGLE_REDIRECT_URI:", REDIRECT_URI);

export const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

// פונקציה להחלפת קוד בטוקנים
export async function getTokens(code: string) {
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);
  return {
    access_token: tokens.access_token!,
    refresh_token: tokens.refresh_token,
    id_token: tokens.id_token,
    scope: tokens.scope,
    token_type: tokens.token_type,
    expires_in: tokens.expiry_date ? Math.floor((tokens.expiry_date - Date.now()) / 1000) : 8 * 60 * 60,
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

export async function refreshAccessToken(refreshToken: string) {
  const params = new URLSearchParams();
  params.append('client_id', CLIENT_ID!);
  params.append('client_secret', CLIENT_SECRET!);
  params.append('refresh_token', refreshToken);
  params.append('grant_type', 'refresh_token');

  try {
    const response = await axios.post('https://oauth2.googleapis.com/token', params, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    const { access_token, expires_in } = response.data;
    const expiresAt = new Date(Date.now() + expires_in * 1000).toISOString();

    return {
      access_token,
      expires_at: expiresAt,
    };
  } catch (error: any) {
    console.error('שגיאה בקבלת טוקן חדש מגוגל:', error.response?.data || error.message);
    throw new Error('רענון הטוקן נכשל');
  }
}