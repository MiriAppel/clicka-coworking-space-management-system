import { Expense, ExpenseCategory } from "../../../../../../backend/src/types/expense";
import { ValidationResult } from "../../../../../../backend/src/types/validationResult";
import { ID } from "../../../../../../backend/src/types/core";

export const ExpenseForm = () => {

  //functions
  // שליפת פרטי הוצאה לעריכה
  const fetchExpenseDetails = async (expenseId: ID): Promise<Expense> => {
  return {} as Expense;
  };

  // טיפול בשינוי ערך שדה בטופס
  const handleFieldChange = (field: keyof Expense, value: any): void => { };

  // ולידציה של טופס הוצאה
  const validateExpenseForm = (data: Expense): ValidationResult => {
    return { isValid: true, errors: [] };
   };

  // שליחת טופס יצירת הוצאה חדשה
  const handleCreateExpense = async (data: Expense): Promise<Expense> => {
    return Promise.resolve(data);
  };

  // שליחת טופס עדכון הוצאה קיימת
  const handleUpdateExpense = async (expenseId: ID, data: Expense): Promise<Expense> => {
    return Promise.resolve(data);
  };

  // איפוס הטופס
  const resetForm = (): void => { };

  // סגירת הטופס
  const handleCloseForm = (): void => { };





  return <div>

  </div>

}
