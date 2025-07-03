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

export async function generateExpenseData(parameters: ReportParameters): Promise<ReportData|null> {
 const expenseService=new ExpenseService(); // יצירת מופע של ExpenseService
  const expenseCategories = parameters.categories as ExpenseCategory[] | undefined;
  // 1. שליפת ההוצאות מתוך ה־ExpenseService
  const expenses = await expenseService.getExpenses({
    dateFrom: parameters.dateRange?.startDate,
    dateTo: parameters.dateRange?.endDate,
    category: expenseCategories,
    vendorId: parameters.customerIds?.at(0), // אם יש לך פרמטר של ספקים
    // אם יש שדות נוספים שתומכים בהם, תוסיף כאן
  });

  if (!expenses) {
    // טיפול במקרה שאין נתונים או שגיאה
    return null;
  }
  // 2. קיבוץ הנתונים לפי תקופת הזמן שהמשתמש בחר (month / quarter / year)
  const groupedData = groupByPeriod(expenses, parameters.groupBy, 'date', 'amount');
const expenseData = {
    totalExpenses: expenses.reduce((sum, e) => sum + e.amount, 0),
    expensesByCategory: [], // אם תרצי למלא לפי קטגוריות - תמלאי כאן
    monthlyTrend: groupedData.map((g) => ({
      month: g.label,
      totalExpenses: g.value,
      topCategories: [], // אפשר לבנות לפי הצורך
    })),
  };

  const reportData: ReportData = {
    revenueData: {
      totalRevenue: 0,
      membershipRevenue: 0,
      meetingRoomRevenue: 0,
      loungeRevenue: 0,
      otherRevenue: 0,
      breakdown: [],
    },
    expenseData,
  };

  return reportData;
} 
export async function generateRevenueData(parameters: ReportParameters): Promise<ReportData> {
  // 1. שליפת ההכנסות מתוך ה־revenueService
  const revenues = await getRevenues(parameters);

  // 2. קיבוץ הנתונים לפי התקופה שהמשתמש בחר
  const groupedData = groupByPeriod(revenues, parameters.groupBy, 'date', 'amount');
const reportData: ReportData = {
    revenueData: {
      totalRevenue: revenues.reduce((sum, r) => sum + r.amount, 0),
      membershipRevenue: 0, // אם תרצי, תמלאי כאן
      meetingRoomRevenue: 0,
      loungeRevenue: 0,
      otherRevenue: 0,
      breakdown: groupedData.map((g) => ({
        date: g.label,
        totalRevenue: g.value,
        membershipRevenue: 0, // אפשר למלא אם תרצי
        meetingRoomRevenue: 0,
        loungeRevenue: 0,
      })),
    },
    expenseData: {
      totalExpenses: 0,
      expensesByCategory: [],
      monthlyTrend: [],
    },
  };

  return reportData;
}
