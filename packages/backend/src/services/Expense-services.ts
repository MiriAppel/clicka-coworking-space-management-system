const mockExpense: Expense = {
  id: 'exp_001',
  vendor_id: 'vendor_123',
  vendor_name: 'Mock Vendor',
  category: 'office_supplies',
  description: 'Printer ink',
  amount: 150,
  tax: 17,
  date: '2025-06-01',
  due_date: '2025-06-10',
  paid_date: null,
  status: 'pending',
  payment_method: 'credit_card',
  reference: 'INV-1001',
  invoice_number: '1001',
  invoice_file: { name: 'invoice.pdf', url: '/files/invoice.pdf' },
  receipt_file: { name: 'receipt.pdf', url: '/files/receipt.pdf' },
  notes: 'Urgent',
  approved_by: null,
  approved_at: null,
  created_at: '2025-06-01',
  updated_at: '2025-06-01',
};
export const listExpensesByVendor = async (vendorId: string): Promise<Expense[]> => {
     

}
export const insertExpense = async (_expenseData: Partial<Expense>): Promise<Expense> => {
//לקבל אובייקט עם פרטי ההוצאה.
//לבדוק אם הספק קיים
//לשלוח את הנתונים לטבלת expenses במסד הנתונים.
//לשלוף את ההוצאה שנוצרה (או לזהות את ה־ID החדש שחזר מ־Supabase).
//להחזיר תשובה עם הנתונים שנשמרו.
  return  { ...mockExpense, id: 'exp_new' };
};

export const getAllExpenses = async (): Promise<Expense[]> => {
//לשלוף את כל הרשומות מטבלת expenses.
//ניתן להוסיף הצטרפות (join) לטבלת vendors אם רוצים גם את שם הספק לפי vendor_id.
//להחזיר מערך של כל ההוצאות הקיימות.
    return [mockExpense];
};
// מאשר הוצאה לאחר בדיקה על ידי גורם מוסמך. 
export const updateExpenseStatus = async (
  id: string,
  status: 'approved' | 'rejected',
  approvedBy: string
): Promise<Expense> => {
//גורם מוסמך approvedBy בדיקה אם
//לאתר את ההוצאה לפי ה־ID.
//לעדכן את השדות: status, approved_by, approved_at.
// להחזיר הוצאה מעודכנת מאושרת
  return {
    success: true,
    data: {
      ...mockExpense,
      id,
      status,
      approved_by: approvedBy,
      approved_at: new Date().toISOString(),
    },
  };
};

export const getExpenseReport = async (
  startDate: string,
  endDate: string
): Promise<Expense[]> => {
    //לשלוף מהטבלה את כל ההוצאות שה־date שלהן בטווח בין startDate ל־endDate. 
  const inRange = mockExpense.date >= startDate && mockExpense.date <= endDate;
  return inRange  ? [mockExpense] : [];
};