import { Button } from "@mui/material"
import { useNavigate } from 'react-router-dom';
import '../Css/workspaceMaps.css'

export const WorkspaceMap = () => {

    const navigate = useNavigate()

const spaceStatus = (): string => {
    // fetch('http://localhost:3001/api/workspace/status')
    // return ""
    return "lounge";
}
    return <div className="workspaceMap">
        <h1>WorkspaceMap</h1>
        <div className="allWorkspaceMap">

            <div className="desk">
                <div onMouseMove={()=>{}}>Desk 1</div>
                <div onMouseMove={()=>{}}>Desk 2</div>
            </div> 
            <div className="lounge" onMouseMove={()=>{}}>Lounge</div>
            <div className="openSpace" onMouseMove={()=>{}}>Open Space</div>
            <div className="meetingRoom" onMouseMove={()=>{}}>Meeting Room</div>
            <div className="storage"onMouseMove={()=>{}}>Storage</div> 
            <div className="office" onMouseMove={()=>{}}>Office 1</div>
            <div className="office" onMouseMove={()=>{}}>Office 2</div>
            <div className="office" onMouseMove={()=>{}}>Office 3</div>   
        </div>
        <Button variant="outlined" onClick={() => { navigate('/') }} sx={{ backgroundColor: 'black', color: 'white', borderColor: 'black', '&:hover': { borderColor: 'white' } }}>Back</Button>
    </div>
}