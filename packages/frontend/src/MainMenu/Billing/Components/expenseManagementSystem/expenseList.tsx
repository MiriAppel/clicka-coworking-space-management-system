import { ExpenseFilter } from "../../../../../../types/expenseFilter";
import { Expense } from "../../../../../../types/expense";
import { ID } from "../../../../../../types/core";
import { useExpenseStore } from "../../../../Stores/Billing/expenseStore";

export const ExpenseList = () => {
const {fetchExpenses,deleteExpense}=useExpenseStore();
// functions

// סינון/חיפוש הוצאות
const handleSearch = (query: string): void => {};
const handleFilter = (filter: ExpenseFilter): void => {};

// מעבר לכרטיס הוצאה
const handleSelectExpense = (expenseId: ID): void => {};

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