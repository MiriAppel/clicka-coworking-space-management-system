//ReportControls - בקרות לבחירת סוג דוח ופרמטרים
//בחירת סוג דוח (הכנסות, הוצאות, רווח והפסד וכו')
// בחירת טווח תאריכים
// סינון לפי קטגוריות
// בחירת פרמטרים ספציפיים לכל דוח

import { ValidationResult } from '../../../../../../types/validationResult';
import { ReportParameters, ReportType } from '../../../../../../types/report';
import { DateRangeFilter, ID } from '../../../../../../types/core';
import { ExpenseCategory } from '../../../../../../types/expense';
import { WorkspaceType } from '../../../../../../types/customer';
import { useFinancialReportsStore } from '../../../../Stores/Billing/financialReportsStore';

// כפתורי "צור דוח" ו"איפוס"
const ReportControls = () => {
  const { validateReportParameters, resetReportParameters,
    handleReportTypeChange, handleDateRangeChange, handleCategoryChange,
    handleVendorChange, handleWorkspaceTypeChange, handleGroupByChange
  } = useFinancialReportsStore();

  //functions
  //in the store




  return <div>
    <h1>Report Controls</h1>
  </div>
}
export default ReportControls;   