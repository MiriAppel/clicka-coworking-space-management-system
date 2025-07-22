import { Route, Routes } from "react-router-dom";

import { ExpenseManagement } from "./expenseManagementSystem/expenseManagement";
import { ExpenseDetails } from "./expenseManagementSystem/expenseDetails";
import { ExpenseList } from "./expenseManagementSystem/expenseList";
// תוסיפי כאן קומפוננטות נוספות אם יש (כמו יצירת הוצאה חדשה וכו')
export const BillingRouting = () => {
    return (
        <Routes>
            <Route path="/" element={<ExpenseList />} />

        </Routes>
    );
};