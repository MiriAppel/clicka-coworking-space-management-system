import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './MobileMenu.module.css';
import { menus } from '../menuData';

const MobileMenu = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const navigate = useNavigate();
  const [popupInfo, setPopupInfo] = useState<{
    menuKey: string;
    top: number;
    right: number;
  } | null>(null);

  const popupRef = useRef<HTMLDivElement>(null);

  const handleNavigate = (path: string) => {
    navigate(path);
    onClose();
    setPopupInfo(null);
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

  const mobileMenus = menus.map(({ key, title, icon }) => ({ key, title, icon }));

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.drawer} onClick={e => e.stopPropagation()}>
        <button className={styles.close} onClick={onClose}>×</button>

        <ul className={styles.menu}>
          {mobileMenus.map((menu) => (
            <li
              key={menu.key}
              onClick={(e) => {
                e.stopPropagation();
                const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();

                const popupHeight = (menus.find(m => m.key === menu.key)?.items.length ?? 0) * 40;
                const viewportHeight = window.innerHeight;

                let popupTop = rect.bottom + 4;
                if (rect.bottom + popupHeight > viewportHeight && rect.top - popupHeight > 0) {
                  popupTop = rect.top - popupHeight - 4; 
                } else if (rect.bottom + popupHeight > viewportHeight) {
                  popupTop = viewportHeight - popupHeight - 10;
                }

                setPopupInfo({
                  menuKey: menu.key,
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
              {menus.find(m => m.key === popupInfo.menuKey)?.items.map((item, index) => (
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
