import { ExpenseFilter } from "../../../../../../backend/src/types/expenseFilter";
import { Expense } from "../../../../../../backend/src/types/expense";
import { ID } from "../../../../../../backend/src/types/core";

export const ExpenseList = () => {
// כל השגיאות בקובץ זה בגלל שהפונקציות הכתובות עוד לא מומשו
// functions

// שליפת כל ההוצאות
const fetchExpenses = async (): Promise<Expense[]> => {
    return {} as Expense[];
};

// סינון/חיפוש הוצאות
const handleSearch = (query: string): void => {};
const handleFilter = (filter: ExpenseFilter): void => {};

// מעבר לכרטיס הוצאה
const handleSelectExpense = (expenseId: ID): void => {};

// מחיקת הוצאה
const handleDeleteExpense = async (expenseId: ID): Promise<void> => {};

// רענון הרשימה
const refreshExpenseList = (): Promise<Expense[]> => {
    return {} as Promise<Expense[]>;
};


return <div>
    <h1>Expense List</h1>
    {/* כאן ניתן להוסיף את רכיבי התצוגה של רשימת ההוצאות */}
    {/* לדוגמה: טבלה, כפתורים לפעולות שונות וכו' */}
</div>

}