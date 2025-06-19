import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Router } from 'react-router-dom';
import { routing } from './routing';
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
        {routing()}
      </BrowserRouter>
    </GoogleOAuthProvider>

  </React.StrictMode>
  
);
console.log("ENV clientId:", process.env.REACT_APP_GOOGLE_CLIENT_ID);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
