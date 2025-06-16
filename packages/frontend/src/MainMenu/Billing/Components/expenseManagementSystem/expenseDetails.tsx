import { Expense } from "../../../../../../backend/src/types/expense";
import { ID } from "../../../../../../backend/src/types/core";
import { FileReference } from "../../../../../../backend/src/types/core";

export const ExpenseDetails = () => {

//functions


// שליפת פרטי הוצאה
const fetchExpenseDetails = async (expenseId: ID): Promise<Expense> => {
   return {} as Expense;
};

// עדכון סטטוס הוצאה (אישור/דחייה)
const updateExpenseStatus = async (expenseId: ID, status: string): Promise<Expense> => {
    return {} as Expense;
};

// הצגת מסמכים/קבלות
const fetchExpenseDocuments = async (expenseId: ID): Promise<FileReference[]> => {
     return {} as FileReference[];
};

// מחיקת הוצאה
const deleteExpense = async (expenseId: ID): Promise<void> => {};



  return (
    <div>
      <h1>Expense Details</h1>
    </div>
  );
};