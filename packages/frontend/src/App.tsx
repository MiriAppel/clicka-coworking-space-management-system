import React, { useState, useEffect } from 'react';
import './App.css';
import { useNavigate, Routes, Route } from 'react-router-dom';
// import { Button } from './Common/Components/BaseComponents/Button';
import { AuthenticationScreen } from './MainMenu/CoreAndIntegration/Components/Login/AuthenticationScreen';
import { AuthProvider } from './MainMenu/CoreAndIntegration/Components/Login/AuthProvider';
import { Accesibility } from './Common/Components/BaseComponents/Accesibility';
import { Button } from './Common/Components/BaseComponents/Button';
import { DynamicReportBuilder } from './Common/Components/BaseComponents/DynamicReportBuilder';
import LanguageSelector from './Common/Components/LanguageSelector';
import { VoiceCommand } from './VoiceAssistant';
import FileUploader from './Common/Components/BaseComponents/FileUploader';

import PricingConfigurationPage from './MainMenu/Billing/Components/Pricing/PricingConfigurationPage';

function App() {
  const [healthStatus, setHealthStatus] = useState<{ status: string; timestamp: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const lang = localStorage.getItem('language') || 'he';
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'he' ? 'rtl' : 'ltr';
  }, []);
  useEffect(() => {
    fetch('http://localhost:3001/api/health')
      .then((response) => {
        if (!response.ok) {
          throw new Error('API server not responding');
        }
        return response.json();
      })
      .then((data) => {
        setHealthStatus(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching API health:', err);
        setError('Could not connect to API server. Make sure it is running.');
        setLoading(false);
      });
  }, []);


  return (
        <div className="App">

      <VoiceCommand/>
      
      <header className="App-header">
        <h3>welcome to our world</h3>
        <h1>Clicka</h1>
        <h2>Co-working Space Management System</h2>
      </header>

      <div className='menu' style={{ backgroundColor: 'black' }}>
      </div>
     
      <Accesibility></Accesibility>
       <Routes>
          <Route path="/pricing" element={<PricingConfigurationPage />} />
          {/* אפשר להוסיף כאן ראוטים נוספים */}
        </Routes>
        <AuthenticationScreen />
        

      </div>
  );
}

export default App;