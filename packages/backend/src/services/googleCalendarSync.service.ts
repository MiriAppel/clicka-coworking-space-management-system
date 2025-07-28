import { google } from 'googleapis';
import { UserTokenService } from './userTokenService';

export async function watchGoogleCalendar(calendarId: string, webhookUrl: string, accessToken: string | null) {
  if (accessToken !== null) {
  const calendar = google.calendar({ version: 'v3', auth: accessToken});
  const res = await calendar.events.watch({
    calendarId,
    requestBody: {
      id: 'clicka-calendar-id', // מזהה ייחודי לערוץ
      type: 'web_hook',
      address: webhookUrl,
    },
  });
  return res.data;
}
}
export async function renewGoogleWebhook() {
const userTokenService = new UserTokenService();
  const calendarId = 'primary';
  const accessToken = await userTokenService.getSystemAccessToken();
  const webhookUrl = process.env.GOOGLE_WEBHOOK_URL!;
  await watchGoogleCalendar(calendarId, webhookUrl, accessToken);
  console.log('Google Calendar webhook renewed!');
}