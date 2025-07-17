import { Route, Routes, useNavigate } from 'react-router-dom';
// import '../Css/billing.css'
import { FinancialReportsDashboard } from './FinancialReports/FinancialReportsDashboard';

export const Billing = () => {

    // const navigate = useNavigate()

    return (
        <Routes>
            <Route path="*" element={<FinancialReportsDashboard />} />

            <Route path="/financeReports" element={<FinancialReportsDashboard />} />
        </Routes>
    )
    // <div className='billing'>
        {/* <h1>Billing</h1>
        <Button variant="outlined" onClick={() => { navigate('/') }} sx={{ backgroundColor: 'black', color: 'white', borderColor: 'black', '&:hover': { borderColor: 'white' } }}>Back</Button>

  <FinancialReportsDashboard/> */}
    // </div>
}