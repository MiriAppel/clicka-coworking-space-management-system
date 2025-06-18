import express from 'express';
import * as contractControler from '../controllers/contract.controller'; 

const routerContract = express.Router();

//  (GET)
routerContract.get('/', contractControler.getAllContracts); 
routerContract.get('ending-soon', contractControler.getContractsEndingSoon); 
routerContract.get('customer/:customerId', contractControler.getContractById); 

// (POST)
routerContract.post('/', contractControler.postNewContract); 
routerContract.post('documents', contractControler.postContractDocument); 


//  (DELETE)
routerContract.delete('documents/:id', contractControler.deleteContractDocument); 

export default routerContract;