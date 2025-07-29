import express from 'express';
import * as contractControler from '../controllers/contract.controller'; 
import { UserRole } from 'shared-types';
import { authorizeUser } from '../middlewares/authorizeUserMiddleware';


const routerContract = express.Router();

//  (GET)
routerContract.get('/ending-soon',authorizeUser([UserRole.ADMIN,UserRole.MANAGER]), contractControler.getContractsEndingSoon); 

routerContract.get('/', authorizeUser([UserRole.ADMIN,UserRole.MANAGER]), contractControler.getAllContracts); 

routerContract.get('/customer/:customerId',authorizeUser([UserRole.ADMIN,UserRole.MANAGER]), contractControler.getAllContractsByCustomerId);

routerContract.get('/:contractId', authorizeUser([UserRole.ADMIN,UserRole.MANAGER]), contractControler.getContractById);

// routerContract.get("/search", contractControler.searchContractsByText);


// (POST)
routerContract.post('/', authorizeUser([UserRole.ADMIN,UserRole.MANAGER]), contractControler.postNewContract); 

routerContract.post('documents', authorizeUser([UserRole.ADMIN,UserRole.MANAGER]),contractControler.postContractDocument); 

//  (PATCH)
routerContract.patch('/:contractId', authorizeUser([UserRole.ADMIN,UserRole.MANAGER]),contractControler.updateContract);

routerContract.put('/:contractId/document', authorizeUser([UserRole.ADMIN,UserRole.MANAGER]), contractControler.updateContractDocument);

routerContract.post('/customer/:customerId/document', authorizeUser([UserRole.ADMIN,UserRole.MANAGER]), contractControler.createOrUpdateContractWithDocument);

//  (DELETE)
routerContract.delete('documents/:customerId', authorizeUser([UserRole.ADMIN,UserRole.MANAGER]), contractControler.deleteContractDocument); 
routerContract.delete('/:contractId', authorizeUser([UserRole.ADMIN,UserRole.MANAGER]), contractControler.deleteContract); 

export default routerContract;