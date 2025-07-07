import { Request, Response } from 'express';
import * as CalendarService from '../services/googleCalendarBookingIntegration.service ';
import { CalendarSync } from 'shared-types';
import type { ID, UpdateGoogleCalendarEventRequest } from 'shared-types';
import { CalendarSyncModel } from '../models/calendarSync.model';

export const getGoogleCalendarEvents = async (req: Request, res: Response) => {
    try {
        const calendarId: string = req.params.calendarId;
        const token: string = req.params.token;
        const events = await CalendarService.getGoogleCalendarEvents(calendarId, token);
        res.status(200).json(events);
    } catch (error) {
        console.error('Error fetching Google Calendar events:', error);
        res.status(500).json({ message: 'Failed to fetch Google Calendar events', error: error });
    }
}

// export async function createWorkspaceMap(req: Request, res: Response) {
//   try {
//     const map = new WorkspaceMapModel(req.body)
//     const result = await workspaceMapService.createWorkspaceMap(map)
//     res.status(201).json(result)
//   } catch (error) {
//     res.status(500).json({ error: (error as Error).message })
//   }
// }
export const createCalendarSync = async (req: Request, res: Response) => {
    try {
        const sync = new CalendarSyncModel(req.body);
        const syncStatus = await CalendarService.createCalendarSync(sync);
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
    if (result) {
        res.status(200).json(result)
    }
    else {
        res.status(404).json({ error: 'Calendar sync not found' })
    }



}
// export const createCalendarEvent = async (req: Request, res: Response) => {
//     try {
//         const { calendarId, event, token, booking } = req.body;
//         const syncStatus = await CalendarService.createCalendarEvent(event, calendarId, token, booking);
//         res.status(200).json({ status: syncStatus });
//     } catch (error) {
//         console.error('Error creating calendar event:', error);
//         res.status(500).json({ message: 'Failed to create calendar event', error: error });
//     }
// }
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
        const id: string = req.params.id
        await CalendarService.deleteCalendarSync(id);
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
    
        const eventId: string = req.params.id;
        const updatedData = req.body;
        const updatedSync = new CalendarSyncModel(updatedData);
        const result =  await CalendarService.updateCalendarSync(eventId, updatedSync);
   if (result) {
            res.status(200).json(result);
        } else {
            res.status(500).json({ error: "Failed to update calendar sync" });
        }
}
// export async function updateWorkspaceMap(req: Request, res: Response) {
//         const mapId = req.params.id;
//         const updatedData = req.body;
//         const updatedMap = new WorkspaceMapModel(updatedData);
//     console.log('Prepared map data:', JSON.stringify(updatedMap, null, 2));
//         const result = await workspaceMapService.updateWorkspaceMap(mapId, updatedMap);
//         if (result) {
//             res.status(200).json(result);
//         } else {
//             res.status(500).json({ error: "Failed to update user" });
//         }
// }
export async function deleteCalendarSync(req: Request, res: Response) {
    try {
        await CalendarService.deleteCalendarSync(req.params.id)
        res.status(204).end()
    } catch (error) {
        res.status(500).json({ error: (error as Error).message })
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







