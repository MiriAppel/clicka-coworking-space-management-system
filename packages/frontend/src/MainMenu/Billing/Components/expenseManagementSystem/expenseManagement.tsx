import { Expense, ExpenseCategory } from "../../../../../../backend/src/types/expense";
import { ID } from "../../../../../../backend/src/types/core";
import { ExpenseFilter } from "../../../../../../backend/src/types/expenseFilter";
//כל השגיאות בקובץ זה בגלל שהפונקציות הכתובות עוד לא מומשו
export const ExpenseManagement = () => {
//functions
// שליפת כל ההוצאות
const getAllExpenses = async (): Promise<Expense[]> => {
    return [];
};

// יצירת הוצאה חדשה
const createExpense = async (expenseData: Expense): Promise<Expense> => {
     return {} as Expense;
};

// עדכון הוצאה קיימת
const updateExpense = async (expenseId: ID, updatedExpenseData: Expense): Promise<Expense> => {
    return {} as Expense;
};

// מחיקת הוצאה
const deleteExpense = async (expenseId: ID): Promise<void> => {
   return;
};

// רענון רשימת הוצאות
const refreshExpenseList = (): Promise<Expense[]> => {
    return getAllExpenses();
};

// סינון הוצאות לפי קטגוריה/ספק/תאריכים
const filterExpenses = (filter: ExpenseFilter): Promise<Expense[]> => {
    return {} as Promise<Expense[]>;
};

// מעבר לכרטיס הוצאה
const handleSelectExpense = (expenseId: ID): void => {};

    return (
        <div>
            <h1>Expense Management</h1>
        </div>
    )
}

   