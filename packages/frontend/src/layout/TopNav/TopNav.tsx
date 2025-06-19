import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './TopNav.module.css';
import MobileMenu from '../MobileMenu/MobileMenu';
import { useMediaQuery } from 'react-responsive';
import { Home, Users, Map, FileText, FileBarChart2, Settings, Mail, HelpCircle } from 'lucide-react';
import { useLocation } from 'react-router-dom';


const TopNav = () => {
    const [activeMenuKey, setActiveMenuKey] = useState<string>('');
    const [openMenu, setOpenMenu] = useState<string | null>(null);
    const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);
    const navRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const location = useLocation();
    const currentPath = location.pathname;

    const isMenuOpen = (menu: string) =>
        openMenu === menu || (hoveredMenu === menu && !openMenu);

    const toggleMenu = (menu: string) => {
        setOpenMenu(prev => (prev === menu ? null : menu));
    };

    const [mobileOpen, setMobileOpen] = useState(false);
    const isMobile = useMediaQuery({ maxWidth: 970 });

    useEffect(() => {

        const handleClickOutside = (e: MouseEvent) => {
            if (navRef.current && !navRef.current.contains(e.target as Node)) {
                setOpenMenu(null);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const topNavMenus = [
        {
            key: 'dashboard',
            title: 'לוח בקרה',
            icon: <Home size={18} />,
            items: [
                { label: 'סקירה כללית', path: '/dashboard' },
                { label: 'חוזים קרובים לסיום', path: '/dashboard/contracts' },
                { label: 'תשלומים אחרונים', path: '/dashboard/payments' },
                { label: 'מפת חללים', path: '/workspaceMap' }
            ]
        },
        {
            key: 'customers',
            title: 'לקוחות',
            icon: <Users size={18} />,
            items: [
                { label: 'לקוחות', path: '/leadAndCustomer' },
                { label: 'חוזים', path: '/contracts' },
                { label: 'היסטוריית לקוח', path: '/customerHistory' }
            ]
        },
        {
            key: 'workspace',
            title: 'חללים',
            icon: <Map size={18} />,
            items: [
                { label: 'מפת חללים', path: '/workspaceMap' },
                { label: 'הקצאות', path: '/workspaceAssign' },
                { label: 'חדרי ישיבות', path: '/meetingRooms' }
            ]
        },
        {
            key: 'billing',
            title: 'חשבוניות',
            icon: <FileText size={18} />,
            items: [
                { label: 'חשבוניות', path: '/billing' },
                { label: 'תשלומים', path: '/payments' },
                { label: 'הוצאות', path: '/expenses' }
            ]
        },
        {
            key: 'reports',
            title: 'דוחות',
            icon: <FileBarChart2 size={18} />,
            items: [
                { label: 'דוח תפוסה', path: '/occupancyReports' },
                { label: 'דוח כספי', path: '/financeReports' },
                { label: 'פעילות לקוחות', path: '/customerReports' }
            ]
        },
        {
            key: 'admin',
            title: 'ניהול מערכת',
            icon: <Settings size={18} />,
            items: [
                { label: 'ניהול משתמשים', path: '/users' },
                { label: 'הרשאות', path: '/permissions' },
                { label: 'הגדרות כלליות', path: '/settings' },
                { label: 'אינטגרציות', path: '/integrations' }
            ]
        },
        {
            key: 'communication',
            title: 'תקשורת',
            icon: <Mail size={18} />,
            items: [
                { label: 'תבניות מייל', path: '/emailTemplates' },
                { label: 'שליחת מיילים', path: '/sendEmails' },
                { label: 'התראות', path: '/notifications' }
            ]
        },
        {
            key: 'support',
            title: 'תמיכה',
            icon: <HelpCircle size={18} />,
            items: [
                { label: 'שאלות נפוצות', path: '/faq' },
                { label: 'מדריכי שימוש', path: '/help' },
                { label: 'צור קשר', path: '/contactSupport' }
            ]
        }
    ];


    return (
        <nav className={styles.topNav} ref={navRef}>
            {isMobile && !mobileOpen && (
                <button onClick={() => setMobileOpen(true)} className={styles.hamburgerButton} aria-label="פתח תפריט">
                    ☰
                </button>
            )}
            {isMobile && (
                <MobileMenu isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
            )}

            {!isMobile && (
                <ul className={styles.navList}>
                    {topNavMenus.map((menu) => (
                        <li
                            key={menu.key}
                            className={`${styles.navItem} ${activeMenuKey === menu.key ? styles.activeLink : ''}`}
                            onMouseEnter={() => setHoveredMenu(menu.key)}
                            onMouseLeave={() => setHoveredMenu(null)}
                        >
                            <div className={styles.navGroup}>
                                <span className={styles.navButton} onClick={() => toggleMenu(menu.key)}>
                                    {menu.icon}
                                    {menu.title}
                                </span>
                                {isMenuOpen(menu.key) && (
                                    <ul className={styles.dropdown}>
                                        {menu.items.map((item, index) => (
                                            <li key={index} onClick={() => { navigate(item.path); setOpenMenu(null); setActiveMenuKey(menu.key); }}>
                                                {item.label}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>

            )
            }
        </nav >

    );
};

export default TopNav;
