import { google } from 'googleapis';
import { CalendarEventInput } from 'shared-types/google';
import { DateISO } from 'shared-types/core';

function getAuth(token: string) {
  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: token });
  return auth;
}

// פונקציה ליצירת לוח שנה חדש
export async function createCalendar(
  summary: string, // שם הלוח שנה
  token: string,
  options?: {
    description?: string;
    location?: string;
    timeZone?: string;
  }
) {
  try {
    const calendar = google.calendar({ version: 'v3', auth: getAuth(token) });

    const calendarResource = {
      summary: summary, // שם הלוח שנה (חובה)
      description: options?.description || '',
      location: options?.location || '',
      timeZone: options?.timeZone || 'Asia/Jerusalem'
    };

    const res = await calendar.calendars.insert({
      requestBody: calendarResource
    });

    console.log('Calendar created:', res.data.summary);
    console.log('Calendar ID:', res.data.id);

    return res.data;
  } catch (error) {
    console.error('Error creating calendar:', error);
    throw error;
  }
}

// פונקציה למחיקת לוח שנה
export async function deleteCalendar(calendarId: string, token: string) {
  try {
    const calendar = google.calendar({ version: 'v3', auth: getAuth(token) });

    await calendar.calendars.delete({ calendarId });

    console.log('Calendar deleted:', calendarId);
    return true;
  } catch (error) {
    console.error('Error deleting calendar:', error);
    throw error;
  }
}

// פונקציה ליצירת אירוע חדש
export async function createEvent(
  calendarId: string,
  event: CalendarEventInput,
  token: string
) {
  const calendar = google.calendar({ version: 'v3', auth: getAuth(token) });
  const res = await calendar.events.insert({ calendarId, requestBody: event });
  return res.data;
}

//פונקציה לקבלת אירועים
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

// פונקציה למחיקת אירוע
export async function deleteEvent(calendarId: string, eventId: string, token: string) {
  const calendar = google.calendar({ version: 'v3', auth: getAuth(token) });
  await calendar.events.delete({ calendarId, eventId });
}

// פונקציה לעדכון אירוע
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

// פונקציה לבדיקת זמינות
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
