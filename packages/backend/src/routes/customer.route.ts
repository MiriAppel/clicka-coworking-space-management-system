import express from 'express';
import * as customerController from '../controllers/customer.controller'; 
import * as contractController from '../controllers/contract.controller'

const routerCstomer = express.Router();

// (GET)

routerCstomer.get('/', customerController.getAllCustomers); 

routerCstomer.get('/page', customerController.getCustomersByPage); 

routerCstomer.get('/status/all', customerController.getAllCustomerStatus);

routerCstomer.get('/notify/:id', customerController.getCustomersToNotify); 

routerCstomer.get('/id/:id', customerController.getCustomerById); 

routerCstomer.get('/filter', customerController.getCustomersByFilter);

//(POST)
routerCstomer.post('/:id/exit-notice', customerController.postExitNotice); 

routerCstomer.post('/post-customer', customerController.postCustomer); 

//PATCH/PUT)
routerCstomer.patch('/:id', customerController.patchCustomer); 

routerCstomer.delete('/:id', customerController.deleteCustomer);

export default routerCstomer;

