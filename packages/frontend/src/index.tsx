import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import reportWebVitals from './reportWebVitals';
import { Routing } from './routing';
import { GoogleOAuthProvider } from '@react-oauth/google';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
console.log("Client ID from env:", process.env.REACT_APP_GOOGLE_CLIENT_ID);
console.log("GOOGLE_CLIENT_ID:", process.env.REACT_APP_GOOGLE_CLIENT_ID);

root.render(
  <React.StrictMode>
       <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID!}> 
    <BrowserRouter>
    {/* <App /> */}
          {<Routing />}

    </BrowserRouter>
       </GoogleOAuthProvider>
   
 </React.StrictMode>
);
console.log("ENV clientId:", process.env.REACT_APP_GOOGLE_CLIENT_ID);


reportWebVitals();
