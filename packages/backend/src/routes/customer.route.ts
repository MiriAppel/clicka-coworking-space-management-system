import express from 'express';
import * as customerController from '../controllers/customer.controller'; 
import * as contractController from '../controllers/contract.controller'

const router = express.Router();

// --- Customer Routes ---
// (GET)
router.get('/', customerController.getAllCustomers); 
router.get('/page', customerController.getCustomersByPage); 
router.get('/status/all', customerController.getAllStatus); 
router.get('/notify/:id', customerController.getCustomersToNotify); 
router.get('/history/:id', customerController.getHistoryChanges);
router.get('/status/history/:id', customerController.getStatusChanges); 
router.get('/id/:id', customerController.getCustomerById); 
router.get('/name/:name', customerController.getCustomerByName); 
router.get('/email/:email', customerController.getCustomerByEmail); 
router.get('/phone/:phone', customerController.getCustomerByPhone); 
router.get('/status/:status', customerController.getCustomerByStatus); 

//(POST)
router.post('/join-date', customerController.getByDateJoin); 
router.post('/export', customerController.exportToFile); 
router.post('/exit-notice', customerController.postExitNotice); 
router.post('/convert-lead', customerController.convertLeadToCustomer); 

//PATCH/PUT)
router.patch('/:id', customerController.patchCustomer); 
router.patch('/status/:id', customerController.patchStatus); 
router.put('/:id', customerController.putCustomer); 

// --- Contract Routes ---
//  (GET)
router.get('/contracts', contractController.getAllContracts); 
router.get('/contracts/ending-soon', contractController.getContractsEndingSoon); 
// router.get('/contracts/customer/:customerId', contractController.getAllContractsByCustomerId); //אפשר לגשת לחוזה רק דרך לקוח
router.get('/contracts/:contractId', contractController.getContractById); 

// (POST)
router.post('/contracts', contractController.postNewContract); 
router.post('/contracts/documents', contractController.postContractDocument); 

//  (PUT)
// router.put('/contracts/:contractId/terms', contractController.updateContractTerms); 

//  (DELETE)
router.delete('/contracts/documents/:id', contractController.deleteContractDocument); 

// --- Timeline Routes ---
// (GET)
router.get('/:customerId/timeline', customerController.getCustomerTimeline); 
router.get('/:customerId/timeline/export', customerController.exportTimeline); 

//  (POST)
router.post('/:customerId/timeline/event', customerController.addTimelineEvent); 

export default router;