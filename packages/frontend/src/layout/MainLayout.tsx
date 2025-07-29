import { useEffect } from 'react';
import TopNav from './TopNav/TopNav';
import { Outlet, useNavigate } from 'react-router-dom';

const shortcutMap: Record<string, string> = {
    '0': '/',
    '1': '/dashboard',
    '2': '/leadAndCustomer',
    '3': '/workspaceMap',
    '4': '/billing',
    '5': '/occupancyReports',
    '6': '/users',
    '7': '/emailTemplates',
    '8': '/faq',
};

const MainLayout = () => {
    const navigate = useNavigate();
    useEffect(() => {
        const handleKeydown = (e: KeyboardEvent) => {
            if (e.altKey && shortcutMap[e.key]) {
                e.preventDefault();
                navigate(shortcutMap[e.key]);
            }
        };

        window.addEventListener('keydown', handleKeydown);
        return () => {
            window.removeEventListener('keydown', handleKeydown);
        };
    }, [navigate]);

    return (
        <>
            <TopNav />
            <Outlet />
        </>
    );
};

export default MainLayout;
