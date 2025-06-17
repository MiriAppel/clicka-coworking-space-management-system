import { Expense, ExpenseCategory } from "../../../../../../backend/src/types/expense";
import { ValidationResult } from "../../../../../../backend/src/types/validationResult";
import { ID } from "../../../../../../backend/src/types/core";
import { useExpenseStore } from "../../../../Stores/Billing/expenseStore";

export const ExpenseForm = () => {
const {fetchExpenseDetails,handleCreateExpense,handleUpdateExpense,
  handleFieldChange,resetForm,validateExpenseForm}= useExpenseStore();
  //functions


  // סגירת הטופס
  const handleCloseForm = (): void => { };



  return <div>

  </div>

}
