import { FinancialReport, ReportType, ReportParameters } from "../../../../../../backend/src/types/financialReport";
import { Expense } from "../../../../../../backend/src/types/expense";
import { Payment } from "../../../../../../backend/src/types/payment";
import { Invoice } from "../../../../../../backend/src/types/invoice";
import { ID } from "../../../../../../backend/src/types/core";
import { useDashboardStore } from "../../../../Stores/Billing/dashboardStore";

export const DashboardOverview = () => {
const {fetchDashboardSummary,fetchMainReports,fetchFinancialSummary,fetchRecentExpenses,
fetchRecentPayments,fetchRecentInvoices,fetchDashboardAlerts,fetchChartData
  } = useDashboardStore();  



  // פעולות מהירות (גישה מהירה למשימות חיוב נפוצות)
  const quickActions = [
    { label: "יצירת חשבונית", action: () => {} },
    { label: "יצירת קבלה", action: () => {} },
    { label: "יצירת דוח", action: () => {} },
    { label: "רישום תשלום", action: () => {} }
  ];

  return (
    <div>
      <h1>Dashboard Overview</h1>
      {/* כאן תוכל להוסיף תצוגות: סיכום פיננסי, גרפים, עסקאות אחרונות, התראות, פעולות מהירות */}
    </div>
  );
};