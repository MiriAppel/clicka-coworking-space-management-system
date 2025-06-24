import { Outlet, useNavigate } from 'react-router-dom';
import '../Css/leadAndCustomer.css'
import { Button } from '../../../Common/Components/BaseComponents/Button';

// יש לנו מצגת עם פירוט של כל העמודים יותר מפורט מה צריך להיות

export const LeadAndCustomer = () => {

    const navigate = useNavigate()

    return <div className='leadAndCustomer' style={{ direction: 'rtl' }}>
        <h1>Lead & Customer</h1>
        <Button variant="primary" size="sm" onClick={() => navigate('customers')}>לקוחות</Button>
        <Button variant="primary" size="sm" onClick={() => navigate('leads')}>מתעניינים</Button>
        <Button variant="primary" size="sm" onClick={() => navigate('contractManagement')}>חוזים</Button>
        <Button variant="primary" size="sm" onClick={() => navigate('leads/intersections')}>אינטראקציות</Button>
        <Button variant="primary" size="sm" onClick={() => navigate('/')}>Back</Button>
        <Outlet />
    </div>
}