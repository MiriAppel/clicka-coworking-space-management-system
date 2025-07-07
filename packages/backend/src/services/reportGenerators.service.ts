import { ReportParameters, ReportData, ExpenseCategory, ExpenseReportData } from 'shared-types'; // ייבוא טיפוסים מתואמים ל־shared-types שלך
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

export async function generateExpenseData(parameters: ReportParameters): Promise<ReportData | null> {
  const expenseService = new ExpenseService();

  const expenseCategories = parameters.categories as ExpenseCategory[] | undefined;

  // 1. שליפת כל ההוצאות לפי פרמטרים
  const expenses = await expenseService.getExpenses({
    dateFrom: parameters.dateRange?.startDate,
    dateTo: parameters.dateRange?.endDate,
    category: expenseCategories,
    vendorId: parameters.customerIds?.at(0),
  });

  if (!expenses || expenses.length === 0) {
    return null;
  }

  // 2. קיבוץ לפי תקופה (month / quarter / year) – מחזיר מערך של { label, value }
  const groupedByPeriod = groupByPeriod(expenses, parameters.groupBy, 'date', 'amount');

  // 3. בניית ה־monthlyTrend עם קטגוריות עיקריות
  const monthlyTrend = groupedByPeriod.map((group) => {
    const periodLabel = group.label;

    // מסנן רק את ההוצאות ששייכות לתקופה הזו (לפי group.key שזה תאריך מקורי)
    const expensesInPeriod = expenses.filter((e) => {
      const periodOfE = getPeriodLabel(e.date, parameters.groupBy); // פונקציה שתזהה חודש/רבעון/שנה
      return periodOfE === periodLabel;
    });

    // קיבוץ לפי קטגוריה
    const sumsByCategory: Record<ExpenseCategory, number> = {} as Record<ExpenseCategory, number>;
    for (const expense of expensesInPeriod) {
      const cat = (expense.category || 'OTHER') as ExpenseCategory;
      sumsByCategory[cat] = (sumsByCategory[cat] || 0) + expense.amount;
    }

    // מיון ולקיחת שלוש הקטגוריות עם הסכום הכי גבוה
    const topCategories = Object.entries(sumsByCategory)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([category, amount]) => ({
        category: category as ExpenseCategory,
        amount,
      }));

    return {
      month: periodLabel,
      totalExpenses: group.value,
      topCategories,
    };
  });

  const expenseData: ExpenseReportData = {
    totalExpenses: expenses.reduce((sum, e) => sum + e.amount, 0),
    expensesByCategory: [], // ניתן להשלים אם תרצי תרשים לפי קטגוריות
    monthlyTrend,
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
function getPeriodLabel(dateStr: string, groupBy: 'month' | 'quarter' | 'year' = 'month'): string {
  const date = new Date(dateStr);
  const year = date.getFullYear();

  if (groupBy === 'year') {
    return `${year}`;
  }

  if (groupBy === 'quarter') {
    const quarter = Math.floor(date.getMonth() / 3) + 1;
    return `Q${quarter} ${year}`;
  }

  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  return `${year}-${month}`; // למשל: 2025-06
}


// פונקציה ליצירת דוח הכנסות כולל פילוח לפי סוגי הכנסה
// פונקציה לחישוב נתוני הכנסות מתוך תשלומים בפועל, תוך התאמה לדוח מסוג ReportData
import { Payment, Invoice, BillingItem, BillingItemType } from 'shared-types';
import { PaymentService } from '../services/payments.service'; // ייבוא הפונקציה לשאיבת תשלומים
import { serviceGetInvoiceById } from '../services/invoice.service'; // ייבוא הפונקציה לשאיבת חשבוניות

/**
 * הפקת דוח הכנסות מבוסס תשלומים בפועל
 * @param parameters - פרמטרים לדוח (טווח תאריכים, קיבוץ וכו')
 * @returns ReportData - דוח הכנסות מסווג לפי סוג שירותים
 */
export async function generateRevenueDataFromPayments(parameters: ReportParameters): Promise<ReportData> {
  console.log('Generating revenue data with parameters:', parameters);
  
  const paymentService = new PaymentService(); // יצירת מופע של PaymentService
  // שלב 1: שליפת כל התשלומים לפי טווח התאריכים
  const payments: Payment[] = await paymentService.getPaymentByDate({
    dateFrom: parameters.dateRange.startDate,
    dateTo: parameters.dateRange.endDate,
  });
console.log(payments);

  // משתנים לאגירת סכומים לפי סוג
  let membershipRevenue = 0;
  let meetingRoomRevenue = 0;
  let loungeRevenue = 0;
  let otherRevenue = 0;

  // אוסף נתונים לקיבוץ לפי תקופה
  const groupedRaw: { date: string; amount: number; type: BillingItemType }[] = [];

  // שלב 2: מעבר על כל תשלום וסיווג לפי סוג ההכנסה
  for (const payment of payments) {
    let type: BillingItemType = BillingItemType.OTHER;

    // בדיקת שיוך לחשבונית כדי להבין את סוג השירות
    if (payment.invoice_id) {
      const invoice: Invoice | null = await serviceGetInvoiceById(payment.invoice_id);

      if (invoice && invoice.items && invoice.items.length > 0) {
        // בודק מהו הסוג הדומיננטי של פריטי החשבונית
        const typeCounts: Record<BillingItemType, number> = {} as any;
        for (const item of invoice.items) {
          typeCounts[item.type] = (typeCounts[item.type] || 0) + item.total_price;
        }

        // בוחר את סוג הפריט עם הסכום הגבוה ביותר
        type = Object.entries(typeCounts).sort((a, b) => b[1] - a[1])[0][0] as BillingItemType;
      }
    }

    // סיווג לסוג הכנסה בהתאם
    switch (type) {
      case BillingItemType.WORKSPACE:
        membershipRevenue += payment.amount;
        break;
      case BillingItemType.MEETING_ROOM:
        meetingRoomRevenue += payment.amount;
        break;
      case BillingItemType.LOUNGE:
        loungeRevenue += payment.amount;
        break;
      default:
        otherRevenue += payment.amount;
        break;
    }

    // הוספת התשלום לקיבוץ לפי תאריך
    groupedRaw.push({
      date: payment.date,
      amount: payment.amount,
      type: type,
    });
  }

  // שלב 3: קיבוץ לפי תקופה (חודש / רבעון / שנה)
  const grouped = groupByPeriod(groupedRaw, parameters.groupBy ?? 'month', 'date', 'amount');

  // שלב 4: בניית breakdown לפי תקופה — עם סכומים בסיסיים (ניתן לשפר לפירוט לכל סוג בעתיד)
  const breakdown = grouped.map((g) => ({
    date: g.label,
    totalRevenue: g.value,
    membershipRevenue: 0,
    meetingRoomRevenue: 0,
    loungeRevenue: 0,
  }));

  // שלב 5: הרכבת הדוח הסופי לפי הממשק ReportData
  const reportData: ReportData = {
    revenueData: {
      totalRevenue: membershipRevenue + meetingRoomRevenue + loungeRevenue + otherRevenue,
      membershipRevenue,
      meetingRoomRevenue,
      loungeRevenue,
      otherRevenue,
      breakdown,
    },
    expenseData: {
      totalExpenses: 0,
      expensesByCategory: [],
      monthlyTrend: [],
    },
  };

  return reportData;
}
