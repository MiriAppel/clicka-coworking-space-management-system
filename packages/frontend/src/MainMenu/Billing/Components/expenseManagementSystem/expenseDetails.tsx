import { useExpenseStore } from "../../../../Stores/Billing/expenseStore";

export const ExpenseDetails = () => {
const {fetchExpenseDetails,updateExpenseStatus,fetchExpenseDocuments,deleteExpense}=useExpenseStore();

  return (
    <div>
      <h1>Expense Details</h1>
    </div>
  );
};