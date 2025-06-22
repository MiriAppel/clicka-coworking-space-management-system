
import { CalendarConflict, CalendarSync, CalendarSyncStatus } from "../models/calendarSync.model";
import {SyncBookingsWithGoogleRequest} from "../models/calendarSync.model"
import { ID } from "../../../../types/core";
import {CreateGoogleCalendarEventRequest, DeleteGoogleCalendarEventRequest, GoogleCalendarEvent, UpdateGoogleCalendarEventRequest} from "../../../../types/google"

export const getGoogleCalendarEvents=async(calendarId: string):Promise<GoogleCalendarEvent[]|null>=>{
//שליפת כל האירועים לפי לוח
    return null; 
}

export const createCalendarSync=async(request: SyncBookingsWithGoogleRequest):Promise<CalendarSyncStatus>=>{
// פונקציה זו תבדוק האם ניתן להוסיף אירוע לחדר הרצוי בזמן הרצוי
//calendarSync ותיצר בהתאם לתוצאות אובייקט 
    return CalendarSyncStatus.SYNCED; // דוגמה להחזרת סטטוס סינכרון
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

