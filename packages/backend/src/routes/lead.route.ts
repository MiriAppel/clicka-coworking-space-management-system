import express from 'express';
import * as leadController from '../controllers/lead.controller'; 

const router = express.Router();

// שליפות
router.get('/', leadController.getAllLeads);
router.get('/remind', leadController.getLeadToRemind);
router.get('/email/:email', leadController.getLeadByEmail);
router.get('/phone/:phone', leadController.getLeadByPhone);
router.get('/name/:name', leadController.getLeadByName);
router.get('/status/:status', leadController.getLeadByStatus);
router.get('/source/:source', leadController.getLeadBySource);
router.get('/:id', leadController.getLeadById);
router.get('/:id/sources', leadController.getSourcesLeadById);
router.get('/:leadId/check-customer', leadController.checkIfLeadBecomesCustomer);

// יצירה
router.post('/', leadController.createLead);
router.post('/csv', leadController.addLeadFromCSV);
router.post('/interaction', leadController.addInteractionToLead);

// עדכון
router.put('/:id', leadController.fullUpdateLead);
router.put('/:id/interactions', leadController.updateInteractions);

export default router;
