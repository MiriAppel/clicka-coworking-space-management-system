// ייבוא Router מתוך express לצורך יצירת נתיבים (Routes)
import { Router } from "express";

// ייבוא ה-ExpenseController שמכיל את פעולות ניהול ההוצאות
import { ExpenseController } from "../controllers/expense.controller";

// יצירת מופע (אובייקט) של ExpenseController לצורך שימוש בפונקציות שבו
const expenseController = new ExpenseController();

// יצירת מופע Router חדש - דרכו נגדיר את כל נתיבי ה-expenses
const expenseRouter = Router();
expenseRouter.get("/getAll",expenseController.getAllExpenses1.bind(ExpenseController));
expenseRouter.post("/createExpense",expenseController.createExpense.bind(ExpenseController));
expenseRouter.get("/getAllExpenses",expenseController.getAllExpenses.bind(ExpenseController));
expenseRouter.get("/getExpenseById/:id",expenseController.getExpenseById.bind(ExpenseController)); 
expenseRouter.put("/updateExpense/:id",expenseController.updateExpense.bind(ExpenseController));
expenseRouter.put("/markExpenseAsPaid/:id",expenseController.markExpenseAsPaid.bind(ExpenseController));
expenseRouter.delete("/deleteExpense/:id",expenseController.deleteExpense.bind(ExpenseController));

// ייצוא ה-router לשימוש ב-app הראשי (main app)
export default expenseRouter;
