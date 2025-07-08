import { Router } from 'express';
import authRouter from './auth';
import healthRouter from './health';
import calendarRouter from './calendar-route';
import driveRouter from './drive-route';
import gmailRouter from './gmail-route';
import pricingRouter from './pricing.route'

const router = Router();
<<<<<<< HEAD
router.use('/health', healthRouter);
router.use('/drive', driveRouter);
router.use('/calendar', calendarRouter);
router.use('/gmail', gmailRouter);
router.use('/', authRouter);
=======

router.use('/health', healthRouter);     
router.use('/drive', driveRouter);      
router.use('/calendar', calendarRouter);  
router.use('/gmail', gmailRouter);    
router.use('/pricing', pricingRouter);    
router.use('/', authRouter);             

>>>>>>> origin/main
export default router;
