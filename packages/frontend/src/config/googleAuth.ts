export const googleAuthConfig = {
  clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID!,
  redirectUri: process.env.REACT_APP_GOOGLE_REDIRECT_URI!,
  scopes: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/calendar',
        'https://www.googleapis.com/auth/drive',
        'https://www.googleapis.com/auth/gmail.readonly',
    ],
};

