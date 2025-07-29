import express from 'express';
import * as customerController from '../controllers/customer.controller';
import { UserRole } from 'shared-types'; 
import { authorizeUser } from '../middlewares/authorizeUserMiddleware';

const routerCustomer = express.Router();

// (GET)
// routerCustomer.get('/by-page', customerController.getCustomersByPage);

routerCustomer.get('/confirm-email/:id/:email', customerController.confirmEmail);

routerCustomer.get('/sendEmailWithContract/:link', customerController.sendContractEmail)

routerCustomer.get('/page', authorizeUser([UserRole.ADMIN, UserRole.MANAGER]), customerController.getCustomersByPage); 

routerCustomer.get('/', authorizeUser([UserRole.ADMIN, UserRole.MANAGER]), customerController.getAllCustomers); 

routerCustomer.get('/status/all', authorizeUser([UserRole.ADMIN, UserRole.MANAGER,]), customerController.getAllCustomerStatus);

routerCustomer.get('/notify/:id', authorizeUser([UserRole.ADMIN, UserRole.MANAGER,UserRole.SYSTEM_ADMIN]), customerController.getCustomersToNotify); 

routerCustomer.get('/search', authorizeUser([UserRole.ADMIN, UserRole.MANAGER,UserRole.SYSTEM_ADMIN]), customerController.searchCustomersByText);

routerCustomer.get('/:id', authorizeUser([UserRole.ADMIN, UserRole.MANAGER, UserRole.SYSTEM_ADMIN]), customerController.getCustomerById); 

routerCustomer.get('/:id/payment-methods', authorizeUser([UserRole.ADMIN, UserRole.MANAGER]), customerController.getCustomerPaymentMethods);

//(POST)
routerCustomer.post('/:id/exit-notice', authorizeUser([UserRole.ADMIN, UserRole.MANAGER]), customerController.postExitNotice); 

routerCustomer.post('/post-customer', authorizeUser([UserRole.ADMIN, UserRole.MANAGER]), customerController.postCustomer); 

routerCustomer.post('/:id/status-change', authorizeUser([UserRole.ADMIN, UserRole.MANAGER]), customerController.changeCustomerStatus)

//PATCH/PUT)

routerCustomer.patch('/:id', authorizeUser([UserRole.ADMIN, UserRole.MANAGER]), customerController.patchCustomer); 

routerCustomer.delete('/:id', authorizeUser([UserRole.ADMIN]), customerController.deleteCustomer);

export default routerCustomer;

