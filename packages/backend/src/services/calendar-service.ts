import { google } from 'googleapis';
//ספריה לסינכרון איזורי זמן
import { toZonedTime, format } from 'date-fns-tz';
import { CalendarEventInput } from 'shared-types';
import { DateISO } from 'shared-types/core';

function getAuth(token: string) {
  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: token });
  return auth;
}

// פונקציה להמיר תאריך לשעון ישראל
// function convertToIsraelTime(dateString: string) : string {
//   const date = new Date(dateString); // המרת המחרוזת לאובייקט Date
//   //המרת השעה שהתקבלה לשעון נוכחי בישראל

//   const israelTime = toZonedTime(date, 'Asia/Jerusalem');
//   return format(israelTime, 'yyyy-MM-dd HH:mm:ss'); // פורמט הזמן שתרצה
// }
function convertToIsraelTime(dateString: string): string {
    const date = new Date(dateString);
    const israelTime = toZonedTime(date, 'Asia/Jerusalem');
    return israelTime.toISOString(); // החזר בפורמט ISO
}

async function checkConflicts(
  token: string,
  calendarId: string,
  newEvent: Partial<CalendarEventInput>
): Promise<boolean> {
  const calendar = google.calendar({ version: 'v3', auth: getAuth(token) });

  if (newEvent.start?.dateTime && newEvent.end?.dateTime) {
    const newEventStart = new Date(newEvent.start.dateTime);
    const newEventEnd = new Date(newEvent.end.dateTime);
    const response = await calendar.events.list({
      calendarId: calendarId,
      timeMin: newEvent.start.dateTime,
      timeMax: newEvent.end.dateTime,
      singleEvents: true,
      orderBy: 'startTime',
    });

    if (response && response.data && response.data.items) {
      for (const event of response.data.items) {
        if (event.start?.dateTime && event.end?.dateTime) {
          const eventStart = new Date(event.start.dateTime);
          const eventEnd = new Date(event.end.dateTime);
          // בדיקה אם יש חפיפות
          if (newEventStart < eventEnd && newEventEnd > eventStart) {
            console.log(true);
            return true; // יש חפיפות
            
          }
        }
      }
    }
  }
  console.log(false);
  return false; // אין חפיפות
}


export async function createEvent(
  calendarId : string,
  event: CalendarEventInput,
  token:string
)
{
  const calendar = google.calendar({version : 'v3', auth:getAuth(token)});
    event.start.dateTime = convertToIsraelTime(event.start.dateTime as string);
    event.end.dateTime = convertToIsraelTime(event.end.dateTime as string);
    const isConflict = await checkConflicts(token,calendarId,event);
    if(isConflict)
    {
      throw new Error('Conflict detected: Unable to create event.');
    }
  const res = await calendar.events.insert({
    calendarId,
    requestBody: event,
  });
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

  if (updates.start?.dateTime && updates.end?.dateTime) {
    updates.start.dateTime = convertToIsraelTime(updates.start.dateTime as string);
    updates.end.dateTime = convertToIsraelTime(updates.end.dateTime as string);
  }

  const isConflict = await checkConflicts(token, calendarId, updates);
  if (isConflict === true) {
    throw new Error('Conflict detected: Unable to create event.');
  }

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