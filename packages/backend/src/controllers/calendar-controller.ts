import { validateEventInput } from '../utils/validateEventInput'; // או הנתיב הרלוונטי
import { Request, Response, NextFunction } from 'express';
import * as calendarService from '../services/calendar-service';
import { CalendarEventInput, DateISO } from '../../../../types/google'; // ודא שזה הנתיב הנכון

export async function createEventHandler(req: Request, res: Response, next: NextFunction) {
  const token = extractToken(req);
  if (!token) return next({ status: 401, message: 'Missing token' });

  const { calendarId } = req.params;
  const event: CalendarEventInput = req.body;

  try {
    validateEventInput(event); // ← כאן תופסת שגיאות לפני כל שליחה
    const createdEvent = await calendarService.createEvent(calendarId, event, token);
    res.status(201).json(createdEvent);
  } catch (err: any) {
    if (!err.status) err.status = 500;
    next(err);
  }
}

export async function listEventsHandler(req: Request, res: Response, next: NextFunction) {
  const token = extractToken(req);
  if (!token) return next({ status: 401, message: 'Missing token' });

  const { calendarId } = req.params;
  try {
    const events = await calendarService.getEvents(calendarId, token);
    res.json(events);
  } catch (err: any) {
    if (!err.status) err.status = 500;
    next(err);
  }
}

export async function deleteEventHandler(req: Request, res: Response, next: NextFunction) {
  const token = extractToken(req);
  if (!token) return next({ status: 401, message: 'Missing token' });

  const { calendarId, eventId } = req.params;
  try {
    await calendarService.deleteEvent(calendarId, eventId, token);
    res.sendStatus(204);
  } catch (err: any) {
    if (!err.status) err.status = 500;
    next(err);
  }
}

export async function updateEventHandler(req: Request, res: Response, next: NextFunction) {
  const token = extractToken(req);
  if (!token) return next({ status: 401, message: 'Missing token' });

  const { calendarId, eventId } = req.params;
  const updates: Partial<CalendarEventInput> = req.body;

  try {
    if (updates.start || updates.end) {
      validateEventInput({
        ...updates,
        start: updates.start!,
        end: updates.end!
      } as CalendarEventInput);
    }
    const updated = await calendarService.updateEvent(calendarId, eventId, updates, token);
    res.json(updated);
  } catch (err: any) {
    if (!err.status) err.status = 500;
    next(err);
  }
}

export async function checkFreeBusyHandler(req: Request, res: Response, next: NextFunction) {
  const token = extractToken(req);
  if (!token) return next({ status: 401, message: 'Missing token' });

  const { calendarId, start, end }: { calendarId: string, start: DateISO, end: DateISO } = req.body;

  try {
    const isFree = await calendarService.checkAvailability(calendarId, start, end, token);
    res.json({ available: isFree });
  } catch (err: any) {
    if (!err.status) err.status = 500;
    next(err);
  }
}

function extractToken(req: Request): string | null {
  const auth = req.headers.authorization;
  return auth?.startsWith('Bearer ') ? auth.split(' ')[1] : null;
}
