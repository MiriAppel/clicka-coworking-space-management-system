import { google } from 'googleapis';
import { CalendarEventInput, DateISO } from '../../../../types/google';

function getAuth(token: string) {
  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: token });
  return auth;
}

export async function createEvent(
  calendarId: string,
  event: CalendarEventInput,
  token: string
) {
  const calendar = google.calendar({ version: 'v3', auth: getAuth(token) });
  const res = await calendar.events.insert({ calendarId, requestBody: event });
  return res.data;
}

export async function getEvents(calendarId: string, token: string) {
  const calendar = google.calendar({ version: 'v3', auth: getAuth(token) });
  const res = await calendar.events.list({
    calendarId,
    timeMin: new Date().toISOString(),
    singleEvents: true,
    orderBy: 'startTime',
  });
  return res.data.items || [];
}

export async function deleteEvent(calendarId: string, eventId: string, token: string) {
  const calendar = google.calendar({ version: 'v3', auth: getAuth(token) });
  await calendar.events.delete({ calendarId, eventId });
}

export async function updateEvent(
  calendarId: string,
  eventId: string,
  updates: Partial<CalendarEventInput>,
  token: string
) {
  const calendar = google.calendar({ version: 'v3', auth: getAuth(token) });
  const res = await calendar.events.patch({
    calendarId,
    eventId,
    requestBody: updates,
  });
  return res.data;
}

export async function checkAvailability(
  calendarId: string,
  start: DateISO,
  end: DateISO,
  token: string
): Promise<boolean> {
  const calendar = google.calendar({ version: 'v3', auth: getAuth(token) });
  const res = await calendar.freebusy.query({
    requestBody: {
      timeMin: start,
      timeMax: end,
      items: [{ id: calendarId }],
    },
  });
  const busy = res.data.calendars?.[calendarId]?.busy || [];
  return busy.length === 0;
}
