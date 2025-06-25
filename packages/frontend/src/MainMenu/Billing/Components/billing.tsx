import { useNavigate } from 'react-router-dom';
import { Button } from "@mui/material";
import { ReportChart, ChartData } from '../../../Common/Components/BaseComponents/Chart'; // עדכן נתיב בהתאם
import '../Css/billing.css'

// export const Billing = () => {

//     const navigate = useNavigate()

//     return <div className='billing'>
//         <h1>Billing</h1>
//         <Button variant="outlined" onClick={() => { navigate('/') }} sx={{ backgroundColor: 'black', color: 'white', borderColor: 'black', '&:hover': { borderColor: 'white' } }}>Back</Button>
//     </div>
// }

export const Billing = () => {

    const navigate = useNavigate()
    const sampleData: ChartData[] = [
      { value: 120, label: 'ינואר' },
      { value: 90, label: 'פברואר' },
      { value: 140, label: 'מרץ' },
      { value: 75, label: 'אפריל' },
      { value: 100, label: 'מאי' },
      { value: 80, label: 'יוני' },
    ];
  
    return <div className='billing'>
      <h1>Billing</h1>
      <Button variant="outlined" onClick={() => { navigate('/') }} sx={{ backgroundColor: 'black', color: 'white', borderColor: 'black', '&:hover': { borderColor: 'white' } }}>Back</Button>
      <div className="max-w-3xl mx-auto mt-10">
        <ReportChart
          title="ח מכירות רבעון ראשון"
          type="pie" //"bar"  או "line", או "pie"
          data={sampleData}
          color="#00BFFF"
          rtl={true}
        />
      </div>
      );
  
  
    </div>
  }