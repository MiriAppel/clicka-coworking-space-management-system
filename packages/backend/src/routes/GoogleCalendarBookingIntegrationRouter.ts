import { Router } from 'express';
import * as CalanderController from '../controllers/googleCalendarBookingIntegration.controller';

const router = Router();

// post
router.post('/createSync', CalanderController.createCalendarSync);
router.post('/create', CalanderController.createCalendarEvent);

// get
router.get('/Allevents/:calendarId', CalanderController.getGoogleCalendarEvents);
router.get('/byRoom/:roomId', CalanderController.getCalendarByRoom);
// put/patch

router.put("/conflicts",CalanderController.detectCalendarConflicts)
// router.put('/solveConflict', CalanderController.solveCalendarConflict);
router.put('/update',CalanderController.updateEventOnChangeBooking)
router.put('/updateSync',CalanderController.updateCalendarSync);
router.put('/managePermissions', CalanderController.manageCalendarPermissions);
router.put('/share', CalanderController.shareCalendar);
// delete
router.delete('/event', CalanderController.deleteEvent);
router.delete('/enentSync/:eventId', CalanderController.deleteCalendarSyncByEventId);
export default router;
