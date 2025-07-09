import express from 'express';
import * as customerController from '../controllers/customer.controller'; 
import * as contractController from '../controllers/contract.controller'

const routerCustomer = express.Router();

// (GET)
routerCustomer.get('/by-page', customerController.getCustomersByPage);

routerCustomer.get('/', customerController.getAllCustomers); 

routerCustomer.get('/page', customerController.getCustomersByPage); 

routerCustomer.get('/status/all', customerController.getAllCustomerStatus);

routerCustomer.get('/notify/:id', customerController.getCustomersToNotify); 

routerCustomer.get('/search', customerController.searchCustomersByText);

routerCustomer.get('/:id', customerController.getCustomerById); 

//(POST)
routerCustomer.post('/:id/exit-notice', customerController.postExitNotice); 

routerCustomer.post('/post-customer', customerController.postCustomer); 

//PATCH/PUT)
routerCustomer.patch('/:id', customerController.patchCustomer); 

routerCustomer.delete('/:id', customerController.deleteCustomer);

export default routerCustomer;

