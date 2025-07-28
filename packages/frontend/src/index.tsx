import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import { BrowserRouter } from 'react-router-dom';
import { Routing } from './routing';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ThemeProvider } from './Common/Components/themeConfig';
import { LangContext } from './Common/Service/langContext';
import clsx from 'clsx';
import { AuthProvider } from './MainMenu/CoreAndIntegration/Components/Login/AuthProvider';

function Root() {
  const [lang, setLang] = useState<"HE" | "EN">("HE");

  return (
    <React.StrictMode>
      <ThemeProvider>
        <LangContext.Provider value={lang}>
          <AuthProvider>
            <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID!}>
              <BrowserRouter>
                <div className="p-4 gap-4 items-start">
                  {/* כפתורי שפה מעוצבים */}
                  <div className="fixed top-20 left-4 z-200">
                    <button
                      onClick={() => {
                        const nextLang = lang === "HE" ? "EN" : "HE";
                        setLang(nextLang);
                        console.log("Language switched to:", nextLang);
                      }}
                      className="px-4 py-1 rounded-full border border-gray-300 text-sm font-semibold text-gray-700 bg-gradient-to-b from-white to-gray-100 shadow-sm hover:shadow-md transition"
                    >
                      {lang === "HE" ? "EN" : "HE"}
                    </button>
                  </div>
                  {/* הראוטינג עצמו */}
                  <Routing />
                </div>
              </BrowserRouter>
            </GoogleOAuthProvider>
          </AuthProvider>
        </LangContext.Provider>
      </ThemeProvider>
    </React.StrictMode>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<Root />);
