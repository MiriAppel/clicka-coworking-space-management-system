import express from 'express';
import * as controllerLead from '../controllers/lead.controller'; 

const routerLead = express.Router();

routerLead.get('/', controllerLead.getAllLeads);

routerLead.get('/:id', controllerLead.getLeadById);

routerLead.post('/', controllerLead.createLead);

routerLead.get('/sources/:id', controllerLead.getSourcesLeadById);


routerLead.patch('/:id', controllerLead.patchLead);

routerLead.post('/upload/csv', controllerLead.postLeadFromCSV);

routerLead.get('/reminders/open', controllerLead.getLeadsToRemind);

routerLead.get('/filter/customers', controllerLead.getLeadsByFilter);

routerLead.delete('/:id', controllerLead.deleteLead);


export default routerLead;