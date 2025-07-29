import express from 'express';
import * as customerController from '../controllers/customer.controller';
import { UserRole } from 'shared-types'; 
import { authorizeUser } from '../middlewares/authorizeUserMiddleware';

const routerCustomer = express.Router();

// (GET)
// routerCustomer.get('/by-page', customerController.getCustomersByPage);

routerCustomer.get('/confirm-email/:id/:email', customerController.confirmEmail);

routerCustomer.get('/sendEmailWithContract/:link', customerController.sendContractEmail)

routerCustomer.get('/page', customerController.getCustomersByPage); 

routerCustomer.get('/', customerController.getAllCustomers); 

routerCustomer.get('/status/all', customerController.getAllCustomerStatus);

routerCustomer.get('/notify/:id',  customerController.getCustomersToNotify); 

routerCustomer.get('/search',  customerController.searchCustomersByText);

routerCustomer.get('/:id', customerController.getCustomerById); 

routerCustomer.get('/:id/payment-methods',  customerController.getCustomerPaymentMethods);

//(POST)
routerCustomer.post('/:id/exit-notice',  customerController.postExitNotice); 

routerCustomer.post('/post-customer',  customerController.postCustomer); 

routerCustomer.post('/:id/status-change', customerController.changeCustomerStatus)

//PATCH/PUT)

routerCustomer.patch('/:id',  customerController.patchCustomer); 

routerCustomer.delete('/:id', customerController.deleteCustomer);

export default routerCustomer;

