import { Request, Response } from 'express';
import {contractService} from '../services/contract.service'
import { AddContractDocumentRequest, Contract } from '../types/customer';
import { ID } from '../types/core';
import { ContractModel } from '../models/contract.model';

const serviceContract = new contractService();
// קבלת כל החוזים
export const getAllContracts = async (req: Request, res: Response) => {
    try {
        const contracts = await serviceContract.getAll();
        res.status(200).json(contracts);
    } catch (error) {
        console.error('Error in getAllContracts controller:', error);
        res.status(500).json({ message: 'Error fetching all contracts', error});
    }
}

// קבלת חוזה לפי id
export const getContractById = async (req: Request, res: Response) => {
    const { contractId } = req.params; // שם הפרמטר בנתיב ה-URL
    try {
        const contract = await serviceContract.getById(contractId);
        res.status(200).json(contract);
    } catch (error) {
        console.error('Error in getContractById controller:', error);
        res.status(500).json({ message: 'Error fetching contract by ID', error});
    }
}

// export const getAllContractsByCustomerId = async (req: Request, res: Response) => {
//     const { customerId } = req.params; // שם הפרמטר בנתיב ה-URL
//     try {
//         const contracts = await customerService.getAllContractsByCustomerId(customerId);
//         res.status(200).json(contracts);
//     } catch (error) {
//         console.error('Error in getAllContractsByCustomerId controller:', error);
//         res.status(500).json({ message: 'Error fetching contracts by customer ID', error });
//     }
// }


// קבלת החוזים שהתוקף שלהם עומד להסתיים
export const getContractsEndingSoon = async (req: Request, res: Response) => {
    const days = parseInt(req.query.days as string) || 30; // קבלת מספר הימים כפרמטר שאילתה
    try {
        const contracts = await serviceContract.getContractsEndingSoon(days);
        res.status(200).json(contracts);
    } catch (error) {
        console.error('Error in getContractsEndingSoon controller:', error);
        res.status(500).json({ message: 'Error fetching contracts ending soon', error });
    }
}

export const postNewContract = async (req: Request, res: Response) => {
    const contractData: ContractModel = req.body;
    try {
        await serviceContract.post(contractData);
        res.status(201).json({ message: 'New contract created successfully' });
    } catch (error) {
        console.error('Error in postNewContract controller:', error);
        res.status(500).json({ message: 'Error creating new contract', error});
    }
}

// הוספת טופס לחוזה
export const postContractDocument = async (req: Request, res: Response) => {
    const {documentData, customerId }= req.body;//-----------------------------מזהה לקוח או חוזה??????????????????
    try {
        await serviceContract.postContractDocument(documentData,customerId);
        res.status(200).json({ message: 'Contract document added successfully' });
    } catch (error) {
        console.error('Error in postContractDocument controller:', error);
        res.status(500).json({ message: 'Error adding contract document', error});
    }
}

export const deleteContractDocument = async (req: Request, res: Response) => {
    const { id } = req.params; // נניח שזה ID של המסמך
    try {
        await serviceContract.deleteContractDocument(id);
        res.status(200).json({ message: 'Contract document deleted successfully' });
    } catch (error) {
        console.error('Error in deleteContractDocument controller:', error);
        res.status(500).json({ message: 'Error deleting contract document', error});
    }
}