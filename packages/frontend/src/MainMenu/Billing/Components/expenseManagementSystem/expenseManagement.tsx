import type{ ID } from "shared-types";
import { useExpenseStore } from "../../../../Stores/Billing/expenseStore";
export const ExpenseManagement = () => {

    const { fetchExpenses,createExpense,updateExpense,deleteExpense
    } = useExpenseStore();
    //in the store
    //functions

    // רענון רשימת הוצאות
    const refreshExpenseList = (): Promise<void> => {
        return  fetchExpenses();
    };

    // סינון הוצאות לפי קטגוריה/ספק/תאריכים
    // const filterExpenses = (filter: ExpenseFilter): Promise<Expense[]> => {
    //     return {} as Promise<Expense[]>;
    // };

    // מעבר לכרטיס הוצאה
    const handleSelectExpense = (expenseId: ID): void => { };

    return (
        <div>
            <h1>Expense Management</h1>
        </div>
    )
}

