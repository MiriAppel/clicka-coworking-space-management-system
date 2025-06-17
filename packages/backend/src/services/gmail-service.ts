import { google } from 'googleapis';
import { GmailMessage } from '../../../../types/google';

function getAuth(token: string) {
  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: token });
  return auth;
}

export async function listMessages(userId: string, token: string): Promise<GmailMessage[]> {
  const gmail = google.gmail({ version: 'v1', auth: getAuth(token) });
  const res = await gmail.users.messages.list({ userId, maxResults: 10 });
  return res.data.messages || [];
}

export async function getMessage(userId: string, messageId: string, token: string): Promise<any> {
  const gmail = google.gmail({ version: 'v1', auth: getAuth(token) });
  const res = await gmail.users.messages.get({
    userId,
    id: messageId,
    format: 'full',
  });
  return res.data;
}

export async function sendMessage(userId: string, rawMessage: string, token: string): Promise<any> {
  const gmail = google.gmail({ version: 'v1', auth: getAuth(token) });
  const res = await gmail.users.messages.send({
    userId,
    requestBody: { raw: rawMessage },
  });
  return res.data;
}
