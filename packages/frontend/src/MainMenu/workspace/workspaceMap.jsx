import { Button } from "@mui/material"
import { useNavigate } from 'react-router-dom';
import './workspaceMap.css'

export const WorkspaceMap = () => {

    const navigate = useNavigate()

    return <div className="workspaceMap">
            <h1>WorkspaceMap</h1>
            <Button variant="outlined" onClick={() => { navigate('/') }} sx={{ backgroundColor: 'black', color: 'white', borderColor: 'black', '&:hover': { borderColor: 'white' } }}>Back</Button>
    </div>
}