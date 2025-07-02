import { Request, Response } from 'express';
import * as CalendarService from '../services/googleCalendarBookingIntegration.service ';

import { SyncBookingsWithGoogleRequest } from 'shared-types/booking';
import { CalendarSync, CalendarSyncStatus } from 'shared-types/calendarSync';
import type{ ID, UpdateGoogleCalendarEventRequest } from 'shared-types';

export const getGoogleCalendarEvents = async (req: Request, res: Response) => {
    try {
        const calendarId: string = req.params.calendarId;
        const token: string = req.params.token;
        const events = await CalendarService.getGoogleCalendarEvents(calendarId,token);
        res.status(200).json(events);
    } catch (error) {
        console.error('Error fetching Google Calendar events:', error);
        res.status(500).json({ message: 'Failed to fetch Google Calendar events', error: error });
    }
}
export const createCalendarSync = async (req: Request, res: Response) => {
    try {
        const request: SyncBookingsWithGoogleRequest = req.body;
        const syncStatus = await CalendarService.createCalendarSync(request);
        res.status(200).json({ status: syncStatus });
    } catch (error) {
        console.error('Error creating calendar sync:', error);
        res.status(500).json({ message: 'Failed to create calendar sync', error: error });
    }
}
export async function getAllCalendarSync(req: Request, res: Response) {
  try {
    const result = await CalendarService.gatAllCalendarSync()
    res.json(result)
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
}
export async function getCalendarSyncById(req: Request, res: Response) {
const syncId = req.params.id;
    const result = await CalendarService.getCalendarSyncById(syncId)
   if(result){
    res.status(200).json(result)
   }
   else{
    res.status(404).json({ error: 'Map not found' })
   }

   
  
}
export const createCalendarEvent = async (req: Request, res: Response) => {
    try {
        const event = req.body;
        const syncStatus = await CalendarService.createCalendarEvent(event);
        res.status(200).json({ status: syncStatus });
    } catch (error) {
        console.error('Error creating calendar event:', error);
        res.status(500).json({ message: 'Failed to create calendar event', error: error });
    }
}
export const detectCalendarConflicts = async (req: Request, res: Response) => {
    try {
        const calendar: CalendarSync = req.body;
        const conflicts = await CalendarService.detectCalendarConflicts(calendar);
        res.status(200).json(conflicts);
    } catch (error) {
        console.error('Error detecting calendar conflicts:', error);
        res.status(500).json({ message: 'Failed to detect calendar conflicts', error: error });
    }
}
export const deleteEvent = async (req: Request, res: Response) => {
    try {
        const updateDetails = req.body;
        await CalendarService.deleteEnevt(updateDetails);
        res.status(200).json({ message: 'Event deleted successfully' });
    } catch (error) {
        console.error('Error deleting event:', error);
        res.status(500).json({ message: 'Failed to delete event', error: error });
    }
}
export const deleteCalendarSyncByEventId = async (req: Request, res: Response) => {
    try {
        const eventId: string = req.params.eventId;
        await CalendarService.deleteCalendarSyncByEventId(eventId);
        res.status(200).json({ message: 'Calendar sync deleted successfully' });
    } catch (error) {
        console.error('Error deleting calendar sync by event ID:', error);
        res.status(500).json({ message: 'Failed to delete calendar sync', error: error });
    }
}
export const updateEventOnChangeBooking = async (req: Request, res: Response) => {
    try {
        const updateDetails: UpdateGoogleCalendarEventRequest = req.body;
        await CalendarService.updateEnevtOnChangeBooking(updateDetails);
        res.status(200).json({ message: 'Event updated successfully' });
    } catch (error) {
        console.error('Error updating event on change booking:', error);
        res.status(500).json({ message: 'Failed to update event on change booking', error: error });
    }
}

export const updateCalendarSync = async (req: Request, res: Response) => {
    try {
        const eventId: string = req.params.eventId;
        await CalendarService.updateCalendarSync(eventId);
        res.status(200).json({ message: 'Calendar sync updated successfully' });
    } catch (error) {
        console.error('Error updating calendar sync:', error);
        res.status(500).json({ message: 'Failed to update calendar sync', error: error });
    }
}

export const getCalendarByRoom = async (req: Request, res: Response) => {
    try {
        const roomId: ID = req.params.roomId;
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
}

export const manageCalendarPermissions = async (req: Request, res: Response) => {
    try {
        const { calendarId, email, role } = req.body;
        await CalendarService.manageCalendarPermissions(calendarId, email, role);
        res.status(200).json({ message: 'Calendar permissions managed successfully' });
    } catch (error) {
        console.error('Error managing calendar permissions:', error);
        res.status(500).json({ message: 'Failed to manage calendar permissions', error: error });
    }
}

export const shareCalendar = async (req: Request, res: Response) => {
    try {
        const { calendarId, email } = req.body;
        await CalendarService.shareCalendar(calendarId, email);
        res.status(200).json({ message: 'Calendar shared successfully' });
    } catch (error) {
        console.error('Error sharing calendar:', error);
        res.status(500).json({ message: 'Failed to share calendar', error: error });
    }
}







