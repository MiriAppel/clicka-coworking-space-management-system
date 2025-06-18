import { Request, Response } from 'express';
import {
  insertExpense,
  getAllExpenses,
  updateExpenseStatus,
  getExpenseReport
} from '../services/Expense-services';

// יצירת הוצאה חדשה
export const createExpense = async (req: Request, res: Response) => {
  const result = await insertExpense(req.body);
  res.status(result.success ? 201 : 400).json(result);
};

// שליפת כל ההוצאות
export const getExpenses = async (_req: Request, res: Response) => {
  const result = await getAllExpenses();
  res.status(200).json(result);
};

// עדכון סטטוס של הוצאה (מאושר / נדחה)
export const changeExpenseStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, approvedBy } = req.body;
  const result = await updateExpenseStatus(id, status, approvedBy);
  res.status(result.success ? 200 : 400).json(result);
};

// שליפת דוח הוצאות לפי טווח תאריכים וקטגוריה
export const getReport = async (req: Request, res: Response) => {
  const { startDate, endDate, category } = req.query;
  const result = await getExpenseReport(
    String(startDate),
    String(endDate)
  );
  res.status(200).json(result);
};

//הוצאות לפי ספק
export const getExpensesByVendor = async (req: Request, res: Response) => {
    
}