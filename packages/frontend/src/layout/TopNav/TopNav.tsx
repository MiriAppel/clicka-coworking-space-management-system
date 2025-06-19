import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './TopNav.module.css';
import MobileMenu from '../MobileMenu/MobileMenu';
import { useMediaQuery } from 'react-responsive';
import { menus } from '../menuData';

const TopNav = () => {
  const [activeMenuKey, setActiveMenuKey] = useState<string>('');
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  useEffect(() => {
    // עדכון activeMenuKey לפי הנתיב הנוכחי
    const foundMenu = menus.find(menu =>
      menu.items.some(item => currentPath.startsWith(item.path))
    );
    setActiveMenuKey(foundMenu ? foundMenu.key : '');
  }, [currentPath]);

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

  return (
    <nav className={styles.topNav} ref={navRef}>
      {isMobile && !mobileOpen && (
        <button
          onClick={() => setMobileOpen(true)}
          className={styles.hamburgerButton}
          aria-label="פתח תפריט"
        >
          ☰
        </button>
      )}
      {isMobile && (
        <MobileMenu isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      )}

      {!isMobile && (
        <ul className={styles.navList}>
          {menus.map((menu) => (
            <li
              key={menu.key}
              className={`${styles.navItem} ${
                activeMenuKey === menu.key ? styles.activeLink : ''
              }`}
              onMouseEnter={() => setHoveredMenu(menu.key)}
              onMouseLeave={() => setHoveredMenu(null)}
            >
              <div className={styles.navGroup}>
                <span
                  className={styles.navButton}
                  onClick={() => toggleMenu(menu.key)}
                >
                  {menu.icon}
                  {menu.title}
                </span>
                {isMenuOpen(menu.key) && (
                  <ul className={styles.dropdown}>
                    {menu.items.map((item, index) => (
                      <li
                        key={index}
                        onClick={() => {
                          navigate(item.path);
                          setOpenMenu(null);
                          setActiveMenuKey(menu.key);
                        }}
                      >
                        {item.label}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
};

export default TopNav;
