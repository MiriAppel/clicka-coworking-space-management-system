import  express  from "express";
import * as OccupancyTrendControllers from '../controllers/occupancyTrend.controllers';

const router=express.Router();
router.get('/:id/report',OccupancyTrendControllers.getSnapshotReport);
router.get('/client/:customerId/calculate', OccupancyTrendControllers.calculateClientOccupancySnapshot);
router.post('/dontsent', OccupancyTrendControllers.sendOccupancyAlert);
router.post('/capacity',OccupancyTrendControllers.checkAndTriggerAlert);
router.post('/rate',OccupancyTrendControllers.calculateOccupancyRate);
router.post('/client/:customerId/integrate', OccupancyTrendControllers.integraionCustomer);
router.put('/:id', OccupancyTrendControllers.updateTrend);
router.put('/:id/archive',OccupancyTrendControllers.archiveOldTrend);
router.get('/:id/export', OccupancyTrendControllers.exportOccupancyTrendToCSV);



export default router;


