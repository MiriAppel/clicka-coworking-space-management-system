import { Request, Response } from "express";
import { PaymentService } from "../services/payments.service";
import type { ID, Payment } from "shared-types";

const servicePayment = new PaymentService();

// קבלת כל התשלומים
export const getAllPayments = async (req: Request, res: Response) => {
  try {
    const payments = await servicePayment.getAll();
    res.status(200).json(payments);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// קבלת תשלום לפי מזהה
export const getPaymentById = async (req: Request, res: Response) => {
  try {
    const payment = await servicePayment.getById(req.params.id);
    res.status(200).json(payment);
  } catch (error: any) {
    res.status(404).json({ error: "תשלום לא נמצא" });
  }
};

// יצירת תשלום חדש
export const createPayment = async (req: Request, res: Response) => {
  try {
    const newPayment: Payment = req.body;
    const payment = await servicePayment.post(newPayment);
    res.status(201).json(payment);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// עדכון תשלום
export const updatePayment = async (req: Request, res: Response) => {
  try {
    const updated = await servicePayment.patch(req.body, req.params.id);
    res.status(200).json(updated);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// מחיקת תשלום
export const deletePayment = async (req: Request, res: Response) => {
  try {
    await servicePayment.delete(req.params.id);
    res.status(204).send();
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// סינון לפי שאילתא
export const getPaymentByFilter = async (req: Request, res: Response) => {
  try {
    const payments = await servicePayment.getByFilters(req.query);
    res.status(200).json(payments);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getPaymentByPage = async (req: Request, res: Response) => {
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

    const customer = await servicePayment.getPaymentByPage(filtersForService);

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