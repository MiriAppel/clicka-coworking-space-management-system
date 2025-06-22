import React, { createContext, useContext, ReactNode } from 'react';
import { ThemeConfig } from '../Service/themeConfig';

// ברירת מחדל
const defaultTheme: ThemeConfig = {
  colors: {
    // primary: '#2563EB', // כחול
    primary:'#007BFF', 
    // secondary: '#F59E0B', // זהב
    secondary:'#a5d8ff', //כחול יותר חזק 
    // accent: '#64748B', // אפור
    accent:'#E0E0E0',
    background:'',
    neutral: ['#F3F4F6', '#E5E7EB'],
    semantic: {
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#3B82F6',
    },
  },
  typography: {
    fontFamily: {
      hebrew: `'Noto Sans Hebrew', sans-serif`,
      latin: `'Inter', sans-serif`,
    },
    sizes: ['text-sm', 'text-base', 'text-lg'],
  },
  spacing: [4, 8, 16, 32],
  direction: 'rtl',
};

//יצירת הקונטקסט
const ThemeContext = createContext<ThemeConfig>(defaultTheme);

// ✅ 3.  לכל המחלקות האחרות שאח"כ נוכל להשתמש עם פרוויידר 
export const ThemeProvider = ({ children, theme = defaultTheme }: { children: ReactNode; theme?: ThemeConfig }) => {
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
};

//משמש את הקונטקסט שיצרתי 
export const useTheme = () => useContext(ThemeContext);