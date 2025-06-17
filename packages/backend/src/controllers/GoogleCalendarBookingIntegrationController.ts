import { Request, Response } from 'express';
import * as CalendarService from '../services/GoogleCalendarBookingIntegrationService ';

import { SyncBookingsWithGoogleRequest } from '../models/GoogleCalendarBookingIntegration/SyncBookingsWithGoogleReques';
import { CalendarSync, CalendarSyncStatus } from '../models/GoogleCalendarBookingIntegration/CalendarSync';

export const syncBookingsController = async (req: Request, res: Response) => {
    try {
        const request: SyncBookingsWithGoogleRequest = req.body;
        const syncStatus: CalendarSyncStatus = await CalendarService.syncBookingsWithGoogle(request); 
        res.status(200).json({ status: syncStatus }); 
    } catch (error) {
        console.error('Error syncing bookings with Google:', error);
        res.status(500).json({ message: 'Failed to sync bookings with Google', error: error });
    }
};

export const createCalendarEvent = async (req: Request, res: Response) => {
    try {
        const request: CalendarSync = req.body; 
        const isOk: string = await CalendarService.createCalendarEvent(request); 
        res.status(200).json({ status: isOk }); 
    } catch (error) {
        console.error('Error in create calendar event:', error);
        res.status(500).json({ message: 'Failed in create calendar event', error: error });
    }
};
export const detectCalendarConflicts = async (req: Request, res: Response)=> {
    try {
        const request: CalendarSync = req.body; 
        const conflicts = await CalendarService.detectCalendarConflicts(request); 
        res.status(200).json({ conflicts }); 
    } catch (error) {
        console.error('Error detecting calendar conflicts:', error);
        res.status(500).json({ message: 'Failed to detect calendar conflicts', error: error });
    }
};
export const createConflict = async (req: Request, res: Response) => {
    try {
        const { bookingId, googleEventId } = req.body; 
        const conflict = await CalendarService.createConflict(bookingId, googleEventId); 
        if (conflict) {
            res.status(201).json(conflict); 
        } else {
            res.status(404).json({ message: 'Conflict not found' });
        }
    } catch (error) {
        console.error('Error creating conflict:', error);   
        res.status(500).json({ message: 'Failed to create conflict', error: error });
    }
}
export const solveCalendarConflict = async (req: Request, res: Response)=> {
    try {
        const conflict = req.body; 
        await CalendarService.solveCalendarConflict(conflict);
        res.status(200).json({ message: 'Conflict resolved successfully' }); 
    } catch (error) {
        console.error('Error solving calendar conflict:', error);
        res.status(500).json({ message: 'Failed to solve calendar conflict', error: error });
    }
};
export const updateEventOnChangeBooking = async (req: Request, res: Response) => {
    try {
        const updateDetails: CalendarSync = req.body; 
        await CalendarService.updateEnevtOnChangeBooking(updateDetails); 
        res.status(200).json({ message: 'Event updated successfully' }); 
    } catch (error) {
        console.error('Error updating event on change booking:', error);
        res.status(500).json({ message: 'Failed to update event on change booking', error: error });
    }
};
export const getCalendarByRoom = async (req: Request, res: Response) => {
    try {
        const roomId: string = req.params.roomId;
        const calendar = await CalendarService.getCalendarByRoom(roomId); 
        if (calendar) {
            res.status(200).json(calendar); 
        } else {
            res.status(404).json({ message: 'Calendar not found for the specified room' });
        }
    } catch (error) {
        console.error('Error getting calendar by room:', error);
        res.status(500).json({ message: 'Failed to get calendar by room', error: error });
    }
};
export const shareCalendar = async (req: Request, res: Response) => {
    try {        
        const { calendarId, email } = req.body; 
        await CalendarService.shareCalendar(calendarId, email);  
        res.status(200).json({ message: 'Calendar shared successfully' });
    } catch (error) {       
        console.error('Error sharing calendar:', error);
        res.status(500).json({ message: 'Failed to share calendar', error: error });    
    }
};
export const manageCalendarPermissions = async (req: Request, res: Response) => {
    try {        
        const { calendarId, email } = req.body;
        await CalendarService.manageCalendarPermissions(calendarId, email); 
        res.status(200).json({ message: ' manage permission successfully' }); 
    } catch (error) {       
        console.error('Error manage permission:', error);
        res.status(500).json({ message: 'Failed to manage permission', error: error });    
    }
};



