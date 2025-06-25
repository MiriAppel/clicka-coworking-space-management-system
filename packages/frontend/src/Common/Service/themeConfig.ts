
export interface ThemeConfig {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    neutral: string[];
    background: string; 
    semantic: {
      success: string;
      warning: string;
      error: string;
      info: string;
    };
  };
  typography: {
    fontFamily: {
      hebrew: string;
      latin: string;
    };
    sizes: string[];
  };
  spacing: number[];
  direction: 'rtl' | 'ltr';
}



