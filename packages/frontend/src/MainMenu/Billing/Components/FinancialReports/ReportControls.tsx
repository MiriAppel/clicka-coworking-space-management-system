import { useState } from 'react'; // ייבוא של useState מ-React לצורך ניהול state מקומי
import { useFinancialReportsStore } from '../../../../Stores/Billing/financialReportsStore'; // ייבוא store מותאם לניהול דוחות פיננסיים
import { DateRangeFilter, ReportType } from 'shared-types'; // ייבוא טיפוס של טווח תאריכים משותף

// מיפוי בין סוגי הדוחות לבין תוויות בעברית להצגה בתפריט הבחירה
const ReportLabels: Record<ReportType, string> = {
  [ReportType.REVENUE]: 'הכנסות',
  [ReportType.EXPENSES]: 'הוצאות',
  [ReportType.PROFIT_LOSS]: 'רווח והפסד',
  [ReportType.CASH_FLOW]: 'תזרים מזומנים',
  [ReportType.CUSTOMER_AGING]: 'הזדקנות לקוחות',
  [ReportType.OCCUPANCY_REVENUE]: 'תפוסה והכנסות'
};

// קומפוננטת הטופס לבחירת סוג דוח וטווח תאריכים
const ReportControls = () => {
  // שליפת מתודות מה־store של הדוחות
  const {
    handleReportTypeChange,   // שינוי סוג הדוח ב־store
    handleDateRangeChange,    // שינוי טווח התאריכים ב־store
    // validateReportParameters, // ולידציה על הפרמטרים לפני יצירת דוח
    resetReportParameters,    // איפוס שדות הטופס
    generateReport,           // יצירת דוח בפועל
    displayReport             // הצגת הדוח שנוצר
  } = useFinancialReportsStore();

  // סטייט מקומי עבור סוג הדוח שנבחר (ברירת מחדל: הכנסות)
  const [reportType, setReportType] = useState<ReportType>(ReportType.REVENUE);

  // סטייט מקומי עבור טווח תאריכים - תאריך התחלה וסיום (ברירת מחדל: היום)
  const [dateRange, setDateRange] = useState<DateRangeFilter>({
    startDate: new Date().toISOString().substring(0, 10), // תאריך היום בפורמט YYYY-MM-DD
    endDate: new Date().toISOString().substring(0, 10)
  });

  // פונקציה שמופעלת בלחיצה על "צור דוח"
  const handleSubmit = async () => {
    // עדכון הנתונים ב־store לפי בחירת המשתמש
    handleReportTypeChange(reportType);
    handleDateRangeChange(dateRange);

    // יצירת אובייקט פרמטרים בפורמט הנדרש
    const params = {
      reportType,
      dateRange: {
        startDate: dateRange.startDate,
        endDate: dateRange.endDate
      }
    };

    // בדיקת תקינות הקלטים
    // const validation = validateReportParameters(params);
    // if (!validation.isValid) {
      // alert('יש למלא את כל השדות הדרושים'); // הודעת שגיאה אם הקלט לא תקין
      // return;
    // }

    // יצירת הדוח ושליחתו לתצוגה
    const report = await generateReport(reportType, params);
    displayReport(report);
  };

  // מבנה הטופס והאלמנטים: תפריט בחירת סוג דוח, בחירת תאריכים וכפתורים
  return (
    <div dir="rtl" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <label>
        סוג דוח:
        <select
          value={reportType}
          onChange={(e) => setReportType(e.target.value as ReportType)} // עדכון סוג הדוח בסטייט
        >
          {Object.values(ReportType).map((type) => (
            <option key={type} value={type}>
              {ReportLabels[type]} {/* הצגת שם הדוח בעברית */}
            </option>
          ))}
        </select>
      </label>

       <label>
         מתאריך:
        <input
          type="date"
          value={dateRange.startDate}
          onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })} // עדכון תאריך התחלה
        />
      </label>

      <label>
        עד תאריך:
        <input
          type="date"
          value={dateRange.endDate}
          onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })} // עדכון תאריך סיום
        />
      </label>

      <div style={{ display: 'flex', gap: '1rem' }}>
        <button onClick={handleSubmit}>צור דוח</button> {/* שליחת הטופס */}
        <button onClick={resetReportParameters}>איפוס</button> {/* איפוס שדות הטופס */}
      </div>
    </div>
  );
};

export default ReportControls; // ייצוא הקומפוננטה לשימוש חיצוני
