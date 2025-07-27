import React, { useEffect, useState } from 'react';
import './App.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { Accesibility } from './Common/Components/BaseComponents/Accesibility';
import MainLayout from './layout/MainLayout';
import { useAuthStore } from './Stores/CoreAndIntegration/useAuthStore';

function App() {
  const [healthStatus, setHealthStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    const lang = localStorage.getItem('language') || 'he';
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'he' ? 'rtl' : 'ltr';
  }, []);

  useEffect(() => {
    fetch('http://localhost:3001/api/health')
      .then((response) => {
        if (!response.ok) throw new Error('API server not responding');
        return response.json();
      })
      .then((data) => {
        setHealthStatus(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching API health:', err);
        // setError('Could not connect to API server. Make sure it is running.');
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!isAuthenticated && location.pathname !== '/auth') {
      navigate('/auth', { replace: true });
    } else if (isAuthenticated && location.pathname === '/auth') {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]); 

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const showLandingHeader = location.pathname === "/";
  // כדי שיראה לי את דף הבית רק בהתחלה ואז מתי שאני נכנסת למקום כלשהו שימחק 

  return (
    <div className="App">
      <MainLayout /> 

      {showLandingHeader && (
        <>
          <header className="App-header">
            <h3>Welcome to our world</h3>
            <h1>Clicka</h1>
            <h2>Co-working Space Management System</h2>
          </header>
          <div className="menu" style={{ backgroundColor: 'black' }}></div>
        </>
      )}

      <Accesibility />
    </div>
  );
}

export default App;
