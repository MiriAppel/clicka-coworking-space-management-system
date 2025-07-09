import { Request, Response } from "express";
import { customerService } from "../services/customer.service";
import {
  CreateCustomerRequest,
  ID,
  PaymentMethodType,
  ContractStatus,
} from "shared-types";
import { contractService } from "../services/contract.service";

const serviceCustomer = new customerService();
const serviceContract = new contractService();

export const getAllCustomers = async (req: Request, res: Response) => {
  try {
    // const customers = await serviceCustomer.getAll()
    const customers = await serviceCustomer.getAllCustomers();

    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching customers", error });
  }
};

export const postCustomer = async (req: Request, res: Response) => {
  try {
    const newCustomer: CreateCustomerRequest = req.body;

    // console.log("in controller");
    // console.log(newCustomer);

    const customer = await serviceCustomer.createCustomer(newCustomer);
    console.log("in controller");
    console.log(customer);

        res.status(200).json(customer);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching customers', error });
    }
}

export const getCustomerById = async (req: Request, res: Response) => {
  
  const { id } = req.params;
    console.log("in getCustomerById", id);

  try {
    const customer = await serviceCustomer.getById(id);
    if (customer) {
      res.status(200).json(customer);
    } else {
      res.status(404).json({ message: "Customer not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching customer", error });
  }
};

export const searchCustomersByText = async (req: Request, res: Response) => {
  try {
    const text = req.query.text as string;

    if (!text || text.trim() === "") {
      return res.status(400).json({ error: "יש לספק טקסט לחיפוש." });
    }

    console.log("מחפש לקוחות עם טקסט:", text);
    const leads = await serviceCustomer.getCustomersByText(text);
    console.log("לקוחות שמצאתי:", leads);

    return res.json(leads);
  } catch (error) {
    console.error("שגיאה בחיפוש לקוחות:", error);
    return res.status(500).json({ error: "שגיאה בשרת." });
  }
};

//Returns the possible client status modes
export const getAllCustomerStatus = async (req: Request, res: Response) => {
  try {
    const statuses = await serviceCustomer.getAllCustomerStatus();
    res.status(200).json(statuses);
  } catch (error) {
    res.status(500).json({ message: "Error fetching all statuses", error });
  }
};

export const deleteCustomer = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const statuses = await serviceCustomer.delete(id);
    res.status(200).json(statuses);
  } catch (error) {
    res.status(500).json({ message: "Error fetching all statuses", error });
  }
};

// מקבל את כל הלקוחות שצריך לשלוח להם התראות
export const getCustomersToNotify = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const customers = await serviceCustomer.getCustomersToNotify(id);
    res.status(200).json(customers);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching customers to notify", error });
  }
};

// יצירת הודעת עזיבה
export const postExitNotice = async (req: Request, res: Response) => {
  const exitNotice = req.body; // הנח שהנתונים מגיעים בגוף הבקשה
  const { id } = req.params;

  try {
    await serviceCustomer.postExitNotice(exitNotice, id);
    res.status(200).json({ message: "Exit notice posted" });
  } catch (error) {
    res.status(500).json({ message: "Error posting exit notice", error });
  }
};

// לקבל מספר לקוחות לפי גודל העמוד
export const getCustomersByPage = async (req: Request, res: Response) => {
  const filters = req.query;
  console.log("Filters received:", filters);

  try {
    // המרה עם בדיקה
    const pageNum = Number(filters.page);
    const limitNum = Math.max(1, Number(filters.limit) || 10);

    // אם pageNum לא מספר תקין, תגדיר כברירת מחדל 1
    const validPage = Number.isInteger(pageNum) && pageNum > 0 ? pageNum : 1;

    const filtersForService = {
      page: String(validPage), // convert to string
      limit: limitNum,
    };

    console.log("Filters passed to service:", filtersForService);

    const customer =
      await serviceCustomer.getCustomersByPage(filtersForService);

    if (customer.length > 0) {
      res.status(200).json(customer);
    } else {
      return res.status(200).json([]); // החזרת מערך ריק אם אין לקוחות
    }
  } catch (error: any) {
    console.error("❌ Error in getCustomersByPage controller:");
    if (error instanceof Error) {
      console.error("🔴 Message:", error.message);
      console.error("🟠 Stack:", error.stack);
    } else {
      console.error("🟡 Raw error object:", error);
    }

    res
      .status(500)
      .json({ message: "Server error", error: error?.message || error });
  }
  console.log("getCustomersByPage completed");
};

// עדכון מלא/חלקי של לקוח
export const patchCustomer = async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData = req.body; // נתוני העדכון החלקיים

  try {
    // await serviceCustomer.patch(updateData, id)
    await serviceCustomer.updateCustomer(updateData, id);
    res.status(200).json({ message: "Customer updated successfully (PATCH)" });
  } catch (error) {
    console.error("Error in patchCustomer controller:", error);
    res.status(500).json({ message: "Error patching customer", error });
  }
};

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
