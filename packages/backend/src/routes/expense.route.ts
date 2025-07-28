// ייבוא Router מתוך express לצורך יצירת נתיבים (Routes)
import { Router } from "express";
// ייבוא ה-ExpenseController שמכיל את פעולות ניהול ההוצאות
import { ExpenseController } from "../controllers/expense.controller";
// יצירת מופע (אובייקט) של ExpenseController לצורך שימוש בפונקציות שבו
const expenseController = new ExpenseController();
// יצירת מופע Router חדש - דרכו נגדיר את כל נתיבי ה-expenses
const expenseRouter = Router();
expenseRouter.get("/getAll",expenseController.getAllExpenses1.bind(expenseController));
expenseRouter.post("/createExpense",expenseController.createExpense.bind(expenseController));
expenseRouter.get("/getAllExpenses",expenseController.getAllExpenses.bind(expenseController));
expenseRouter.get("/getExpenseById/:id",expenseController.getExpenseById.bind(expenseController));
expenseRouter.put("/:id",expenseController.updateExpense.bind(expenseController));
expenseRouter.put("/markExpenseAsPaid/:id",expenseController.markExpenseAsPaid.bind(expenseController));
expenseRouter.delete("/:id",expenseController.deleteExpense.bind(expenseController));
expenseRouter.get('/by-page', expenseController.getExpensesByPage.bind(expenseController));
expenseRouter.get('/filter', expenseController.getExpensesByFilter.bind(expenseController));
expenseRouter.get('/petty-cash', expenseController.getPettyCashExpenses.bind(expenseController));


// ייצוא ה-router לשימוש ב-app הראשי (main app)
export default expenseRouter;