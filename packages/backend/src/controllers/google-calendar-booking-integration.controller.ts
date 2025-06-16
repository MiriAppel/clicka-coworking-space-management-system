import { Request, Response } from 'express';
import * as CalendarService from '../services/google-calendar-booking-integration.service ';

import { SyncBookingsWithGoogleRequest } from '../models/google-calendar-booking-integration/syncBookingsWithGoogleReques';
import { CalendarSync, CalendarSyncStatus } from '../models/google-calendar-booking-integration/calendarSync';

export const syncBookingsController = async (req: Request, res: Response): Promise<void> => {
    try {
        const request: SyncBookingsWithGoogleRequest = req.body; // קבל את הבקשה מה-body של הבקשה
        const syncStatus: CalendarSyncStatus = await CalendarService.syncBookingsWithGoogle(request); // קרא לפונקציה לסינכרון
        res.status(200).json({ status: syncStatus }); // החזר את הסטטוס בתגובה
    } catch (error) {
        console.error('Error syncing bookings with Google:', error);
        res.status(500).json({ message: 'Failed to sync bookings with Google', error: error });
    }
};

export const createCalendarEvent = async (req: Request, res: Response): Promise<void> => {
    try {
        const request: CalendarSync = req.body; 
        const isOk: string = await CalendarService.createCalendarEvent(request); 
        res.status(200).json({ status: isOk }); // החזר את הסטטוס בתגובה
    } catch (error) {
        console.error('Error in create calendar event:', error);
        res.status(500).json({ message: 'Failed in create calendar event', error: error });
    }
};
export const detectCalendarConflicts = async (req: Request, res: Response): Promise<void> => {
    try {
        const request: CalendarSync = req.body; 
        const conflicts = await CalendarService.detectCalendarConflicts(request); 
        res.status(200).json({ conflicts }); // החזר את הקונפליקטים בתגובה
    } catch (error) {
        console.error('Error detecting calendar conflicts:', error);
        res.status(500).json({ message: 'Failed to detect calendar conflicts', error: error });
    }
};
export const solveCalendarConflict = async (req: Request, res: Response): Promise<void> => {
    try {
        const conflict = req.body; // קבל את הקונפליקט מה-body של הבקשה
        await CalendarService.solveCalendarConflict(conflict); // קרא לפונקציה לפתרון הקונפליקט
        res.status(200).json({ message: 'Conflict resolved successfully' }); // החזר הודעת הצלחה
    } catch (error) {
        console.error('Error solving calendar conflict:', error);
        res.status(500).json({ message: 'Failed to solve calendar conflict', error: error });
    }
};
export const updateEventOnChangeBooking = async (req: Request, res: Response): Promise<void> => {
    try {
        const updateDetails: CalendarSync = req.body; // קבל את פרטי העדכון מה-body של הבקשה
        await CalendarService.updateEnevtOnChangeBooking(updateDetails); // קרא לפונקציה לעדכון האירוע
        res.status(200).json({ message: 'Event updated successfully' }); // החזר הודעת הצלחה
    } catch (error) {
        console.error('Error updating event on change booking:', error);
        res.status(500).json({ message: 'Failed to update event on change booking', error: error });
    }
};
export const getCalendarByRoom = async (req: Request, res: Response): Promise<void> => {
    try {
        const roomId: string = req.params.roomId; // קבל את קוד החדר מהפרמטרים של הבקשה
        const calendar = await CalendarService.getCalendarByRoom(roomId); // קרא לפונקציה לקבלת לוח השנה
        if (calendar) {
            res.status(200).json(calendar); // החזר את לוח השנה אם נמצא
        } else {
            res.status(404).json({ message: 'Calendar not found for the specified room' }); // החזר הודעת שגיאה אם לא נמצא
        }
    } catch (error) {
        console.error('Error getting calendar by room:', error);
        res.status(500).json({ message: 'Failed to get calendar by room', error: error });
    }
};
export const shareCalendar = async (req: Request, res: Response): Promise<void> => {
    try {        
        const { calendarId, email } = req.body; // קבל את מזהה לוח השנה וכתובת המייל מה-body של הבקשה
        await CalendarService.shareCalendar(calendarId, email); // קרא לפונקציה לשיתוף לוח השנה  
        res.status(200).json({ message: 'Calendar shared successfully' }); // החזר הודעת הצלחה
    } catch (error) {       
        console.error('Error sharing calendar:', error);
        res.status(500).json({ message: 'Failed to share calendar', error: error }); // החזר הודעת שגיאה     
    }
};



