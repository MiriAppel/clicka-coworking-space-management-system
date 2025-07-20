import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './i18n';
import { BrowserRouter } from 'react-router-dom';
import { Routing } from './routing';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ThemeProvider } from './Common/Components/themeConfig';
import { LangContext } from './Common/Service/langContext';

function Root() {
  const [lang, setLang] = useState("he");

  return (
    <React.StrictMode>
      <ThemeProvider>
        <LangContext.Provider value={lang}>
          <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID!}>
            <BrowserRouter>
              <Routing />
              <button onClick={() => {setLang("he"); console.log("Current language:", "he")}}>עברית</button>
              <button onClick={() => {setLang("en"); console.log("Current language:", "en")}}>English</button>
            </BrowserRouter>
          </GoogleOAuthProvider>
        </LangContext.Provider>
      </ThemeProvider>
    </React.StrictMode>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<Root />);
