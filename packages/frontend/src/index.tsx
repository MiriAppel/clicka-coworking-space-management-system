import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './i18n';
import { BrowserRouter } from 'react-router-dom';
import { Routing } from './routing';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ThemeProvider } from './Common/Components/themeConfig';
import { LangContext } from './Common/Service/langContext';
import clsx from 'clsx';

function Root() {
  const [lang, setLang] = useState<"he" | "en">("he");

  return (
    <React.StrictMode>
      <ThemeProvider>
        <LangContext.Provider value={lang}>
          <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID!}>
            <BrowserRouter>
              <div className="p-4 gap-4 items-start">
                {/* כפתורי שפה מעוצבים */}
                <div className="gap-2 bg-gray-100 rounded-full p-1 shadow-inner w-fit">
                  {["he", "en"].map((l) => (
                    <button
                      key={l}
                      onClick={() => {
                        setLang(l as "he" | "en");
                        console.log("Current language:", l);
                      }}
                      className={clsx(
                        "px-4 py-1 text-sm font-medium rounded-full transition",
                        lang === l
                          ? "bg-blue-600 text-white shadow"
                          : "text-gray-700 hover:bg-gray-200"
                      )}
                    >
                      {l === "he" ? "עברית" : "English"}
                    </button>
                  ))}
                </div>

                {/* הראוטינג עצמו */}
                <Routing />
              </div>
            </BrowserRouter>
          </GoogleOAuthProvider>
        </LangContext.Provider>
      </ThemeProvider>
    </React.StrictMode>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<Root />);
