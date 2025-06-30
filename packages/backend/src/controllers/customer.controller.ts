// import { Request, Response } from 'express';
// import { customerService } from '../services/customer.service';
// import { CreateCustomerRequest, ID, PaymentMethodType, ContractStatus } from 'shared-types';
// import { CustomerModel } from '../models/customer.model';
// import { contractService } from '../services/contract.service';
// import { ContractModel } from '../models/contract.model';
// import { date } from 'zod';


// const serviceCustomer = new customerService();
// const serviceContract = new contractService();


// export const getAllCustomers = async (req: Request, res: Response) => {
//     try {
//         // const customers = await serviceCustomer.getAll()
//         const customers = await serviceCustomer.getAllCustomers()

//         res.status(200).json(customers);
//     }
//     catch (error) {
//         res.status(500).json({ message: 'Error fetching customers', error });
//     }
// }

// export const postCustomer = async (req: Request, res: Response) => {
//     try {

//         const newCustomer: CreateCustomerRequest = req.body

//         // console.log("in controller");
//         // console.log(newCustomer);  

//         const customer = await serviceCustomer.convertLeadToCustomer(newCustomer);
//         console.log("in controller");
//         console.log(customer);

//         const newContract: ContractModel = {
//             customerId: customer.id!, // FK.  כל חוזה שייך ללקוח אחד בלבד. אבל ללקוח יכולים להיות כמה חוזים לאורך זמן – למשל, הוא חתם שוב אחרי שנה, או שינה תנאים.
//             version: 1,
//             status: ContractStatus.DRAFT,
//             documents: newCustomer.contractDocuments || [],
//             createdAt: new Date().toISOString(),
//             updatedAt: new Date().toISOString(),
//             toDatabaseFormat() {
//                 return {
//                     customer_id: this.customerId,
//                     version: this.version,
//                     status: this.status,
//                     sign_date: this.signDate,
//                     start_date: this.startDate,
//                     end_date: this.endDate,
//                     terms: this.terms,
//                     documents: this.documents,
//                     signed_by: this.signedBy,
//                     witnessed_by: this.witnessedBy,
//                     created_at: this.createdAt,
//                     updated_at: this.updatedAt
//                 };
//             }
//         }

//         const contract = await serviceContract.post(newContract)

//         console.log("in controller");
//         console.log(contract);

//         res.status(200).json(customer);
//     } catch (error) {
//         res.status(500).json({ message: 'Error fetching customers', error });
//     }
// }

// export const getCustomerById = async (req: Request, res: Response) => {
//     const { id } = req.params;
//     try {
//         const customer = await serviceCustomer.getById(id);
//         if (customer) {
//             res.status(200).json(customer);
//         } else {
//             res.status(404).json({ message: 'Customer not found' });
//         }
//     }
//     catch (error) {
//         res.status(500).json({ message: 'Error fetching customer', error });
//     }
// }

// export const getCustomersByFilter = async (req: Request, res: Response) => {
//     const filters = req.query;
//     try {
//         const customers = await serviceCustomer.getByFilters(filters);

//         if (customers.length > 0) {
//             res.status(200).json(customers);
//         } else {
//             res.status(404).json({ message: 'No customers found' });
//         }
//     }
//     catch (error) {
//         res.status(500).json({ message: 'Error filtering customers', error });
//     }

// }

// //Returns the possible client status modes
// export const getAllCustomerStatus = async (req: Request, res: Response) => {
//     try {
//         const statuses = await serviceCustomer.getAllCustomerStatus();
//         res.status(200).json(statuses);
//     }
//     catch (error) {
//         res.status(500).json({ message: 'Error fetching all statuses', error });
//     }
// }

// export const deleteCustomer = async (req: Request, res: Response) => {
//     const { id } = req.params;
//     try {
//         const statuses = await serviceCustomer.delete(id);
//         res.status(200).json(statuses);
//     } catch (error) {
//         res.status(500).json({ message: 'Error fetching all statuses', error });
//     }
// }

// // מקבל את כל הלקוחות שצריך לשלוח להם התראות 
// export const getCustomersToNotify = async (req: Request, res: Response) => {
//     const { id } = req.params;
//     try {
//         const customers = await serviceCustomer.getCustomersToNotify(id);
//         res.status(200).json(customers);
//     }
//     catch (error) {
//         res.status(500).json({ message: 'Error fetching customers to notify', error });
//     }
// }

// // יצירת הודעת עזיבה
// export const postExitNotice = async (req: Request, res: Response) => {
//     const exitNotice = req.body; // הנח שהנתונים מגיעים בגוף הבקשה
//     const { id } = req.params;

//     try {
//         await serviceCustomer.postExitNotice(exitNotice, id);
//         res.status(200).json({ message: 'Exit notice posted' });
//     }
//     catch (error) {
//         res.status(500).json({ message: 'Error posting exit notice', error });
//     }
// }

// // לקבל מספר לקוחות לפי גודל העמוד
// export const getCustomersByPage = async (req: Request, res: Response) => {
//     // קבלת page ו-pageSize מתוך שאילתת ה-URL (query parameters)
//     const page = parseInt(req.query.page as string) || 1;
//     const pageSize = parseInt(req.query.pageSize as string) || 50;

//     try {
//         const paginatedCustomers = await serviceCustomer.getCustomersByPage(page, pageSize);
//         res.status(200).json(paginatedCustomers);
//     } catch (error) {
//         console.error('Error in getCustomersByPage controller:', error);
//         res.status(500).json({ message: 'Error fetching paginated customers', error });
//     }
// }


// // עדכון מלא/חלקי של לקוח
// export const patchCustomer = async (req: Request, res: Response) => {
//     const { id } = req.params;
//     const updateData = req.body; // נתוני העדכון החלקיים

//     try {
//         // await serviceCustomer.patch(updateData, id)
//         await serviceCustomer.updateCustomer(updateData, id)
//         res.status(200).json({ message: 'Customer updated successfully (PATCH)' });
//     }
//     catch (error) {
//         console.error('Error in patchCustomer controller:', error);
//         res.status(500).json({ message: 'Error patching customer', error });
//     }
// }


// // לשאול את שולמית לגבי זה

// // export const getHistoryChanges = async (req: Request, res: Response) => {
// //     const { id } = req.params;
// //     try {
// //         const history = await customerService.getHistoryChanges(id);
// //         if (history) {
// //             res.status(200).json(history);
// //         } else {
// //             res.status(404).json({ message: 'History not found' });
// //         }
// //     } catch (error) {
// //         res.status(500).json({ message: 'Error fetching history changes', error });
// //     }
// // }

// // export const getStatusChanges = async (req: Request, res: Response) => {
// //     const { id } = req.params;
// //     try {
// //         const statusChanges = await customerService.getStatusChanges(id);
// //         res.status(200).json(statusChanges);
// //     } catch (error) {
// //         console.error('Error in getStatusChanges controller:', error);
// //         res.status(500).json({ message: 'Error fetching status changes', error});
// //     }
// // }