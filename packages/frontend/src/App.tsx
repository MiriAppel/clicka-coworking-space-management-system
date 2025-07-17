import React, { useState, useEffect } from 'react';
import './App.css';
import { useNavigate, Routes, Route } from 'react-router-dom';
// import { Button } from './Common/Components/BaseComponents/Button';
import { AuthenticationScreen } from './MainMenu/CoreAndIntegration/Components/Login/AuthenticationScreen';
import { AuthProvider } from './MainMenu/CoreAndIntegration/Components/Login/AuthProvider';
import { Accesibility } from './Common/Components/BaseComponents/Accesibility';
import FileUploader from './Common/Components/BaseComponents/FileUploader';


function App() {
  const [healthStatus, setHealthStatus] = useState<{ status: string; timestamp: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

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
    <AuthProvider>
    <div className="App">
      
      <header className="App-header">
        <h3>welcome to our world</h3>
        <h1>Clicka</h1>
        <h2>Co-working Space Management System</h2>
      </header>

      <div className='menu' style={{ backgroundColor: 'black' }}>

      </div>
      <Accesibility></Accesibility>

        <AuthenticationScreen />
        {/* <FileUploader></FileUploader> */}
    </div>
    </AuthProvider>
    
  );
}

export default App;