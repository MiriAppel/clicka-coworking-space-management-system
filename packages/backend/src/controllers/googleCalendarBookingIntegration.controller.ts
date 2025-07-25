import { Request, Response, NextFunction } from 'express';
import * as CalendarService from '../services/googleCalendarBookingIntegration.service ';
import { CalendarSync } from 'shared-types/calendarSync';
import type { CalendarEventInput, ID, UpdateGoogleCalendarEventRequest } from 'shared-types';
import { CalendarSyncModel } from '../models/calendarSync.model';
import { validateEventInput } from '../utils/validateEventInput';
import { BookingModel } from '../models/booking.model';
import { UserTokenService } from '../services/userTokenService';

const userTokenService = new UserTokenService();

export const getGoogleCalendarEvents = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = await userTokenService.getSystemAccessToken();
    if (!token) return next({ status: 401, message: 'Missing system token' });

    const calendarId: string = req.params.calendarId;
    const events = await CalendarService.getGoogleCalendarEvents(calendarId, token);
    res.status(200).json(events);
  } catch (error) {
    console.error('Error fetching Google Calendar events:', error);
    res.status(500).json({ message: 'Failed to fetch Google Calendar events', error });
  }
};

export const createCalendarEvent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = await userTokenService.getSystemAccessToken();
    if (!token) return next({ status: 401, message: 'Missing system token' });

    const { calendarId } = req.params;
    const booking = req.body.booking || req.body.body?.booking;

    if (!booking) {
      return res.status(400).json({ message: 'Missing booking data' });
    }

    const createdEvent = await CalendarService.createCalendarEvent(calendarId, booking, token);
    res.status(201).json(createdEvent);
  } catch (err: any) {
    next({ status: err.status || 500, message: err.message || 'Failed to create calendar event' });
  }
};

export const getAllCalendarSync = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = await userTokenService.getSystemAccessToken();
    if (!token) return next({ status: 401, message: 'Missing system token' });

    const calendarId: string = req.params.calendarId;
    const result = await CalendarService.getGoogleCalendarEvents(calendarId, token);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getCalendarSyncById = async (req: Request, res: Response) => {
  const syncId: string = req.params.id;
  const result = await CalendarService.getCalendarSyncById(syncId);
  if (result) {
    res.status(200).json(result);
  } else {
    res.status(404).json({ error: 'Calendar sync not found' });
  }
};

export const deleteEvent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await CalendarService.deleteEnevt(req.body); // ודאי שהשם ב־service הוא deleteEvent
    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ message: 'Failed to delete event', error });
  }
};

export const deleteCalendarSyncByEventId = async (req: Request, res: Response) => {
  try {
    const id: string = req.params.id;
    await CalendarService.deleteCalendarSync(id);
    res.status(200).json({ message: 'Calendar sync deleted successfully' });
  } catch (error) {
    console.error('Error deleting calendar sync by event ID:', error);
    res.status(500).json({ message: 'Failed to delete calendar sync', error });
  }
};

export const updateEventOnChangeBooking = async (req: Request, res: Response) => {
  try {
    const updateDetails: UpdateGoogleCalendarEventRequest = req.body;
    await CalendarService.updateEnevtOnChangeBooking(updateDetails); // ודאי שהשם נכון
    res.status(200).json({ message: 'Event updated successfully' });
  } catch (error) {
    console.error('Error updating event on change booking:', error);
    res.status(500).json({ message: 'Failed to update event on change booking', error });
  }
};

export const deleteCalendarSync = async (req: Request, res: Response) => {
  try {
    await CalendarService.deleteCalendarSync(req.params.id);
    res.status(204).end();
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

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
    res.status(500).json({ message: 'Failed to get calendar by room', error });
  }
};

export const manageCalendarPermissions = async (req: Request, res: Response) => {
  try {
    const { calendarId, email, role } = req.body;
    await CalendarService.manageCalendarPermissions(calendarId, email, role);
    res.status(200).json({ message: 'Calendar permissions managed successfully' });
  } catch (error) {
    console.error('Error managing calendar permissions:', error);
    res.status(500).json({ message: 'Failed to manage calendar permissions', error });
  }
};

export const shareCalendar = async (req: Request, res: Response) => {
  try {
    const { calendarId, email } = req.body;
    await CalendarService.shareCalendar(calendarId, email);
    res.status(200).json({ message: 'Calendar shared successfully' });
  } catch (error) {
    console.error('Error sharing calendar:', error);
    res.status(500).json({ message: 'Failed to share calendar', error });
  }
};
