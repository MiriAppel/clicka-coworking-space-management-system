// ייבוא Router מתוך express לצורך יצירת נתיבים (Routes)
import { Router } from "express";

// ייבוא ה-ExpenseController שמכיל את פעולות ניהול ההוצאות
import { ExpenseController } from "../controllers/expense.controller";

// יצירת מופע (אובייקט) של ExpenseController לצורך שימוש בפונקציות שבו
// const expenseController = new ExpenseController();

// יצירת מופע Router חדש - דרכו נגדיר את כל נתיבי ה-expenses
const expenseRouter = Router();

/** 
 * יצירת הוצאה חדשה
 * Method: POST
 * Route: /createExpense
 * גוף הבקשה (req.body) צריך להכיל את כל פרטי ההוצאה החדשה
 */
expenseRouter.post("/createExpense",ExpenseController.createExpense);

/** 
 * שליפת כל ההוצאות הקיימות
 * Method: GET
 * Route: /getAllExpenses
 * אפשר להעביר פרמטרים ב-query לצורך סינון (כגון: קטגוריה, סטטוס, תאריכים וכדומה)
 */
expenseRouter.get("/getAllExpenses",ExpenseController.getAllExpenses);

/** 
 * שליפת הוצאה לפי מזהה (ID)
 * Method: GET
 * Route: /getExpenseById/:id
 * הפרמטר :id יגיע מכתובת ה-URL
 */
expenseRouter.get("/getExpenseById/:id",ExpenseController.getExpenseById);

/** 
 * עדכון הוצאה לפי מזהה
 * Method: PUT
 * Route: /updateExpense/:id
 * גוף הבקשה (req.body) יכיל את השדות לעדכון
 */
expenseRouter.put("/updateExpense/:id",ExpenseController.updateExpense);

/** 
 * סימון הוצאה כבתשלום (mark as paid)
 * Method: PUT
 * Route: /markExpenseAsPaid/:id
 * גוף הבקשה יכיל את פרטי התשלום (תאריך, אמצעי תשלום, רפרנס)
 */
expenseRouter.put("/markExpenseAsPaid/:id",ExpenseController.markExpenseAsPaid);

/** 
 * מחיקת הוצאה לפי מזהה
 * Method: DELETE
 * Route: /deleteExpense/:id
 */
expenseRouter.delete("/deleteExpense/:id",ExpenseController.deleteExpense);

// ייצוא ה-router לשימוש ב-app הראשי (main app)
export default expenseRouter;
