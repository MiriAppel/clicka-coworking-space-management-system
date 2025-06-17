import { FinancialReport } from "../../../../../../backend/src/types/report";
import { useFinancialReportsStore } from "../../../../Stores/Billing/financialReportsStore";

const ReportDisplay=()=>{
const {displayReport,handleExportClick,displayReportError,}=useFinancialReportsStore();
//functions
//in the store
    return <div>
        <h1>Report Display</h1> 
         </div>
}
export default ReportDisplay;