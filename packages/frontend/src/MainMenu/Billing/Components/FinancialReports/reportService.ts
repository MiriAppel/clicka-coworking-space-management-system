import { ReportData, ReportParameters, ReportType, ExpenseCategory } from 'shared-types';
/**
 * פונקציה כללית לשליחת בקשה לשרת לקבלת דוח
 * @param type - סוג הדוח (REVENUE / EXPENSES)
 * @param parameters - הפרמטרים שנבחרו ע"י המשתמש (תאריכים, פילטרים וכו')
 * @returns תוצאת הדוח בפורמט ReportData או מוק דאטה אם יש שגיאה
 */
export async function fetchReportData(type: ReportType, parameters: ReportParameters): Promise<ReportData> {
  const API_BASE = process.env.REACT_APP_API_URL;

  try {
    const response = await fetch(`/reports/${type}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(parameters),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch report: ${response.statusText}`);
    }

    const data: ReportData = await response.json();
    return data;

  } catch (error) {
    console.error('Error fetching report:', error);

    // כאן מחזירים מוק דאטה במקרה של שגיאה
    const mockData: ReportData = {
      revenueData: {
        totalRevenue: 25000,
        membershipRevenue: 10000,
        meetingRoomRevenue: 8000,
        loungeRevenue: 5000,
        otherRevenue: 2000,
        breakdown: [
          {
            date: '2025-06-01',
            totalRevenue: 8000,
            membershipRevenue: 3000,
            meetingRoomRevenue: 2500,
            loungeRevenue: 2000,
          },
          {
            date: '2025-06-15',
            totalRevenue: 17000,
            membershipRevenue: 7000,
            meetingRoomRevenue: 5500,
            loungeRevenue: 3000,
          },
        ],
      },
      expenseData: {
        totalExpenses: 12000,
        expensesByCategory: [
          { category: ExpenseCategory.RENT, amount: 5000, percentage: 41.6 },
          { category: ExpenseCategory.SALARIES, amount: 4000, percentage: 33.3 },
          { category: ExpenseCategory.UTILITIES, amount: 3000, percentage: 25.0 },
        ],
        monthlyTrend: [
          {
            month: '2025-06',
            totalExpenses: 12000,
            topCategories: [
              { category: ExpenseCategory.RENT, amount: 5000 },
              { category: ExpenseCategory.SALARIES, amount: 4000 },
              { category: ExpenseCategory.UTILITIES, amount: 3000 },
            ],
          },
        ],
      },
    };


    return mockData;
  }
}
