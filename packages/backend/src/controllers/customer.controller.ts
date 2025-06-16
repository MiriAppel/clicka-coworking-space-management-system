
import { Request, Response } from 'express';
import * as customerService from '../services/customer.service';
import { AddContractDocumentRequest, Contract, ConvertLeadToCustomerRequest, CustomerStatus, TimelineEvent, UpdateCustomerRequest } from '../types/customer';
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

export const getHistoryChanges = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const history = await customerService.getHistoryChanges(id);
        if (history) {
            res.status(200).json(history);
        } else {
            res.status(404).json({ message: 'History not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching history changes', error });
    }
}

//Returns the possible client status modes
export const getAllStatus = async (req: Request, res: Response) => {
    try {
        const statuses = await customerService.getAllStatus();
        res.status(200).json(statuses);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching all statuses', error });
    }
}

export const exportToFile = async (req: Request, res: Response) => {
    const requestData = req.body; // הנח שהנתונים מגיעים בגוף הבקשה
    try {
        const fileBuffer = await customerService.exportToFile(requestData);
        res.status(200).send(fileBuffer);
    } catch (error) {
        res.status(500).json({ message: 'Error exporting to file', error });
    }
}

export const patchStatus = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await customerService.patchStatus(id);
        res.status(200).json({ message: 'Status updated' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating status', error });
    }
}

export const putCustomer = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await customerService.putCustomer(id);
        res.status(200).json({ message: 'Customer updated' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating customer', error });
    }
}

export const getCustomersToNotify = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const customers = await customerService.getCustomersToNotify(id);
        res.status(200).json(customers);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching customers to notify', error });
    }
}

export const postExitNotice = async (req: Request, res: Response) => {
    const exitNotice = req.body; // הנח שהנתונים מגיעים בגוף הבקשה
    try {
        await customerService.postExitNotice(exitNotice);
        res.status(200).json({ message: 'Exit notice posted' });
    } catch (error) {
        res.status(500).json({ message: 'Error posting exit notice', error });
    }
}

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

export const getStatusChanges = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const statusChanges = await customerService.getStatusChanges(id);
        res.status(200).json(statusChanges);
    } catch (error) {
        console.error('Error in getStatusChanges controller:', error);
        res.status(500).json({ message: 'Error fetching status changes', error});
    }
}

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

export const getAllContracts = async (req: Request, res: Response) => {
    try {
        const contracts = await customerService.getAllContracts();
        res.status(200).json(contracts);
    } catch (error) {
        console.error('Error in getAllContracts controller:', error);
        res.status(500).json({ message: 'Error fetching all contracts', error});
    }
}

export const getContractById = async (req: Request, res: Response) => {
    const { contractId } = req.params; // שם הפרמטר בנתיב ה-URL
    try {
        const contract = await customerService.getContractById(contractId);
        res.status(200).json(contract);
    } catch (error) {
        console.error('Error in getContractById controller:', error);
        res.status(500).json({ message: 'Error fetching contract by ID', error});
    }
}

export const getAllContractsByCustomerId = async (req: Request, res: Response) => {
    const { customerId } = req.params; // שם הפרמטר בנתיב ה-URL
    try {
        const contracts = await customerService.getAllContractsByCustomerId(customerId);
        res.status(200).json(contracts);
    } catch (error) {
        console.error('Error in getAllContractsByCustomerId controller:', error);
        res.status(500).json({ message: 'Error fetching contracts by customer ID', error });
    }
}

export const getContractsEndingSoon = async (req: Request, res: Response) => {
    const days = parseInt(req.query.days as string) || 30; // קבלת מספר הימים כפרמטר שאילתה
    try {
        const contracts = await customerService.getContractsEndingSoon(days);
        res.status(200).json(contracts);
    } catch (error) {
        console.error('Error in getContractsEndingSoon controller:', error);
        res.status(500).json({ message: 'Error fetching contracts ending soon', error });
    }
}

export const postNewContract = async (req: Request, res: Response) => {
    const contractData: Contract = req.body;
    try {
        await customerService.postNewContract(contractData);
        res.status(201).json({ message: 'New contract created successfully' });
    } catch (error) {
        console.error('Error in postNewContract controller:', error);
        res.status(500).json({ message: 'Error creating new contract', error});
    }
}

export const updateContractTerms = async (req: Request, res: Response) => {
    const { contractId } = req.params;
    const terms = req.body; // נניח ש-terms מגיע ישירות בגוף הבקשה
    try {
        const updatedContract = await customerService.updateContractTerms(contractId, terms);
        res.status(200).json(updatedContract);
    } catch (error) {
        console.error('Error in updateContractTerms controller:', error);
        res.status(500).json({ message: 'Error updating contract terms', error});
    }
}

export const postContractDocument = async (req: Request, res: Response) => {
    const documentData: AddContractDocumentRequest = req.body;
    try {
        await customerService.postContractDocument(documentData);
        res.status(200).json({ message: 'Contract document added successfully' });
    } catch (error) {
        console.error('Error in postContractDocument controller:', error);
        res.status(500).json({ message: 'Error adding contract document', error});
    }
}

export const deleteContractDocument = async (req: Request, res: Response) => {
    const { id } = req.params; // נניח שזה ID של המסמך
    try {
        await customerService.deleteContractDocument(id);
        res.status(200).json({ message: 'Contract document deleted successfully' });
    } catch (error) {
        console.error('Error in deleteContractDocument controller:', error);
        res.status(500).json({ message: 'Error deleting contract document', error});
    }
}

export const getCustomerTimeline = async (req: Request, res: Response) => {
    const { customerId } = req.params; // נניח customerId מגיע בנתיב ה-URL
    try {
        const timeline = await customerService.getCustomerTimeline(customerId);
        res.status(200).json(timeline);
    } catch (error) {
        console.error('Error in getCustomerTimeline controller:', error);
        res.status(500).json({ message: 'Error fetching customer timeline', error });
    }
}

export const addTimelineEvent = async (req: Request, res: Response) => {
    const eventData: TimelineEvent = req.body; // האירוע מגיע בגוף הבקשה
    try {
        // אם ה-service מחזיר את האירוע שנוצר עם ID, ניתן לשלוח אותו חזרה:
        // const newEvent = await customerService.addTimelineEvent(eventData);
        // res.status(201).json(newEvent);
        await customerService.addTimelineEvent(eventData);
        res.status(201).json({ message: 'Timeline event added successfully' }); // 201 Created
    } catch (error) {
        console.error('Error in addTimelineEvent controller:', error);
        res.status(500).json({ message: 'Error adding timeline event', error});
    }
}

export const exportTimeline = async (req: Request, res: Response) => {
    const { customerId } = req.params; // נניח customerId מגיע בנתיב ה-URL
    const filters = req.query; // נניח פילטרים מגיעים כקוו'ארי פראמטרס (או req.body אם זה POST)
    try {
        // אם הפונקציה בסרביס מקבלת ID ו-filters, והיא צריכה להחזיר FileReference
        const fileReference = await customerService.exportTimeline(customerId, filters as any); // התאמה ל-TimelineExportFilters
        res.status(200).json(fileReference); // החזרת קישור לקובץ
    } catch (error) {
        console.error('Error in exportTimeline controller:', error);
        res.status(500).json({ message: 'Error exporting timeline', error });
    }
}



