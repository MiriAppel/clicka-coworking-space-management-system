// קומפוננטה גנרית להצגת דוחות לפי סוג (REVENUE, EXPENSES, PROFIT_LOSS, וכו')
import React, { useEffect, useState } from 'react';
import { useFinancialReportsStore } from '../../../../Stores/Billing/financialReportsStore';
import { ReportChart } from '../../../../Common/Components/BaseComponents/Chart';
import { Table } from '../../../../Common/Components/BaseComponents/Table';
import type {
  DateRangeFilter,
  RevenueReportData,
  ExpenseReportData,
  ReportData
} from 'shared-types';
import { ReportType } from 'shared-types';

// פרופסים שהקומפוננטה מקבלת מבחוץ
interface DynamicReportViewProps {
  type: ReportType;     // סוג הדוח לביצוע
  title: string;        // כותרת לתצוגה למשתמש
  groupBy?: 'month' | 'quarter' | 'year';     // קיבוץ אופציונלי לדוחות רלוונטיים
}

// קומפוננטת הדוח
export const DynamicReportView: React.FC<DynamicReportViewProps> = ({ type, title, groupBy }) => {
  // state לטווח התאריכים
  const [dateRange, setDateRange] = useState<DateRangeFilter>({
    startDate: '2024-01-01',
    endDate: '2024-12-31',
  });

  // שליפת פונקציות ונתונים מה־store
  const {
    generateRevenueData,
    generateExpenseData,
    reportData,
    loading,
    error,
  } = useFinancialReportsStore();

  // קריאה לדוח לפי סוג ברגע שיש שינוי בטווח או סוג הדוח
  useEffect(() => {
    switch (type) {
      case ReportType.REVENUE:
        generateRevenueData({ dateRange, groupBy });
        break;
      case ReportType.EXPENSES:
        generateExpenseData({ dateRange });
        break;
    }
  }, [type, dateRange, groupBy]);

  // עיצוב תאריך לפורמט עברי קצר (לגרפים)
  const formatMonthYear = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('he-IL', {
      month: 'short',
      year: 'numeric',
    }).format(date);
  };

  // משתנים כלליים לגרף וטבלה
  let chartType: 'line' | 'bar' | 'pie' = 'line';
  let chartData: { label: string; value: number }[] = [];
  let tableData: Record<string, any>[] = [];
  let columns: { header: string; accessor: string }[] = [];

  // מיפוי נתונים לפי סוג הדוח (מתוך reportData המשותף)
  const data: ReportData | undefined = reportData;

  switch (type) {
    case ReportType.REVENUE: {
      const revenue = data?.revenueData as RevenueReportData;
      chartData = revenue?.breakdown?.map((item) => ({
        label: formatMonthYear(item.date),
        value: item.totalRevenue,
      })) ?? [];

      tableData = revenue?.breakdown?.map((item) => ({
        date: formatMonthYear(item.date),
        totalRevenue: item.totalRevenue,
        membershipRevenue: item.membershipRevenue,
        meetingRoomRevenue: item.meetingRoomRevenue,
        loungeRevenue: item.loungeRevenue,
        // otherRevenue: item.otherRevenue,
      })) ?? [];

      columns = [
        { header: 'חודש', accessor: 'date' },
        { header: 'סה"כ הכנסות', accessor: 'totalRevenue' },
        { header: 'מנויים', accessor: 'membershipRevenue' },
        { header: 'חדרי ישיבות', accessor: 'meetingRoomRevenue' },
        { header: 'לאונג׳', accessor: 'loungeRevenue' },
        { header: 'אחר', accessor: 'otherRevenue' },
      ];

      chartType = 'line';
      break;
    }

    case ReportType.EXPENSES: {
      const expenses = data?.expenseData as ExpenseReportData;

      chartData = expenses?.expensesByCategory?.map((item) => ({
        label: item.category,
        value: item.amount,
      })) ?? [];

      tableData = expenses?.expensesByCategory?.map((item) => ({
        category: item.category,
        amount: item.amount,
        percentage: item.percentage,
      })) ?? [];

      columns = [
        { header: 'קטגוריה', accessor: 'category' },
        { header: 'סכום', accessor: 'amount' },
        { header: 'אחוז', accessor: 'percentage' },
      ];

      chartType = 'pie';
      break;
    }
  }

  return (
    <div className="p-6 bg-white rounded shadow space-y-6">
      <h2 className="text-2xl font-bold">{title}</h2>

      {/* סינון לפי תאריכים */}
      <div className="flex gap-4 items-center">
        <label>
          מתאריך:
          <input
            type="date"
            value={dateRange.startDate}
            onChange={(e) => setDateRange((prev) => ({ ...prev, startDate: e.target.value }))}
          />
        </label>
        <label>
          עד תאריך:
          <input
            type="date"
            value={dateRange.endDate}
            onChange={(e) => setDateRange((prev) => ({ ...prev, endDate: e.target.value }))}
          />
        </label>
      </div>

      {/* טעינה / שגיאה / אין נתונים */}
      {loading && <p>טוען נתונים...</p>}
      {error && <p className="text-red-500">שגיאה בטעינת הדוח</p>}
      {!loading && chartData.length === 0 && <p>אין נתונים להצגה</p>}

      {/* גרף */}
      {chartData.length > 0 && (
        <ReportChart title={title} type={chartType} data={chartData} />
      )}

      {/* טבלה */}
      {tableData.length > 0 && (
        <Table data={tableData} columns={columns} />
      )}
    </div>
  );
};
