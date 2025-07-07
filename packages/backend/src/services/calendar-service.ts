import { google } from 'googleapis';
import { CalendarEventInput } from 'shared-types/google';
import { DateISO } from 'shared-types/core';
import { toZonedTime, format } from 'date-fns-tz';
import { log } from 'console';
function getAuth(token: string) {
  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: token });
  return auth;
}
// פונקציה להמיר תאריך לשעון ישראל
function convertToIsraelTime(dateString: string) : string {
  console.log("הפונקציה convertToIsraelTime נקראה עם התאריך:", dateString);
  const date = new Date(dateString); // המרת המחרוזת לאובייקט Date
  //המרת השעה שהתקבלה לשעון נוכחי בישראל
  console.log("המרה convertToIsraelTime", date);
  const israelTime = toZonedTime(date, 'Asia/Jerusalem');
    console.log("המרה convertToIsraelTime", israelTime);
  return format(israelTime, 'yyyy-MM-dd HH:mm:ss'); // פורמט הזמן שתרצה
}
async function checkConflicts(
  token: string,
  calendarId: string,
  newEvent: Partial<CalendarEventInput>
): Promise<boolean> {
  const calendar = google.calendar({ version: 'v3', auth: getAuth(token) });

  if (newEvent.start?.date && newEvent.end?.date) {
    const newEventStart = new Date(newEvent.start.date);
    const newEventEnd = new Date(newEvent.end.date);

    const response = await calendar.events.list({
      calendarId: calendarId,
      timeMin: newEvent.start.date,
      timeMax: newEvent.end.date,
      singleEvents: true,
      orderBy: 'startTime',
    });

    if (response && response.data && response.data.items) {
      for (const event of response.data.items) {
        if (event.start?.date && event.end?.date) {
          const eventStart = new Date(event.start.date || event.start.date);
          const eventEnd = new Date(event.end.dateTime || event.end.date);
          // בדיקה אם יש חפיפות
          if (newEventStart < eventEnd && newEventEnd > eventStart) {
            return true; // יש חפיפות
          }
        }
      }
    }
  }
  return false; // אין חפיפות
}
export async function createEvent(
  calendarId : string,
  event: CalendarEventInput,
  token:string
)
{
  console.log("נכנס ליצירה!")
  const calendar = google.calendar({version : 'v3', auth:getAuth(token)});
  console.log("עבר את שלב האימות!")
    event.start.dateTime = convertToIsraelTime(event.start.dateTime as string);
    event.end.dateTime = convertToIsraelTime(event.end.dateTime as string);
    console.log("המרות לשעון ישראלVVVVV", event.start.dateTime);
    const isConflict = await checkConflicts(token,calendarId,event);
    console.log("conflict check is ended", isConflict);
    
    if(isConflict)
    {
      throw new Error('Conflict detected: Unable to create event.');
    }
    console.log("conflict check is ended, no conflict");
    console.log("calendar.events",calendar.events);
    
    
  const res = await calendar.events.insert({
    calendarId,
    requestBody: event,
  });
  console.log("created event successfully", res.data);
  
  return res.data;
}

// export async function createEvent(
//   calendarId: string,
//   event: CalendarEventInput,
//   token: string
// ) {
//   const calendar = google.calendar({ version: 'v3', auth: getAuth(token) });
//   const res = await calendar.events.insert({ calendarId, requestBody: event });
//   return res.data;
// }

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
