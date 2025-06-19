import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './MobileMenu.module.css';
import { Home, Users, Map, FileText, Settings, HelpCircle, FileBarChart2, Mail } from 'lucide-react';


const subMenus: Record<string, { label: string; path: string }[]> = {
  dashboard: [
    { label: 'סקירה כללית', path: '/dashboard' },
    { label: 'חוזים קרובים', path: '/dashboard/contracts' },
    { label: 'תשלומים אחרונים', path: '/dashboard/payments' },
    { label: 'מפת חללים', path: '/workspaceMap' }
  ],
  customers: [
    { label: 'לקוחות', path: '/leadAndCustomer' },
    { label: 'חוזים', path: '/contracts' },
    { label: 'היסטוריית לקוח', path: '/customerHistory' }
  ],
  workspace: [
    { label: 'מפה', path: '/workspaceMap' },
    { label: 'הקצאות', path: '/workspaceAssign' },
    { label: 'ישיבות', path: '/meetingRooms' }
  ],
  billing: [
    { label: 'חשבוניות', path: '/billing' },
    { label: 'תשלומים', path: '/payments' },
    { label: 'הוצאות', path: '/expenses' }
  ],
  reports: [
    { label: 'דוח תפוסה', path: '/occupancyReports' },
    { label: 'דוח כספי', path: '/financeReports' },
    { label: 'פעילות לקוחות', path: '/customerReports' }
  ],
  admin: [
    { label: 'משתמשים', path: '/users' },
    { label: 'הרשאות', path: '/permissions' },
    { label: 'הגדרות', path: '/settings' },
    { label: 'אינטגרציות', path: '/integrations' }
  ],
  communication: [
    { label: 'תבניות מייל', path: '/emailTemplates' },
    { label: 'שליחת מיילים', path: '/sendEmails' },
    { label: 'התראות', path: '/notifications' }
  ],
  support: [
    { label: 'שאלות נפוצות', path: '/faq' },
    { label: 'מדריכים', path: '/help' },
    { label: 'צור קשר', path: '/contactSupport' }
  ]
};

const mobileMenus: {
  key: string;
  title: string;
  icon: React.ReactNode;
}[] = [
    { key: 'dashboard', title: 'לוח בקרה', icon: <Home size={18} style={{ marginLeft: 8 }} /> },
    { key: 'customers', title: 'לקוחות', icon: <Users size={18} style={{ marginLeft: 8 }} /> },
    { key: 'workspace', title: 'חללים', icon: <Map size={18} style={{ marginLeft: 8 }} /> },
    { key: 'billing', title: 'חשבוניות', icon: <FileText size={18} style={{ marginLeft: 8 }} /> },
    { key: 'reports', title: 'דוחות', icon: <FileBarChart2 size={18} style={{ marginLeft: 8 }} /> },
    { key: 'admin', title: 'ניהול מערכת', icon: <Settings size={18} style={{ marginLeft: 8 }} /> },
    { key: 'communication', title: 'תקשורת', icon: <Mail size={18} style={{ marginLeft: 8 }} /> },
    { key: 'support', title: 'תמיכה', icon: <HelpCircle size={18} style={{ marginLeft: 8 }} /> }
  ];

const MobileMenu = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const navigate = useNavigate();
  const [popupInfo, setPopupInfo] = useState<{
    menu: string;
    top: number;
    right: number;
  } | null>(null);

  const popupRef = useRef<HTMLDivElement>(null);

  const handleNavigate = (path: string) => {
    navigate(path);
    onClose();
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        setPopupInfo(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isOpen) return null;

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.drawer} onClick={e => e.stopPropagation()}>
        <button className={styles.close} onClick={onClose}>×</button>

        <ul className={styles.menu}>
          {mobileMenus.map((menu) => (
            <li
              key={menu.key}
              onClick={(e) => {
                const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                const popupHeight = subMenus[menu.key].length * 40; // נניח שכל שורה ~40px
                const viewportHeight = window.innerHeight;

                const fitsBelow = rect.bottom + popupHeight < viewportHeight;
                const popupTop = fitsBelow
                  ? rect.bottom + 4
                  : rect.top - popupHeight - 4;

                setPopupInfo({
                  menu: menu.key,
                  top: popupTop,
                  right: window.innerWidth - rect.right + 120
                });

              }}
            >
              {menu.icon}
              {menu.title}
            </li>
          ))}
        </ul>

        {popupInfo && (
          <div
            className={styles.popup}
            ref={popupRef}
            style={{
              top: popupInfo.top,
              right: popupInfo.right
            }}
          >
            <ul>
              {subMenus[popupInfo.menu].map((item, index) => (
                <li key={index} onClick={() => handleNavigate(item.path)}>
                  {item.label}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileMenu;
