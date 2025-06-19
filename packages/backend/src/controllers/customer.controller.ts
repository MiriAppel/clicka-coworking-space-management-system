
import { Request, Response } from 'express';
import * as customerService from '../services/customer.service';
import { AddContractDocumentRequest, Contract, ConvertLeadToCustomerRequest, CustomerStatus, UpdateCustomerRequest } from '../types/customer';
import { ParsedQs } from 'qs';


export const getAllCustomers = async (req: Request, res: Response) => {

    try {
        const customers = await customerService.getAllCustomers();
        res.status(200).json(customers);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching customers', error });
    }

}

export const getCustomerById = async (req: Request, res: Response) => {

    const { id } = req.params;

    try {
        const customer = await customerService.getCustomerById(id);
        if (customer) {
            res.status(200).json(customer);
        } else {
            res.status(404).json({ message: 'Customer not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching customer', error });
    }

}

export const getCustomerByFilter = async (req: Request, res: Response) => {

    const filters = req.query;

    try {
        const customers = await customerService.filterCustomers(filters);

        if (customers.length > 0) {
            res.status(200).json(customers);
        } else {
            res.status(404).json({ message: 'No customers found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error filtering customers', error });
    }
}

// export const getHistoryChanges = async (req: Request, res: Response) => {
//     const { id } = req.params;
//     try {
//         const history = await customerService.getHistoryChanges(id);
//         if (history) {
//             res.status(200).json(history);
//         } else {
//             res.status(404).json({ message: 'History not found' });
//         }
//     } catch (error) {
//         res.status(500).json({ message: 'Error fetching history changes', error });
//     }
// }

//Returns the possible client status modes
export const getAllStatus = async (req: Request, res: Response) => {
    try {
        const statuses = await customerService.getAllStatus();
        res.status(200).json(statuses);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching all statuses', error });
    }
}

// מקבל את כל הלקוחות שצריך לשלוח להם התראות 
export const getCustomersToNotify = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const customers = await customerService.getCustomersToNotify(id);
        res.status(200).json(customers);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching customers to notify', error });
    }
}

// יצירת הודעת עזיבה
export const postExitNotice = async (req: Request, res: Response) => {
    const exitNotice = req.body; // הנח שהנתונים מגיעים בגוף הבקשה
    try {
        await customerService.postExitNotice(exitNotice);
        res.status(200).json({ message: 'Exit notice posted' });
    } catch (error) {
        res.status(500).json({ message: 'Error posting exit notice', error });
    }
}

// לקבל מספר לקוחות לפי גודל העמוד
export const getCustomersByPage = async (req: Request, res: Response) => {
    // קבלת page ו-pageSize מתוך שאילתת ה-URL (query parameters)
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 50;

    try {
        const paginatedCustomers = await customerService.getCustomersByPage(page, pageSize);
        res.status(200).json(paginatedCustomers);
    } catch (error) {
        console.error('Error in getCustomersByPage controller:', error);
        res.status(500).json({ message: 'Error fetching paginated customers', error});
    }
}

// export const getStatusChanges = async (req: Request, res: Response) => {
//     const { id } = req.params;
//     try {
//         const statusChanges = await customerService.getStatusChanges(id);
//         res.status(200).json(statusChanges);
//     } catch (error) {
//         console.error('Error in getStatusChanges controller:', error);
//         res.status(500).json({ message: 'Error fetching status changes', error});
//     }
// }


// עדכון מלא/חלקי של לקוח
export const patchCustomer = async (req: Request, res: Response) => {
    const { id } = req.params;
    const updateData: UpdateCustomerRequest = req.body; // נתוני העדכון החלקיים
    try {
        await customerService.patchCustomer(id, updateData);
        res.status(200).json({ message: 'Customer updated successfully (PATCH)' });
    } catch (error) {
        console.error('Error in patchCustomer controller:', error);
        res.status(500).json({ message: 'Error patching customer', error});
    }
}

// ממיר ליד ללקוח
export const convertLeadToCustomer = async (req: Request, res: Response) => {
    const newCustomerData: ConvertLeadToCustomerRequest = req.body;
    try {
        const convertedCustomer = await customerService.convertLeadToCustomer(newCustomerData);
        if (convertedCustomer) {
            res.status(201).json(convertedCustomer); // 201 Created for new resource
        } else {
            res.status(500).json({ message: 'Failed to convert lead to customer' });
        }
    } catch (error) {
        console.error('Error in convertLeadToCustomer controller:', error);
        res.status(500).json({ message: 'Error converting lead to customer', error });
    }
}









