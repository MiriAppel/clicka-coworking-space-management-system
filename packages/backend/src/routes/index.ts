import { Router } from 'express';
import authRouter from './auth';
import healthRouter from './health';
import calendarRouter from './calendar-route';
import driveRouter from './drive-route';
import gmailRouter from './gmail-route';

const router = Router();

router.use('/health', healthRouter);     
router.use('/drive', driveRouter);      // <--- שים את זה לפני ה־auth // /api/health
router.use('/calendar', calendarRouter);  // /api/calendar/...
router.use('/gmail', gmailRouter);        // /api/gmail/...
router.use('/', authRouter);              // /api/google, /api/verify וכו'

export default router;
