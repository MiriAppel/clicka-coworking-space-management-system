import { useNavigate } from 'react-router-dom';
import { Button } from "@mui/material"
import './lead&customer.css'

export const LeadCustomer = () => {

    const navigate  = useNavigate()

    return <div className='LeadCustomer'>
        <h1>Lead & Customer</h1>
        <Button variant="outlined" onClick={() => { navigate('/') }} sx={{ backgroundColor: 'black', color: 'white', borderColor: 'black', '&:hover': { borderColor: 'white' } }}>Back</Button>
    </div>
}