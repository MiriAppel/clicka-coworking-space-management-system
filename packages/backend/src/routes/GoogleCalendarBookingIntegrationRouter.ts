import { Router } from 'express';
import * as CalanderController from '../controllers/google-calendar-booking-integration.controller';

const router = Router();

// post
router.post('/create-calendar-event',CalanderController.createCalendarEvent)
router.post('/create-conflict',CalanderController.createConflict);
// get
router.get('/get-calendar-by-room/:roomId', CalanderController.getCalendarByRoom);
// put/patch
router.put('/sync-bookings', CalanderController.syncBookingsController);
router.put("/detect-calendar-conflicts",CalanderController.detectCalendarConflicts)
router.put('/solve-calendar-conflict', CalanderController.solveCalendarConflict);
router.put('/update-event-onchange-booking',CalanderController.updateEventOnChangeBooking)
router.put('/manage-calendar-permissions', CalanderController.manageCalendarPermissions);
router.put('/share-calendar', CalanderController.shareCalendar);
// delete
export default router;
