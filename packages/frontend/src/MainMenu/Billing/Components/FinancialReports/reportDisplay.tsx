import { FinancialReport } from "../../../../../../backend/src/types/report";

const ReportDisplay=()=>{

//functions
// הצגת דוח
const displayReport = (report: FinancialReport): void => {
  // Implementation will go here
};

// ייצוא דוח מהתצוגה
const handleExportClick = (report: FinancialReport, format: 'pdf' | 'csv' | 'xlsx'): void => {
  // Implementation will go here
};

// הצגת שגיאה בדוח
const displayReportError = (error: Error): void => {
  // Implementation will go here
};


    return <div>
        <h1>Report Display</h1> 
         </div>
}
export default ReportDisplay;