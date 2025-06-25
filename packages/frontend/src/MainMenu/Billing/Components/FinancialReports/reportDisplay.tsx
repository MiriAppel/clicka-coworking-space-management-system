// ייבוא ה-hook מתוך Zustand לניהול מצב הדוחות
import { useFinancialReportsStore } from '../../../../Stores/Billing/financialReportsStore';

// ייבוא קומפוננטת התרשים החוזרת (עם כפתורי ייצוא, תמיכה ב-RTL וכו')
import { ReportChart } from '../../../../Common/Components/BaseComponents/Chart';

// ייבוא טיפוס ENUM של סוגי הדוחות
import{ ReportType } from 'shared-types';

// קומפוננטת React להצגת הדוח שנבחר
const ReportDisplay = () => {
  // שליפת משתנים מה־store המרכזי של הדוחות
  const {
    selectedReport,   // הדוח שנבחר לצפייה
    reportData,       // הנתונים הגולמיים של הדוח (לגרפים)
    error             // שגיאה כללית אם קרתה בזמן שליפת הדוח
  } = useFinancialReportsStore();

  // במקרה של שגיאה – מציגים הודעת שגיאה באדום
  if (error) {
    return <p style={{ color: 'red' }}>שגיאה בהצגת הדוח. אנא נסי שוב.</p>;
  }

  // אם אין נתונים – מציגים הודעה שהנתונים חסרים
  if (!reportData || !reportData.expenseData) {
    return <p>לא נמצאו נתונים להצגה.</p>;
  }

  // אם לא נבחר דוח – מציגים בקשה לבחור דוח
  if (!selectedReport) {
    return <p>בחרי דוח להצגה.</p>;
  }

  // חילוץ סוג הדוח מתוך הדוח שנבחר (REVENUE, EXPENSES וכו’)
  const { type } = selectedReport;

  // פונקציה שמחזירה את סוג הגרף לפי סוג הדוח
  const chartType: 'bar' | 'line' | 'pie' = (() => {
    switch (type) {
      case ReportType.REVENUE:           // דוח הכנסות → גרף עמודות
      case ReportType.EXPENSES:          // דוח הוצאות → גרף עמודות
      case ReportType.PROFIT_LOSS:       // דוח רווח/הפסד → גרף עמודות
        return 'bar';

      case ReportType.CUSTOMER_AGING:    // דוח ותק לקוחות → גרף קווי
        return 'line';

      default:                           // ברירת מחדל לכל סוג לא מוכר
        return 'bar';
    }
  })();

  // מיפוי הנתונים לצורה אחידה ש־ReportChart יודע לקרוא
  const chartData = reportData.expenseData.monthlyTrend.map((item: any) => {
    // שדה label יכיל את שם התקופה / קטגוריה / לקוח – מה שקיים
    let label = item.period || item.category || item.customerName || '';

    // שדה value יכיל את הערך העיקרי להצגה – תלוי בדוח
    let value =
      item.totalRevenue ??       // לדוח הכנסות
      item.totalExpenses ??      // לדוח הוצאות
      item.balance ??            // לרווח/הפסד
      item.revenue ??            // אפשרות נוספת
      item.expenses ??           // אפשרות נוספת
      item.monthsActive ??       // לדוח לקוחות
      item.value ??              // ברירת מחדל כללית
      0;                         // אם כלום לא קיים – אפס

//     // החזרת אובייקט מתאים לגרף: { label, value }
    return { label, value };
  });

//   // JSX להצגת הגרף בתוך קונטיינר עם מרווח עליון
  return (
    <div style={{ marginTop: '2rem' }}>
       {/* קומפוננטת הגרף עם כותרת, סוג גרף והנתונים */}
      <ReportChart
        title={`דוח: ${type}`}   // כותרת גרף – סוג הדוח
        type={chartType}         // סוג התרשים (עמודות/קו/עוגה)
        data={chartData}         // הנתונים המותאמים לגרף
      />
     </div>
  );
};

// // ייצוא הקומפוננטה לשימוש במקומות אחרים
export default ReportDisplay;
