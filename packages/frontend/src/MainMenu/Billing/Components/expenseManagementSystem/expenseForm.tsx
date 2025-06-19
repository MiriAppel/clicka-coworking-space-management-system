import { Expense, ExpenseCategory } from "../../../../types/expense";
// import { ValidationResult } from "../../../../types/report";
import { ID } from "../../../../types/core";
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
