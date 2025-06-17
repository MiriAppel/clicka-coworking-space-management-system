import { Expense } from "../../../../../../backend/src/types/expense";
import { ID } from "../../../../../../backend/src/types/core";
import { FileReference } from "../../../../../../backend/src/types/core";
import { useExpenseStore } from "../../../../Stores/Billing/expenseStore";

export const ExpenseDetails = () => {
const {fetchExpenseDetails,updateExpenseStatus,fetchExpenseDocuments,deleteExpense}=useExpenseStore();

  return (
    <div>
      <h1>Expense Details</h1>
    </div>
  );
};