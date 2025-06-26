import { Request, Response } from 'express';
import { customerService } from '../services/customer.service';
import { CreateCustomerRequest, ID, PaymentMethodType } from 'shared-types';

const serviceCustomer = new customerService();

export const getAllCustomers = async (req: Request, res: Response) => {

    try {
        const customers = await serviceCustomer.getAll()
        res.status(200).json(customers);
    } 
    catch (error) {
        res.status(500).json({ message: 'Error fetching customers', error });
    }
}

export const postCustomer = async (req: Request, res: Response) => {
  try {
    const {
      newCustomer,
      leadId,
      paymentMethodsType,
      businessName,
    }: {
      newCustomer: CreateCustomerRequest;
      leadId: ID;
      paymentMethodsType: PaymentMethodType;
      businessName: string;
    } = req.body;

    const customer = await serviceCustomer.convertLeadToCustomer(
      newCustomer,
      paymentMethodsType,
      businessName
    );

    res.status(200).json(customer);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching customers', error });
    }
}

export const getCustomerById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const customer = await serviceCustomer.getById(id);
        if (customer) {
            res.status(200).json(customer);
        } else {
            res.status(404).json({ message: 'Customer not found' });
        }
    } 
    catch (error) {
        res.status(500).json({ message: 'Error fetching customer', error });
    }
}

export const getCustomersByFilter = async (req: Request, res: Response) => {
    const filters = req.query;
    try {
        const customers = await serviceCustomer.getByFilters(filters);

        if (customers.length > 0) {
            res.status(200).json(customers);
        } else {
            res.status(404).json({ message: 'No customers found' });
        }
    } 
    catch (error) {
        res.status(500).json({ message: 'Error filtering customers', error });
    }

}

//Returns the possible client status modes
export const getAllCustomerStatus = async (req: Request, res: Response) => {
    try {
        const statuses = await serviceCustomer.getAllCustomerStatus();
        res.status(200).json(statuses);
    } 
    catch (error) {
        res.status(500).json({ message: 'Error fetching all statuses', error });
    }
}

export const deleteCustomer = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const statuses = await serviceCustomer.delete(id);
        res.status(200).json(statuses);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching all statuses', error });
    }
}

// מקבל את כל הלקוחות שצריך לשלוח להם התראות 
export const getCustomersToNotify = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const customers = await serviceCustomer.getCustomersToNotify(id);
        res.status(200).json(customers);
    } 
    catch (error) {
        res.status(500).json({ message: 'Error fetching customers to notify', error });
    }
}

// יצירת הודעת עזיבה
export const postExitNotice = async (req: Request, res: Response) => {
    const exitNotice = req.body; // הנח שהנתונים מגיעים בגוף הבקשה
    const { id } = req.params;

    try {
        await serviceCustomer.postExitNotice(exitNotice, id);
        res.status(200).json({ message: 'Exit notice posted' });
    } 
    catch (error) {
        res.status(500).json({ message: 'Error posting exit notice', error });
    }
}

// לקבל מספר לקוחות לפי גודל העמוד
export const getCustomersByPage = async (req: Request, res: Response) => {
    // קבלת page ו-pageSize מתוך שאילתת ה-URL (query parameters)
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 50;

    try {
        const paginatedCustomers = await serviceCustomer.getCustomersByPage(page, pageSize);
        res.status(200).json(paginatedCustomers);
    } catch (error) {
        console.error('Error in getCustomersByPage controller:', error);
        res.status(500).json({ message: 'Error fetching paginated customers', error});
    }
}


// עדכון מלא/חלקי של לקוח
export const patchCustomer = async (req: Request, res: Response) => {
    const { id } = req.params;
    const updateData = req.body; // נתוני העדכון החלקיים

    try {
        await serviceCustomer.patch(updateData, id)
        res.status(200).json({ message: 'Customer updated successfully (PATCH)' });
    } 
    catch (error) {
        console.error('Error in patchCustomer controller:', error);
        res.status(500).json({ message: 'Error patching customer', error});
    }
}


// לשאול את שולמית לגבי זה

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