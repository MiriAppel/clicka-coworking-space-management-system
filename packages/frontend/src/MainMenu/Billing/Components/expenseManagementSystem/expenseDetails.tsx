import { Expense } from "../../../../../../types/expense";
import { ID } from "../../../../../../types/core";
import { FileReference } from "../../../../../../types/core";
import { useExpenseStore } from "../../../../Stores/Billing/expenseStore";

export const ExpenseDetails = () => {
const {fetchExpenseDetails,updateExpenseStatus,fetchExpenseDocuments,deleteExpense}=useExpenseStore();

  return (
    <div>
      <h1>Expense Details</h1>
    </div>
  );
};