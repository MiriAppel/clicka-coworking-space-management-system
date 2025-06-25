import { useNavigate } from 'react-router-dom';
import { Button } from "@mui/material";
import '../Css/billing.css'
import RevenueReportView from './FinancialReports/RevenueReportView';
import ReportDisplay from './FinancialReports/ReportDisplay';
import { DynamicReportView } from './FinancialReports/DynamicReportView';
import { ReportType } from 'shared-types';
import FinancialReports from './FinancialReports/FinancialReports';

export const Billing = () => {

    const navigate = useNavigate()

    return <div className='billing'>
        <h1>Billing</h1>
        <Button variant="outlined" onClick={() => { navigate('/') }} sx={{ backgroundColor: 'black', color: 'white', borderColor: 'black', '&:hover': { borderColor: 'white' } }}>Back</Button>
   <RevenueReportView></RevenueReportView>
   <ReportDisplay></ReportDisplay>
      <DynamicReportView
      type={ReportType.REVENUE}      // דוח הכנסות
      title="דוח הכנסות לפי חודש"
      groupBy="month"                // קיבוץ לפי חודש
    />
    <FinancialReports></FinancialReports>
    </div>
}