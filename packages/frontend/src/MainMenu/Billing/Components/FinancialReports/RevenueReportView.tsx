// קומפוננטת דו"ח הכנסות עם תיעוד מפורט על כל שורה
import React, { useEffect, useState } from 'react'; // ייבוא React ו־hooks
import { useFinancialReportsStore } from '../../../../Stores/Billing/financialReportsStore'; // שימוש ב־Zustand store לדוחות פיננסיים
import { ReportChart } from '../../../../Common/Components/BaseComponents/Chart'; // קומפוננטת גרף כללית
import type { DateRangeFilter, RevenueReportResponse } from 'shared-types'; // טיפוסים רלוונטיים

const RevenueReportView: React.FC = () => {
  // סטייט לטווח תאריכים לבקשת הדוח
  const [dateRange, setDateRange] = useState<DateRangeFilter>({
    startDate: '2024-01-01',
    endDate: '2024-12-31',
  });

  // סטייט לתוצאת דוח ההכנסות שהתקבלה מהשרת
  const [revenueData, setRevenueData] = useState<RevenueReportResponse>();
  
  // סטייטים לניהול מצב טעינה ושגיאה
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // שליפת פונקציית generateRevenueData מה־store
  const { generateRevenueData } = useFinancialReportsStore();

  // אפקט שמריץ קריאה לדוח בכל שינוי של טווח תאריכים
  useEffect(() => {
    setLoading(true);           // התחלת טעינה
    setError(null);             // איפוס שגיאה קודמת

    generateRevenueData({ dateRange })
      .then((data) => setRevenueData(data))     // שמירת תוצאת הדוח בסטייט
      .catch(() => setError('שגיאה בטעינת הדוח')) // טיפול בשגיאה
      .finally(() => setLoading(false));        // סיום טעינה
  }, [dateRange]);

  // פונקציה לעיצוב תאריכים בפורמט "ינו׳ 2024"
  const formatMonthYear = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('he-IL', {
      month: 'short',
      year: 'numeric',
    }).format(date);
  };

  // הכנת נתוני הגרף לפי הנתונים שהתקבלו מהשרת
  const chartData = revenueData?.revenueData?.map((item) => ({
    label: formatMonthYear(item.date), // תווית בציר X
    value: item.totalRevenue,          // ערך בציר Y
  })) ?? []; // ברירת מחדל: מערך ריק אם אין נתונים

  return (
    <div className="p-6 bg-white rounded shadow space-y-6">
      {/* כותרת הדוח */}
      <h2 className="text-2xl font-bold">דו"ח הכנסות</h2>

      {/* טופס סינון לפי תאריכים */}
      <div className="flex gap-4 items-center">
        <label>
          מתאריך:
          <input
            type="date"
            value={dateRange.startDate}
            onChange={(e) =>
              setDateRange((prev) => ({ ...prev, startDate: e.target.value }))
            }
          />
        </label>
        <label>
          עד תאריך:
          <input
            type="date"
            value={dateRange.endDate}
            onChange={(e) =>
              setDateRange((prev) => ({ ...prev, endDate: e.target.value }))
            }
          />
        </label>
      </div>

      {/* הצגת מצבי טעינה, שגיאה או אין נתונים */}
      {loading && <p>טוען נתונים...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && chartData.length === 0 && <p>אין נתונים להצגה</p>}

      {/* הצגת גרף אם יש נתונים */}
      {chartData.length > 0 && (
        <ReportChart
          title="הכנסות לפי חודש" // כותרת הגרף
          type="line"              // סוג הגרף: קו
          data={chartData}         // מערך הנתונים להצגה
        />
      )}
    </div>
  );
};

export default RevenueReportView; // ייצוא הקומפוננטה לשימוש חיצוני
