import { CalendarConflict } from "../models/google-calendar-booking-integration/calendarConflict";
import { CalendarSync, CalendarSyncStatus } from "../models/google-calendar-booking-integration/calendarSync";
import { SyncBookingsWithGoogleRequest } from "../models/google-calendar-booking-integration/syncBookingsWithGoogleReques";

export const syncBookingsWithGoogle=async(request: SyncBookingsWithGoogleRequest):Promise< CalendarSyncStatus>=>{
     //Google Calendar פונקציה זו תסנכרן את ההזמנות עם 
     // בצורה דו כיוונית
    //  CalendarSyncStatus-ותחזיר אובייקט עם מצב הסנכרון 
    //  ותחזיר googleEventId לכל הזמנה שסונכרנה.?????
//moment-timezone  כדי להמיר בין אזורי זמן. אפשר להשתמש ב
    return CalendarSyncStatus.SYNCED; // דוגמה להחזרת סטטוס סינכרון
}
export const createCalendarEvent=async(calendar:CalendarSync):Promise<string>=>{
//   Google פונקציה זו תיצור אירועים בלוח השנה של 
//  אוטומטית כאשר הזמנה חדשה מתבצעת
//  היא תוודא שהאירוע נוצר עם הפרטים הנכונים
// ותחזיר את ה- googleEventId של האירוע שנוצר.
//  לשים לב לבדוק האם האירוע כבר קיים
//לכל הזמנה( approvedByו approvedAt- לשים לב רק להזמנות שאושרו (יש מאפיין

// בעת יצירת אירוע יש לשלוח לפונקציה detectCalendarConflicts
   return calendar.googleEventId; 
}
export const detectCalendarConflicts=async(calendar:CalendarSync):Promise<CalendarConflict[]>=>{
       const conflicts: CalendarConflict[] = [];
// פונקציה זו תזהה קונפליקטים בלוח השנה על בסיס ההזמנות הקיימות.
//  היא תבדוק האם יש חפיפות בזמנים או בעיות אחרות  
// ROOM_CONFLICT או PERMISSION_ERROR.
//ותןסיף קונפליקטים לרשימה אם ישנם
   return conflicts; 
}
export const solveCalendarConflict=async(conflict:CalendarConflict):Promise<void>=>{
   // פונקציה זו תקבל קונפליקט ובהתאם 
   //   תבצע שינוי בפרטי ההזמנה type ל
   //כך שהקונפליקט יפתר
}

export const updateEnevtOnChangeBooking=async(updateDetails:CalendarSync):Promise<void>=>{
 // פונקציה זו תעדכן אירוע קיים בלוח השנה כאשר פרטי ההזמנה משתנים.
}
export const getCalendarByRoom = async (roomId: string): Promise<CalendarSync|null> => {
   //  לקבלת לוח שנה עפ"י קוד חדר
return null;
}

// export const shareCalendar = async (calendarId: string, email: string): Promise<void> => {
//     //  שימוש ב-Google Calendar API כדי לשתף את לוח השנה עם כתובת מייל
// }
// export const manageCalendarPermissions = async (calendarId: string, permissions: any): Promise<void> => {
//     //    הלוגיקה לניהול ההרשאות,  באמצעות Google Calendar API
// }
export const manageCalendarPermissions = async (calendarId: string, email: string, role?: string): Promise<void> => {
    //Google Calendar API כדי לנהל את ההרשאות
    // לדוגמה, אפשר להשתמש ב-ACL (Access Control Lists) כדי להוסיף או לעדכן הרשאות
}
export const shareCalendar = async (calendarId: string, email: string): Promise<void> => {
    // השתמש ב-Google Calendar API כדי לשתף את לוח השנה עם כתובת המייל
}

