import { Request, Response } from "express";
import { createInvoice } from "../services/invoiceService";

// פונקציית בקר ליצירת חשבונית חדשה
export const createInvoiceController = async (req: Request, res: Response) => {
  try {
    // קוראת לפונקציית השירות שמייצרת את החשבונית לפי הנתונים שנשלחו ב־req.body
    const invoice = await createInvoice(req.body);

    // מחזירה תשובה עם סטטוס 201 (נוצר) ואת האובייקט של החשבונית
    res.status(201).json(invoice);
  } catch (error) {
    // במקרה של שגיאה, מחזירה סטטוס 400 עם הודעת השגיאה
    res.status(400).json({ message: (error as Error).message });
  }
};

// פונקציית בקר לרישום תשלום חדש
export const recordPaymentController = (req: Request, res: Response) => {
  try {
    // נניח שיש לך middleware שמכניס את המשתמש המחובר לתוך req.user
    const userId: ID = req.user?.id || "SYSTEM"; // אם אין משתמש מחובר, נשתמש בשם כללי

    // קוראת לפונקציית השירות שמייצרת את התשלום
    const payment = recordPayment(req.body, userId);

    // מחזירה תשובה עם סטטוס 201 (נוצר) ואת אובייקט התשלום
    res.status(201).json(payment);
  } catch (error) {
    // במקרה של שגיאה, מחזירה סטטוס 400 עם הודעת השגיאה
    res.status(400).json({ message: (error as Error).message });
  }
};

