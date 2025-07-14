import express from 'express';
import * as contractControler from '../controllers/contract.controller'; 

const routerContract = express.Router();

//  (GET)
routerContract.get('/ending-soon', contractControler.getContractsEndingSoon); 

routerContract.get('/', contractControler.getAllContracts); 

routerContract.get('/customer/:customerId', contractControler.getContracstByCustomerId);

routerContract.get('/:contractId', contractControler.getContractById);

routerContract.get("/search", contractControler.searchContractsByText);


// (POST)
routerContract.post('/', contractControler.postNewContract); 

routerContract.post('documents', contractControler.postContractDocument); 

//  (PATCH)
routerContract.patch('/:contractId', contractControler.updateContract);

//  (DELETE)
routerContract.delete('documents/:customerId', contractControler.deleteContractDocument); 
routerContract.delete('/:contractId', contractControler.deleteContract); 

export default routerContract;