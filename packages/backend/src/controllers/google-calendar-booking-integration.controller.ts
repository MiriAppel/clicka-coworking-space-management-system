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
