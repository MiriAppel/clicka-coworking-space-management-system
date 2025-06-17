import { ExpenseCategory } from '../../../../../../backend/src/types/expense';
import { FileReference, ID } from '../../../../../../backend/src/types/core'; // Importing FileReference type
import type { ExpenseReportByCategoryAndVendor, FinancialReport, ReportData, ReportParameters, ReportType, RevenueReportByWorkspaceAndPeriod } from '../../../../../../backend/src/types/report'; // Importing types from the reportTypes file";
import { WorkspaceType } from '../../../../../../backend/src/types/customer'; // Importing WorkspaceType type';
import { useFinancialReportsStore } from '../../../../Stores/Billing/financialReportsStore';
const FinancialReports = () => {

  const {checkUserPermissions,handleReportGenerationTimeout
    ,generateReport,fetchReportData,generateRevenueData,generateExpenseData,
    generateCashFlowData,generateCustomerAgingData,generateOccupancyRevenueData,
  getExpenseReportByCategoryAndVendor,getRevenueReportByWorkspaceTypeAndPeriod,
  exportReport,handleReportError,generateProfitLossData
  }=useFinancialReportsStore();
  //in the store
  //functions

  return (
    <div>FinancialReports</div>
  )
}
export default FinancialReports;