import { ExpenseCategory } from '../../../../../../../types/expense'; // Importing ExpenseCategory type
import { FileReference, ID } from '../../../../../../../types/core'; // Importing FileReference type
import type { FinancialReport, ReportData, ReportParameters, ReportType } from '../../../../../../../types/financialReport'; // Importing types from the reportTypes file";
//import type { ExpenseReportByCategoryAndVendor , RevenueReportByWorkspaceAndPeriod } from '../../../../../../../types/financialReport'; // Importing types from the reportTypes file";
import { WorkspaceType } from '../../../../../../../types/customer'; // Importing WorkspaceType type';
import { useFinancialReportsStore } from '../../../../Stores/Billing/financialReportsStore';
const FinancialReports = () => {

  const {checkUserPermissions,handleReportGenerationTimeout
    ,generateReport,fetchReportData,generateRevenueData,generateExpenseData,
    generateCashFlowData,generateCustomerAgingData,generateOccupancyRevenueData,
  //getExpenseReportByCategoryAndVendor,getRevenueReportByWorkspaceTypeAndPeriod,
  exportReport,handleReportError,generateProfitLossData
  }=useFinancialReportsStore();
  //in the store
  //functions

  return (
    <div>FinancialReports</div>
  )
}
export default FinancialReports;