
import type{ CreateGoogleCalendarEventRequest, DeleteGoogleCalendarEventRequest, GoogleCalendarEvent, ID, UpdateGoogleCalendarEventRequest } from "shared-types";
import { CalendarConflict, CalendarSync, CalendarSyncStatus } from "shared-types/calendarSync";
import {SyncBookingsWithGoogleRequest} from "shared-types/booking";
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv';
import { CalendarSyncModel } from "../models/calendarSync.model";
import { getEvents } from './calendar-service';
// טוען את משתני הסביבה מקובץ .env
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || ''; // החלף עם ה-URL של פרויקט ה-Supabase שלך
const supabaseAnonKey = process.env.SUPABASE_KEY || ''; // החלף עם ה-Anon Key שלך
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const getGoogleCalendarEvents=async(calendarId: string, token: string):Promise<GoogleCalendarEvent[]|null>=>{
//שליפת כל האירועים לפי לוח
const events=getEvents(calendarId,token);
{
        // "kind": "calendar#event",
        // "etag": "\"3502887760417406\"",
        // "id": "i7olv0aq1496o7c5oauerbc45s",
        // "status": "confirmed",
        // "htmlLink": "https://www.google.com/calendar/event?eid=aTdvbHYwYXExNDk2bzdjNW9hdWVyYmM0NXMgbDA1NDg1NDQ5NjJAbQ",
        // "created": "2025-07-02T08:11:20.000Z",
        // "updated": "2025-07-02T08:11:20.208Z",
        // "summary": "פגישת בדיקה",
        // "description": "פגישה לדוגמה",
        // "location": "תל אביב",
        // "creator": {
        //     "email": "l0548544962@gmail.com",
        //     "self": true
        // },
        // "organizer": {
        //     "email": "l0548544962@gmail.com",
        //     "self": true
        // },
        // "start": {
        //     "dateTime": "2025-07-23T15:00:00+03:00",
        //     "timeZone": "Asia/Jerusalem"
        // },
        // "end": {
        //     "dateTime": "2025-07-23T16:00:00+03:00",
        //     "timeZone": "Asia/Jerusalem"
        // },
        // "iCalUID": "i7olv0aq1496o7c5oauerbc45s@google.com",
        // "sequence": 0,
        // "reminders": {
        //     "useDefault": true
        // },
        // "eventType": "default"



//         export interface GoogleCalendarEvent {
//   id: string;
//   calendarId: string;
//   summary: string;
//   description?: string;
//   location?: string;
//   start: {
//     dateTime: string; // ISO date string
//     timeZone?: string;
//   };
//   end: {
//     dateTime: string; // ISO date string
//     timeZone?: string;
//   };
//   attendees?: {
//     email: string;
//     displayName?: string;
//     responseStatus?: 'needsAction' | 'declined' | 'tentative' | 'accepted';
//   }[];
//   status: 'confirmed' | 'tentative' | 'cancelled';
//   created: string; // ISO date string
//   updated: string; // ISO date string
//   htmlLink: string; // URL to the event in Google Calendar
// }
    }
    return null; 
}

export const createCalendarSync=async(request: SyncBookingsWithGoogleRequest):Promise<CalendarSyncStatus>=>{
// פונקציה זו תבדוק האם ניתן להוסיף אירוע לחדר הרצוי בזמן הרצוי
//calendarSync ותיצר בהתאם לתוצאות אובייקט 
    return CalendarSyncStatus.SYNCED; // דוגמה להחזרת סטטוס סינכרון
}

export const gatAllCalendarSync=async():Promise<CalendarSync[]|null>=>{
const { data, error } =  await supabase
        .from('calendar_sync')
        .select('*')
    if (error) {
        console.error('Error fetching maps layout :', error);
        return null;
    }
    const layouts = CalendarSyncModel.fromDatabaseFormatArray(data);


    return layouts;
}
export async function getCalendarSyncById(id: string) {
    const { data, error } = await supabase
        .from('calendar_sync')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error fetching layout:', error);
        return null;
    }

    const layout = CalendarSyncModel.fromDatabaseFormat(data); // המרה לסוג UserModel
   
    return layout;
}

export const createCalendarEvent=async(event:CreateGoogleCalendarEventRequest)=>{
// react- פונקציה זו מקבלת פרטי אירוע מ
//שמחזירה סטטוס סינכרון createCalendarSync שולחת לפונקציה

// approvedAt approvedBy ו-וגם יש הרשאה להזמנה  CalendarSyncStatus.SYNCED  במידה והסטטוס
// נוצרה ע"י לאה שארר-createGoogleCalendarEvent(event)  מבצעת שליחה לפונקצית הוספת אירוע
// calendarשתוסיף את האירוע  ב 

//faild/pending אם הסטטוס ????

// detectCalendarConflicts תתבצע שליחה ל conflict-אם הסטטוס 
//תקבל את הקונפליקטים הקיימים
//ותציג את ההצעות לפתרון הקונפליקטים

}

export const detectCalendarConflicts=async(calendar:CalendarSync):Promise<CalendarConflict[]>=>{
       const conflicts: CalendarConflict[] = [];
//פונקציה זו תזהה קונפליקטים .
//  היא תבדוק האם יש חפיפות בזמנים או בעיות אחרות  
// ROOM_CONFLICT או PERMISSION_ERROR.
//suggetedResolution עבור כל קונפליקט תכתוב הצעה לפתרון
//ותןסיף  לרשימה  

   return conflicts; 
}

//צריך? או איך שמסודר ביצירת אירוע?
// export const solveCalendarConflict=async(conflict:CalendarConflict):Promise<void>=>{
//    // פונקציה זו תקבל קונפליקט ובהתאם 
//    //   תבצע שינוי בפרטי ההזמנה type ל
//    //כך שהקונפליקט יפתר
// }


export const deleteEnevt=async(enevt:DeleteGoogleCalendarEventRequest)=>{
 // פונקציה זו תמחק אירוע.
 // לאה שארר-deleteGoogleCalendarEvent ע"י שליחה לפונקצית מחיקה
 // המתאים calendarSync ותמחק את ה 
 //deleteCalendarSyncByEventId() ע"י הפונקציה 
}

export const deleteCalendarSyncByEventId=async(eventId:string)=>{
//מהמסד calendarSync מחיקת   
}

export const updateEnevtOnChangeBooking=async(updateDetails:UpdateGoogleCalendarEventRequest):Promise<void>=>{
 // פונקציה זו תעדכן אירוע קיים בלוח השנה כאשר פרטי ההזמנה משתנים.
 // לאה שארר-updateGoogleCalendarEvent ע"י שליחה לפונקצית עדכון
 // המתאים calendarSync ותעדכן את ה 
 //updateCalendarSync() ע"י מציאתו בפונקציה 
}

export const updateCalendarSync=async(eventId:string)=>{
//ע"י קוד אירוע  calendarSync  עדכון 
//עדכון התאריך לנוכחי ושינוי סטטוס אם צריך
 return null;
}

export const getCalendarByRoom = async (roomId: ID): Promise<CalendarSync|null> => {
   //  לקבלת לוח שנה עפ"י קוד חדר
return null;
}


export const manageCalendarPermissions = async (calendarId: string, email: string, role?: string): Promise<void> => {
    //Google Calendar API כדי לנהל את ההרשאות
    // לדוגמה, אפשר להשתמש ב-ACL (Access Control Lists) כדי להוסיף או לעדכן הרשאות
}

export const shareCalendar = async (calendarId: string, email: string): Promise<void> => {
    // אפשר להשתמש ב-Google Calendar API כדי לשתף את לוח השנה עם כתובת המייל
}

