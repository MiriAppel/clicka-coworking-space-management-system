
import type { CalendarEventInput, CreateGoogleCalendarEventRequest, DeleteGoogleCalendarEventRequest, GoogleCalendarEvent, ID, UpdateGoogleCalendarEventRequest } from "shared-types";
import { CalendarConflict, CalendarSync, CalendarSyncStatus } from "shared-types/calendarSync";
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv';
import { CalendarSyncModel } from "../models/calendarSync.model";
import { getEvents } from './calendar-service';
import { createEvent } from './calendar-service'
import { BookingModel } from "../models/booking.model";
import * as syncController from "../controllers/googleCalendarBookingIntegration.controller";
import {BookingService} from "./booking.service"
import { log } from "util";
import { Event } from "shared-types/google";
// טוען את משתני הסביבה מקובץ .env
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || ''; // החלף עם ה-URL של פרויקט ה-Supabase שלך
const supabaseAnonKey = process.env.SUPABASE_KEY || ''; // החלף עם ה-Anon Key שלך
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const getGoogleCalendarEvents = async (calendarId: string, token: string): Promise<Event[] | null> => {
    //שליפת כל האירועים לפי לוח
     const events = await getEvents(calendarId, token);
    //  console.log(events); // הדפס את האירועים המתקבלים

    // המרת האירועים לאובייקטים מסוג GoogleCalendarEvent
    const newEvents: Event[] = events.map(event => ({
        
    id: event.id || '',  // או זרוק שגיאה אם id לא קיים
    calendarId: calendarId,
    summary: event.summary || '',
    description: event.description || '',
    location: event.location || '',
    start: {
        dateTime: event.start?.dateTime || '',
        timeZone: event.start?.timeZone || '',
    },
    end: {
        dateTime: event.end?.dateTime || '',
        timeZone: event.end?.timeZone || '',
    },
    attendees: event.attendees ? event.attendees.map(attendee => ({
        email: attendee.email || '',
        displayName: attendee.displayName || '',
        // responseStatus: attendee.responseStatus,
    })) : [],
    // status:  BookingService.getBookingByEventId(event.id).status||"" , //
    status: "", // ← זה צריך להיות סטטוס ההזמנה, לא האירוע
    created: event.created || '',
    updated: event.updated || '',
    htmlLink: event.htmlLink || '',
}));

    return newEvents;
}

export const createCalendarSync = async (sync: CalendarSyncModel): Promise<CalendarSyncModel | null> => {
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
    const sync = CalendarSyncModel.fromDatabaseFormat(data);
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
export const gatAllCalendarSync = async (): Promise<CalendarSync[] | null> => {
    const { data, error } = await supabase
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
export async function convertBookingToCalendarEvent(booking: BookingModel): Promise<CalendarEventInput> {
    console.log("booking in in the convert\n",booking);
    
    let newName="";
    if(booking.customerName){
        newName = booking.customerName;
    }
    else if(booking.externalUserName){
        newName = booking.externalUserName;
    }
    return {
        summary: `פגישה עבור ${newName}`,
        description: booking.notes,
        location: booking.roomName,
        start: {
            dateTime: booking.startTime,
            timeZone: 'Asia/Jerusalem' // ניתן לשנות לפי הצורך
        },
        end: {
            dateTime: booking.endTime,
            timeZone: 'Asia/Jerusalem' // ניתן לשנות לפי הצורך
        },
        //לבדוק האם צריך להוסיף פרטים של לקוח קיים- אם משתמשים בכלל בעמודה
        attendees: booking.externalUserEmail ? [{ email: booking.externalUserEmail }] : [],
        reminders: {
            useDefault: true // או false, תלוי בצורך שלך
        }
    };
}
export const createCalendarEvent = async (calendarId: string,
    booking: BookingModel,
    token: string) => {
    // השלבים העדכניים של הפונקציה 
    //להמיר הזמנה לאירוע
    //להוסיף את האירוע בקלנדר
    //לקחת את הid שנוצר
    //ולהוסיף אותו לאובייקט המתאים במסד

    //אם ההזמנה לא מאושרת-אין אפשרות ליצור אירוע
    console.log('Booking object:', booking);
    console.log('token object:', token);
    console.log('calendarId object:', calendarId);
    
    console.log("booking before the convert\n",booking);
    const calendarEvent = await convertBookingToCalendarEvent(booking);
    try {
        const statusEvent = await createEvent(calendarId, calendarEvent, token);
        console.log("statusEvent\n", statusEvent);
        
        if (statusEvent.id != null) {
            booking.googleCalendarEventId = statusEvent.id;
        }
        console.log("booking.googleCalendarEventId",booking.googleCalendarEventId);
        

        //לעדכן את נאווה שחייבים לשלוח id
          if (!booking.id) {
            throw new Error('Booking ID is required to update the booking.');
          }
          console.log('Type of updatedData:', booking.constructor.name);

          console.log(booking, "booking in ??????????????????????????\n  ,",booking.id);
          
        const bookingModel = booking instanceof BookingModel
  ? booking
  : new BookingModel(booking);
await BookingService.updateBooking(bookingModel.id!, bookingModel);

       
    } catch (error) {
        console.log("checking the type of", error);

        let errorMessage = 'An unknown error occurred'; // הודעת שגיאה ברירת מחדל

        if (error instanceof Error) {
            errorMessage = error.message; // אם error הוא אובייקט שגיאה
        } else if (typeof error === 'string') {
            errorMessage = error; // אם error הוא מחרוזת
        }

         if (errorMessage.includes('Conflict detected')) {
        //     sync.syncStatus = CalendarSyncStatus.CONFLICT;
        //     //יש כאן בעיה - עובד או מוסיף אובייקט עם conflict 
        //     //ומחזיר 200
        //     //או זורק שגיאת 500...
        //     // throw new Error('Conflict detected: Unable to create event.');
         } else {
        //     sync.syncStatus = CalendarSyncStatus.FAILED;
        //     if (!sync.syncErrors) {
        //         sync.syncErrors = [];
        //     }
        //     sync.syncErrors.push(errorMessage);
         }

        // await createCalendarSync(sync);
    }

}

// export const createCalendarEvent = async (calendarId: string,
//     event: CalendarEventInput,
//     token: string, booking: string) => {
//     const sync = new CalendarSyncModel({
//         bookingId: booking,
//         calendarId: calendarId,
//         lastSyncAt: new Date().toISOString(),
//         syncStatus: CalendarSyncStatus.SYNCED,
//         syncErrors: []
//     });
//     try {
//         const statusEvent = await createEvent(calendarId, event, token);

//         if (!statusEvent || !statusEvent.id) {
//             sync.syncStatus = CalendarSyncStatus.FAILED; // במקרה ואין id
//         // } else if (!booking.approvedBy) {
//         //     sync.syncStatus = CalendarSyncStatus.PENDING;
//         } else {
//             sync.syncStatus = CalendarSyncStatus.SYNCED; // מסונכרן
//         }

//         await createCalendarSync(sync);
//     } catch (error) {
//         console.log("checking the type of",error);

//     let errorMessage = 'An unknown error occurred'; // הודעת שגיאה ברירת מחדל

//     if (error instanceof Error) {
//         errorMessage = error.message; // אם error הוא אובייקט שגיאה
//     } else if (typeof error === 'string') {
//         errorMessage = error; // אם error הוא מחרוזת
//     }

//     if (errorMessage.includes('Conflict detected')) {
//         sync.syncStatus = CalendarSyncStatus.CONFLICT;
//         //יש כאן בעיה - עובד או מוסיף אובייקט עם conflict 
//         //ומחזיר 200
//         //או זורק שגיאת 500...
//         // throw new Error('Conflict detected: Unable to create event.');
//     } else {
//         sync.syncStatus = CalendarSyncStatus.FAILED;
//         if (!sync.syncErrors) {
//             sync.syncErrors = [];
//         }
//         sync.syncErrors.push(errorMessage);
//     }

//     await createCalendarSync(sync);
// }

// }

// export const createCalendarEvent = async (calendarId: string,
//     event: CalendarEventInput,
//     token: string, booking: BookingModel) => {
//     try {
//         const statusEvent = createEvent(calendarId, event, token);
//         // const result = await createEvent(calendarId, event, token);

// // if (result.success) {
// //   console.log("Event created:", result.data);
// // } else if (result.conflict) {
// //   console.log(result.message);
// // } else {
// //   console.error("Failed to create event:", result.message);
// // }

//         const sync = new CalendarSyncModel({
//             bookingId: booking.id,
//             calendarId: calendarId,
//             lastSyncAt: new Date().toISOString(),
//             syncStatus: CalendarSyncStatus.SYNCED,
//             syncErrors: [] // או undefined אם אין שגיאות
//         });
//         //אם יש קונפליקט של זמן
//         // if (!statusEvent) {
//         //     sync.syncStatus = CalendarSyncStatus.CONFLICT; // אם האירוע לא נוצר בהצלחה
//         //     // sync.syncErrors = ["Failed to create event in Google Calendar"];
//         // }
//         // //אם לא אושר ע"י מנהל או לא אושר בכלל
//         // if (!booking.approvedBy) {
//         //     sync.syncStatus = CalendarSyncStatus.PENDING
//         // }
//         // //אם ההוספה לא צלחה
//         // if (!(await statusEvent).created) {
//         //     sync.syncStatus = CalendarSyncStatus.FAILED
//         // }
//         // Call the service-layer function directly since you don't have a Response object here
//         try {
//             const create = await createCalendarSync(sync);
//         } 
//         catch (error) {


//         }


//     } catch (error) {

// const sync = new CalendarSyncModel({
//             bookingId: booking.id,
//             calendarId: calendarId,
//             lastSyncAt: new Date().toISOString(),
//             syncStatus: CalendarSyncStatus.CONFLICT,
//             syncErrors: [] // או undefined אם אין שגיאות
//         });
//            try {
//             const create = await createCalendarSync(sync);
//         } 
//         catch (error) {


//         }
//     }



//     // // react- פונקציה זו מקבלת פרטי אירוע מ
//     // //שמחזירה סטטוס סינכרון createCalendarSync שולחת לפונקציה

//     // // approvedAt approvedBy ו-וגם יש הרשאה להזמנה  CalendarSyncStatus.SYNCED  במידה והסטטוס
//     // // נוצרה ע"י לאה שארר-createGoogleCalendarEvent(event)  מבצעת שליחה לפונקצית הוספת אירוע
//     // // calendarשתוסיף את האירוע  ב 

//     // //faild/pending אם הסטטוס ????

//     // // detectCalendarConflicts תתבצע שליחה ל conflict-אם הסטטוס 
//     // //תקבל את הקונפליקטים הקיימים
//     // //ותציג את ההצעות לפתרון הקונפליקטים

// }

export const detectCalendarConflicts = async (calendar: CalendarSync): Promise<CalendarConflict[]> => {
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


export const deleteEnevt = async (enevt: DeleteGoogleCalendarEventRequest) => {
    // פונקציה זו תמחק אירוע.
    // לאה שארר-deleteGoogleCalendarEvent ע"י שליחה לפונקצית מחיקה
    // המתאים calendarSync ותמחק את ה 
    //deleteCalendarSyncByEventId() ע"י הפונקציה 
}

export const deleteCalendarSyncByEventId = async (eventId: string) => {
    //מהמסד calendarSync מחיקת   
}

export const updateEnevtOnChangeBooking = async (updateDetails: UpdateGoogleCalendarEventRequest): Promise<void> => {
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

export const getCalendarByRoom = async (roomId: ID): Promise<CalendarSync | null> => {
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

