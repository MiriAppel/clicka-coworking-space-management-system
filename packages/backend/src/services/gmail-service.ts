import { google } from 'googleapis';
import { SendEmailRequest } from '../../../../types/google';

function getAuth(token: string) {
  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: token });
  return auth;
}

function encodeMessage(request: SendEmailRequest): string {
  const boundary = '__BOUNDARY__';
  const headers = [
    `From: me`,
    `To: ${request.to.join(', ')}`,
    request.cc?.length ? `Cc: ${request.cc.join(', ')}` : '',
    request.bcc?.length ? `Bcc: ${request.bcc.join(', ')}` : '',
    `Subject: ${request.subject}`,
    `MIME-Version: 1.0`,
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
  ].filter(Boolean).join('\n');

  const bodyPlain = request.isHtml ? '' : request.body;
  const bodyHtml = request.isHtml ? request.body : '';

  const message = [
    headers,
    '',
    `--${boundary}`,
    'Content-Type: text/plain; charset="UTF-8"',
    '',
    bodyPlain,
    `--${boundary}`,
    'Content-Type: text/html; charset="UTF-8"',
    '',
    bodyHtml,
    `--${boundary}--`,
  ].join('\n');

  return Buffer.from(message).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export async function sendEmail(userId: string, request: SendEmailRequest, token: string) {
  const gmail = google.gmail({ version: 'v1', auth: getAuth(token) });
  const raw = encodeMessage(request);
  const res = await gmail.users.messages.send({ userId, requestBody: { raw } });
  return res.data;
}

export async function listEmails(userId: string, token: string) {
  const gmail = google.gmail({ version: 'v1', auth: getAuth(token) });
  const listRes = await gmail.users.messages.list({ userId, maxResults: 10 });

  const messages = listRes.data.messages ?? [];
  const detailed = await Promise.all(messages.map(async msg => {
    const full = await gmail.users.messages.get({ userId, id: msg.id!, format: 'metadata' });
    return {
      id: msg.id,
      snippet: full.data.snippet,
      headers: full.data.payload?.headers,
    };
  }));

  return detailed;
}

