import express from 'express';
import * as customerController from '../controllers/customer.controller';

const router = express.Router();

// שליפות
router.get('/', customerController.getAllCustomers);
router.get('/status/all', customerController.getAllStatus);
router.get('/notify/:id', customerController.getCustomersToNotify);
router.get('/history/:id', customerController.getHistoryChanges);
router.get('/status/history/:id', customerController.getStatusChanges);
router.get('/id/:id', customerController.getCustomerById);
router.get('/name/:name', customerController.getCustomerByName);
router.get('/email/:email', customerController.getCustomerByEmail);
router.get('/phone/:phone', customerController.getCustomerByPhone);
router.get('/status/:status', customerController.getCustomerByStatus);

// POST
router.post('/join-date', customerController.getByDateJoin);
router.post('/export', customerController.exportToFile);
router.post('/exit-notice', customerController.postExitNotice);

// PATCH
router.patch('/status/:id', customerController.patchStatus);

// PUT
router.put('/:id', customerController.putCustomer);

export default router;
