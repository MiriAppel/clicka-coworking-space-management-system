import { useNavigate } from 'react-router-dom';
import { Button } from "@mui/material"
import '../Css/billing.css'

export const Billing = () => {

    const navigate = useNavigate()

    return <div className='billing'>
        <h1>Billing</h1>
        <Button variant="outlined" onClick={() => { navigate('/') }} sx={{ backgroundColor: 'black', color: 'white', borderColor: 'black', '&:hover': { borderColor: 'white' } }}>Back</Button>
    </div>
}