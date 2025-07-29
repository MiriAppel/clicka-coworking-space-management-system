import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './TopNav.module.css';
import MobileMenu from '../MobileMenu/MobileMenu';
import { useMediaQuery } from 'react-responsive';
import { menus } from '../menuData';
import { T } from '../../Common/Service/T';
import logo from '../Assets/Klika Logo.jpg'; 

const TopNav = () => {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [clickedMenuKey, setClickedMenuKey] = useState<string>('');

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
      {!isMobile && (
        <div className={styles.logoWrapper}>
          <img src={logo} alt="Clicka Logo" className={styles.logo} />
        </div>
      )}

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
          {menus.map(menu => (
            <li
              key={menu.key}
              className={`${styles.navItem} ${
                clickedMenuKey === menu.key ? styles.activeLink : ''
              }`}
              onMouseEnter={() => setHoveredMenu(menu.key)}
              onMouseLeave={() => setHoveredMenu(null)}
            >
              <div className={styles.navGroup}>
                <span
                  className={styles.navButton}
                  onClick={() => toggleMenu(menu.key)}
                >
                  {menu.icon} <T k={menu.title} />
                </span>
                {isMenuOpen(menu.key) && (
                  <ul className={styles.dropdown}>
                    {menu.items.map((item, index) => (
                      <li
                        key={index}
                        onClick={() => {
                          navigate(item.path);
                          setOpenMenu(null);
                          setClickedMenuKey(menu.key);
                        }}
                      >
                        <T k={item.label} />
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
