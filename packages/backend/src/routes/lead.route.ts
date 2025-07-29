import express from 'express';
import * as controllerLead from '../controllers/lead.controller';
import { UserRole } from 'shared-types';
import { authorizeUser } from '../middlewares/authorizeUserMiddleware';

const routerLead = express.Router();

routerLead.get('/by-page', authorizeUser([UserRole.ADMIN, UserRole.MANAGER, UserRole.SYSTEM_ADMIN]), controllerLead.getLeadsByPage);

routerLead.get("/search", authorizeUser([UserRole.ADMIN, UserRole.MANAGER, UserRole.SYSTEM_ADMIN]), controllerLead.searchLeadsByText);

routerLead.get('/', authorizeUser([UserRole.ADMIN, UserRole.MANAGER, UserRole.SYSTEM_ADMIN]), controllerLead.getAllLeads);

routerLead.get('/:id', authorizeUser([UserRole.ADMIN, UserRole.MANAGER, UserRole.SYSTEM_ADMIN]), controllerLead.getLeadById);

routerLead.post('/', authorizeUser([UserRole.ADMIN, UserRole.MANAGER]), controllerLead.createLead);

routerLead.get('/sources/:id', authorizeUser([UserRole.ADMIN, UserRole.MANAGER]), controllerLead.getSourcesLeadById);

routerLead.patch('/:id', authorizeUser([UserRole.ADMIN, UserRole.MANAGER]), controllerLead.patchLead);

routerLead.post('/upload/csv', authorizeUser([UserRole.ADMIN, UserRole.MANAGER]), controllerLead.postLeadFromCSV);

routerLead.get('/reminders/open', authorizeUser([UserRole.ADMIN, UserRole.MANAGER, UserRole.SYSTEM_ADMIN]), controllerLead.getLeadsToRemind);

routerLead.delete('/:id', authorizeUser([UserRole.ADMIN]), controllerLead.deleteLead);

routerLead.post('/:id/addInteraction', authorizeUser([UserRole.ADMIN, UserRole.MANAGER, UserRole.SYSTEM_ADMIN]), controllerLead.addInteractionToLead);

routerLead.delete('/:leadId/interactions/:interactionId', authorizeUser([UserRole.ADMIN, UserRole.MANAGER]), controllerLead.deleteInteraction);


export default routerLead;