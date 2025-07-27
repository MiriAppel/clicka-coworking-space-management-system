// ייבוא של store לניהול מצב ופעולות הקשורות לדוחות פיננסיים
import { useFinancialReportsStore } from '../../../../Stores/Billing/financialReportsStore';
// ייבוא קומפוננטת השליטה (טופס בחירה והזנת פרמטרים)
import ReportControls from "./ReportControls";
// ייבוא קומפוננטת ההצגה של הדוחות
import ReportDisplay from './reportDisplay';
// import ReportDisplay from './reportDisplay';


// קומפוננטת האב המאגדת את כל מערכת הדוחות
const FinancialReports = () => {
  // שליפה מה־store של פונקציות לטיפול בדוחות פיננסיים
  const {
    checkUserPermissions,               // בדיקת הרשאות למשתמש
    // handleReportGenerationTimeout,      // טיפול במקרה שהפקת הדוח נמשכת יותר מדי זמן
    generateReport,                     // הפעלת תהליך הפקת דוח לפי סוג
    fetchReportData,                    // שליפת נתוני דוח מהשרת
    generateRevenueData,                // יצירת נתוני דוח הכנסות
    generateExpenseData,                // יצירת נתוני דוח הוצאות
    generateCashFlowData,               // יצירת נתוני תזרים מזומנים
    generateCustomerAgingData,          // יצירת נתוני הזדקנות לקוחות
    generateOccupancyRevenueData,       // יצירת נתוני תפוסה והכנסות
    exportReport,                       // ייצוא הדוח (PDF, Excel וכו')
    handleReportError,                  // טיפול בשגיאות בזמן הפקת דוח
    generateProfitLossData              // יצירת דוח רווח והפסד
  } = useFinancialReportsStore();       // קריאה ל־custom hook שמחזיר את הפונקציות מה־store

  // JSX - מבנה הקומפוננטה המוחזר
  return (
    <>
      {/* כותרת או טקסט קבוע בדף */}
      <div>FinancialReports</div>

      {/* קומפוננטת הטופס להזנת פרמטרים לבחירת דוח */}
      <ReportControls></ReportControls>

{/* קומפוננטת הצגת הדוח שנוצר */}
      {/* <ReportDisplay></ReportDisplay> */}
    </>
  );
};

// // ייצוא ברירת מחדל של הקומפוננטה לצורך שימוש בקובץ אחר
export default FinancialReports;
