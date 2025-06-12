
import { Request, Response } from 'express';
import * as customerService from '../services/customer.service';
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
export const getCustomerByName = async (req: Request, res: Response) => {
    const { name } = req.params;
    try {
        const customer = await customerService.getCustomerByName(name);
        if (customer) {
            res.status(200).json(customer);
        } else {
            res.status(404).json({ message: 'Customer not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching customer', error });
    }
}
export const getCustomerByEmail = async (req: Request, res: Response) => {
    const { email } = req.params;
    try {
        const customer = await customerService.getCustomerByEmail(email);
        if (customer) {
            res.status(200).json(customer);
        } else {
            res.status(404).json({ message: 'Customer not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching customer', error });
    }
}
export const getCustomerByPhone = async (req: Request, res: Response) => {
    const { phone } = req.params;
    try {
        const customer = await customerService.getCustomerByPhone(phone);
        if (customer) {
            res.status(200).json(customer);
        } else {
            res.status(404).json({ message: 'Customer not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching customer', error });
    }
}
export const getCustomerByStatus = async (req: Request, res: Response) => {
    const { status } = req.params;
    try {
        const customers = await customerService.getCustomerByStatus(status);
        res.status(200).json(customers);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching customers by status', error });
    }
}
export const getByDateJoin = async (req: Request, res: Response) => {
    const { dateFrom, dateEnd } = req.body; // הנח שהנתונים מגיעים בגוף הבקשה
    try {
        const customers = await customerService.getByDateJoin(dateFrom, dateEnd);
        res.status(200).json(customers);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching customers by join date', error });
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
export const getStatusChanges = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const statusChanges = await customerService.getStatusChanges(id);
        res.status(200).json(statusChanges);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching status changes', error });
    }
}
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

