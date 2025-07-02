import { ReportParameters, ReportData, ExpenseCategory } from 'shared-types'; // ייבוא טיפוסים מתואמים ל־shared-types שלך
import { ExpenseService } from './expense.services'; // ייבוא הפונקציה הקיימת לשאיבת הוצאות
import { getRevenues } from './revenue.service'; // ייבוא הפונקציה החדשה שתיצור – לשאיבת הכנסות
import { groupByPeriod } from '../utils/groupingUtils.service'; // פונקציה לעיבוד GroupBy לפי תקופה

/**
 * יצירת דוח הוצאות (Expense Report)
 * @param parameters - פרמטרים שנבחרו (תאריך, קטגוריות וכו')
 * @returns ReportData - תוצאת הדוח לאחר עיבוד
 */
// const expenseService = new ExpenseService(); // יצירת מופע של ExpenseService
// export async function generateExpenseData(parameters: ReportParameters): Promise<ReportData> {
//   // 1. שליפת ההוצאות מתוך ה־ExpenseService
//   const expenses = await ExpenseService.getExpenses(parameters);

//   // 2. קיבוץ הנתונים לפי תקופת הזמן שהמשתמש בחר (month / quarter / year)
//   const groupedData = groupByPeriod(expenses, parameters.groupBy, 'date', 'amount');

//   // 3. המרה לפורמט אחיד של ReportData
//   return {
//     title: 'Expense Report',
//     data: groupedData,
//   };
// }
export async function generateExpenseData(parameters: ReportParameters): Promise<ReportData> {
  const expenseCategories = parameters.categories as ExpenseCategory[] | undefined;
  // 1. שליפת ההוצאות מתוך ה־ExpenseService
  const expenses = await ExpenseService.getExpenses({
    dateFrom: parameters.dateRange?.startDate,
    dateTo: parameters.dateRange?.endDate,
    category: expenseCategories,
    // אם יש שדות נוספים שתומכים בהם, תוסיף כאן
  });

  if (!expenses) {
    // טיפול במקרה שאין נתונים או שגיאה
    return [];
  }

  // 2. קיבוץ הנתונים לפי תקופת הזמן שהמשתמש בחר (month / quarter / year)
  const groupedData = groupByPeriod(expenses, parameters.groupBy, 'date', 'amount');

  // 3. המרה לפורמט אחיד של ReportData
  return {
    title: 'Expense Report',
    data: groupedData,
  };
}


/**
 * יצירת דוח הכנסות (Revenue Report)
 * @param parameters - פרמטרים שנבחרו (תאריך, סוגי חלל וכו')
 * @returns ReportData - תוצאת הדוח לאחר עיבוד
 */
export async function generateRevenueData(parameters: ReportParameters): Promise<ReportData> {
  // 1. שליפת ההכנסות מתוך ה־revenueService
  const revenues = await getRevenues(parameters);

  // 2. קיבוץ הנתונים לפי התקופה שהמשתמש בחר
  const groupedData = groupByPeriod(revenues, parameters.groupBy, 'date', 'amount');

  // 3. החזרת התוצאה בפורמט ReportData
  return {
    title: 'Revenue Report',
    data: groupedData,
  };
}
