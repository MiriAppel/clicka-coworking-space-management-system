
// ייבוא טיפוסים עבור בקשות HTTP
import { Request, Response } from "express";
// ייבוא מחלקת השירות שמבצעת את הלוגיקה העסקית מול מסד הנתונים
import { ExpenseService } from "../services/expense.services";
// ייבוא טיפוסים עבור מבנה הנתונים של הבקשות (ליצירה/עדכון/סינון הוצאות)
import type { CreateExpenseRequest, UpdateExpenseRequest, GetExpensesRequest, MarkExpenseAsPaidRequest } from "shared-types";
// הגדרת מחלקת ExpenseController - אחראית על טיפול בבקשות HTTP הקשורות להוצאות
export class ExpenseController {
    expenseService = new ExpenseService();
async getAllExpenses1(req: Request, res: Response) {
    const result = await this.expenseService.getExpenses1(); // קריאה בלי פילטרים בכלל
    if (result) {
        res.status(200).json(result); // הצלחה: החזרת כל ההוצאות
    } else {
        res.status(500).json({ error: "Failed to fetch expenses" }); // כשלון: החזרת שגיאה
    }
}
    async createExpense(req: Request, res: Response) {
        const expenseData: CreateExpenseRequest = req.body; // קריאת פרטי ההוצאה מתוך גוף הבקשה
        console.log('Prepared expense data:', JSON.stringify(expenseData, null, 2)); // הדפסת נתוני ההוצאה ללוג
        const result = await this.expenseService.createExpense(expenseData); // קריאה לשירות ליצירת הוצאה במסד
        if (result) {
            res.status(200).json(result); // הצלחה: החזרת ההוצאה שנוצרה
        } else {
            res.status(500).json({ error: "Failed to create expense" }); // כשלון: החזרת שגיאה
        }
    }
    async getAllExpenses(req: Request, res: Response) {
        const filters: GetExpensesRequest = req.query as unknown as GetExpensesRequest; // המרת query ל-GetExpensesRequest
        const result = await this.expenseService.getExpenses(filters); // קריאה לשירות לשליפת ההוצאות
        if (result) {
            res.status(200).json(result); // הצלחה: החזרת רשימת ההוצאות
        } else {
            res.status(500).json({ error: "Failed to fetch expenses" }); // כשלון: החזרת שגיאה
        }
    }
    async getExpenseById(req: Request, res: Response) {
        const expenseId = req.params.id; // קריאת ה-ID מתוך פרמטרי הכתובת
        const result = await this.expenseService.getExpenseById(expenseId); // קריאה לשירות לשליפת ההוצאה
        if (result) {
            res.status(200).json(result); // הצלחה: החזרת ההוצאה
        } else {
            res.status(404).json({ error: "Expense not found" }); // לא נמצא: החזרת 404
        }
    }
    async updateExpense(req: Request, res: Response) {
        const expenseId = req.params.id; // קריאת ה-ID מתוך ה-params
        const updateData: UpdateExpenseRequest = req.body; // קריאת נתוני העדכון מתוך גוף הבקשה
        console.log('Prepared update data:', JSON.stringify(updateData, null, 2)); // הדפסת נתוני העדכון ללוג
        const result = await this.expenseService.updateExpense(expenseId, updateData); // קריאה לשירות לביצוע העדכון
        if (result) {
            res.status(200).json(result); // הצלחה: החזרת ההוצאה המעודכנת
        } else {
            res.status(500).json({ error: "Failed to update expense" }); // כשלון: החזרת שגיאה
        }
    }
    async markExpenseAsPaid(req: Request, res: Response) {
        const expenseId = req.params.id; // קריאת ה-ID מתוך ה-params
        const paidData: MarkExpenseAsPaidRequest = req.body; // קריאת נתוני התשלום מתוך גוף הבקשה
        const result = await this.expenseService.markExpenseAsPaid(expenseId, paidData); // קריאה לשירות לסימון ההוצאה כ-paid
        if (result) {
            res.status(200).json(result); // הצלחה: החזרת ההוצאה לאחר העדכון
        } else {
            res.status(500).json({ error: "Failed to mark expense as paid" }); // כשלון: החזרת שגיאה
        }
    }
    async deleteExpense(req: Request, res: Response) {
        const expenseId = req.params.id; // קריאת ה-ID מתוך ה-params
        const result = await this.expenseService.deleteExpense(expenseId); // קריאה לשירות למחיקת ההוצאה
        if (result) {
            res.status(200).send(); // הצלחה: החזרת סטטוס 200 ללא תוכן
        } else {
            res.status(500).json({ error: "Failed to delete expense" }); // כשלון: החזרת שגיאה
        }
    }
}