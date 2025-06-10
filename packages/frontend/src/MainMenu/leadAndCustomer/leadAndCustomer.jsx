import { useNavigate } from 'react-router-dom';
import { Button } from "@mui/material"
import './leadAndCustomer.css'

export const LeadAndCustomer = () => {

    const navigate  = useNavigate()

    return <div className='leadAndCustomer'>
        <h1>Lead & Customer</h1>
        <Button variant="outlined" onClick={() => { navigate('/') }} sx={{ backgroundColor: 'black', color: 'white', borderColor: 'black', '&:hover': { borderColor: 'white' } }}>Back</Button>
    </div>
}