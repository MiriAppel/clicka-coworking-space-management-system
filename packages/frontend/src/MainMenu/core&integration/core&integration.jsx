import { useNavigate } from 'react-router-dom';
import { Button } from "@mui/material"
import './core&integration.css'

export const CoreIntegration = () => {

    const navigate = useNavigate()
    
    return <div className='CoreIntegration'>
        <h1>Core & Integration</h1>
        <Button variant="outlined" onClick={() => { navigate('/') }} sx={{ backgroundColor: 'black', color: 'white', borderColor: 'black', '&:hover': { borderColor: 'white' } }}>Back</Button>
    </div>
}