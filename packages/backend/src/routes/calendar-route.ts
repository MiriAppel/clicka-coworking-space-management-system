import { Router } from 'express';
import {
  postEvent,
  getListEvents,
  deleteEvent,
  putEvent,
  getFreeBusy
} from '../controllers/calendar-controller';

const router = Router();

router.post('/calendars/:calendarId/events', postEvent);
router.get('/calendars/:calendarId/events', getListEvents);
router.delete('/calendars/:calendarId/events/:eventId', deleteEvent);
router.patch('/calendars/:calendarId/events/:eventId', putEvent);
router.post('/calendars/:calendarId/freeBusy', getFreeBusy);

export default router;
