import { Request, Response } from 'express';
import { billingCalculation } from '../services/billingCalcullation.services';

// POST /api/billing/calculate
export const calculateBilling = (req: Request, res: Response) => {
  try {
    // קבלת נתוני החישוב מה-client
    const input = req.body;
    // קריאה לפונקציית החישוב
    const result = billingCalculation(input);
    // החזרת התוצאה ללקוח
    res.status(200).json(result);
  } catch (error) {
    // טיפול בשגיאות 
    res.status(400).json({ error: (error as Error).message });
  }
};