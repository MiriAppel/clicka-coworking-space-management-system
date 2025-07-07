
import type{  CalendarEventInput, CreateGoogleCalendarEventRequest, DeleteGoogleCalendarEventRequest, GoogleCalendarEvent, ID, UpdateGoogleCalendarEventRequest } from "shared-types";
import { CalendarConflict, CalendarSync, CalendarSyncStatus } from "shared-types";
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv';
import { CalendarSyncModel } from "../models/calendarSync.model";
import { getEvents } from './calendar-service';
import {createEvent} from './calendar-service'
import { BookingModel } from "../models/booking.model";
// טוען את משתני הסביבה מקובץ .env
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || ''; // החלף עם ה-URL של פרויקט ה-Supabase שלך
const supabaseAnonKey = process.env.SUPABASE_KEY || ''; // החלף עם ה-Anon Key שלך
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const getGoogleCalendarEvents=async(calendarId: string, token: string):Promise<GoogleCalendarEvent[]|null>=>{
//שליפת כל האירועים לפי לוח
const events=getEvents(calendarId,token);
{
       
    }
    return null; 
}

export const createCalendarSync=async(sync: CalendarSyncModel): Promise<CalendarSyncModel | null>=> {
    const { data, error } = await supabase
        .from('calendar_sync') // שם הטבלה ב-Supabase
        // .insert([map]) // כך זה עובד?
        .insert([sync.toDatabaseFormat()]) 
        //לא צריך עם המרה?
        .select()
        .single();

    if (error) {
        console.error('Error creating sync:', error);
        return null;
    }
   
    const createdSync = CalendarSyncModel.fromDatabaseFormat(data); // המרה לסוג WorkspaceMapModel
    
    return createdSync;
}
// פונקציה זו תבדוק האם ניתן להוסיף אירוע לחדר הרצוי בזמן הרצוי
//calendarSync ותיצר בהתאם לתוצאות אובייקט 
    // return CalendarSyncStatus.SYNCED; // דוגמה להחזרת סטטוס סינכרון
 
    export async function updateCalendarSync(id: string, updatedData: CalendarSyncModel): Promise<CalendarSyncModel | null> {
    
        console.log('Prepared sync data for update:', JSON.stringify(updatedData, null, 2));
        const { data, error } = await supabase
            .from('calendar_sync')
            .update([updatedData.toDatabaseFormat()])
            .eq('id', id)
            .select()
            .single();
        if (error) {
            console.error('Error updating sync:', error);
            return null;
        }
         const sync = CalendarSyncModel.fromDatabaseFormat(data) ; 
        return sync;
    
    
    
    }
    
    //  מחיקה 
    export async function deleteCalendarSync(id: string): Promise<boolean> {
        const { error } = await supabase
            .from('calendar_sync')
            .delete()
            .eq('id', id);
    
        if (error) {
            console.error('Error deleting sync:', error);
            return false;
        }
       
        return true;
    }
export const gatAllCalendarSync=async():Promise<CalendarSync[]|null>=>{
const { data, error } =  await supabase
        .from('calendar_sync')
        .select('*')
    if (error) {
        console.error('Error fetching maps layout :', error);
        return null;
    }
    // const layouts = CalendarSyncModel.fromDatabaseFormatArray(data);


    return data;
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

    const layout = CalendarSyncModel.fromDatabaseFormat(data); 
   
    return layout;
}

export const createCalendarEvent=async( calendarId: string,
  event: CalendarEventInput,
  token: string,booking :BookingModel)=>{
const statusEvent=createEvent(calendarId, event, token);
const sync = new CalendarSyncModel({
    bookingId: booking.id, 
    calendarId: calendarId, 
    lastSyncAt: new Date().toISOString(), 
    syncStatus: CalendarSyncStatus.SYNCED, 
    syncErrors: [] // או undefined אם אין שגיאות
});
//אם יש קונפליקט של זמן
if(!statusEvent){
    sync.syncStatus = CalendarSyncStatus.CONFLICT; // אם האירוע לא נוצר בהצלחה
    // sync.syncErrors = ["Failed to create event in Google Calendar"];
}
//אם לא אושר ע"י מנהל או לא אושר בכלל
if(!booking.approvedBy){
sync.syncStatus=CalendarSyncStatus.PENDING
}
//אם ההוספה לא צלחה
if(!(await statusEvent).created){
    sync.syncStatus=CalendarSyncStatus.FAILED
}
const create=createCalendarSync(sync)

// // react- פונקציה זו מקבלת פרטי אירוע מ
// //שמחזירה סטטוס סינכרון createCalendarSync שולחת לפונקציה

// // approvedAt approvedBy ו-וגם יש הרשאה להזמנה  CalendarSyncStatus.SYNCED  במידה והסטטוס
// // נוצרה ע"י לאה שארר-createGoogleCalendarEvent(event)  מבצעת שליחה לפונקצית הוספת אירוע
// // calendarשתוסיף את האירוע  ב 

// //faild/pending אם הסטטוס ????

// // detectCalendarConflicts תתבצע שליחה ל conflict-אם הסטטוס 
// //תקבל את הקונפליקטים הקיימים
// //ותציג את ההצעות לפתרון הקונפליקטים

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

// export const updateCalendarSync=async(eventId:string)=>{
// //ע"י קוד אירוע  calendarSync  עדכון 
// //עדכון התאריך לנוכחי ושינוי סטטוס אם צריך
//  return null;
// }

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

