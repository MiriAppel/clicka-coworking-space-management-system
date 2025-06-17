import { Router } from 'express';
import {
  createEventHandler,
  listEventsHandler,
  deleteEventHandler,
  updateEventHandler,
  checkFreeBusyHandler
} from '../controllers/calendar-controller';

const router = Router();

router.post('/calendars/:calendarId/events', createEventHandler);
router.get('/calendars/:calendarId/events', listEventsHandler);
router.delete('/calendars/:calendarId/events/:eventId', deleteEventHandler);
router.patch('/calendars/:calendarId/events/:eventId', updateEventHandler);
router.post('/calendars/:calendarId/freeBusy', checkFreeBusyHandler);

export default router;
