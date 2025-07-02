import { useNavigate } from 'react-router-dom';
import { Button } from "@mui/material";
import '../Css/billing.css'
import ExpensePage from './FinancialReports/ExpensePage';
import { DynamicReportView } from './FinancialReports/DynamicReportView';
import { FinancialReportsDashboard } from './FinancialReports/FinancialReportsDashboard';

export const Billing = () => {

    const navigate = useNavigate()

    return <div className='billing'>
        <h1>Billing</h1>
        <Button variant="outlined" onClick={() => { navigate('/') }} sx={{ backgroundColor: 'black', color: 'white', borderColor: 'black', '&:hover': { borderColor: 'white' } }}>Back</Button>
  <ExpensePage />
  <FinancialReportsDashboard/>
    </div>
}