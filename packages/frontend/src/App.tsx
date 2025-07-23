import React, { useEffect, useState } from 'react';
import './App.css';
import { useNavigate, useLocation, Routes, Route } from 'react-router-dom';
import { AuthenticationScreen } from './MainMenu/CoreAndIntegration/Components/Login/AuthenticationScreen';
import { AuthProvider } from './MainMenu/CoreAndIntegration/Components/Login/AuthProvider';
import { Accesibility } from './Common/Components/BaseComponents/Accesibility';
import { ProtectedRoute } from './MainMenu/CoreAndIntegration/Components/Login/ProtectedRoute';
import { Routing } from './routing';
import { useAuthStore } from './Stores/CoreAndIntegration/useAuthStore';

function App() {
  const [healthStatus, setHealthStatus] = useState<{ status: string; timestamp: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
        setError('Could not connect to API server. Make sure it is running.');
        setLoading(false);
      });
  }, []);

  // useEffect(() => {
  //   if (!isAuthenticated && location.pathname !== '/auth') {
  //     navigate('/auth');
  //   }
  //   if (isAuthenticated && location.pathname === '/auth') {
  //     navigate('/', { replace: true });
  //   }
  // }, [isAuthenticated, location.pathname, navigate]);
useEffect(() => {
  if (!isAuthenticated && location.pathname !== '/auth') {
    navigate('/auth', { replace: true });
  } else if (isAuthenticated && location.pathname === '/auth') {
    navigate('/', { replace: true });
  }
  // לא מוסיפים location.pathname לתלות כדי לא להפעיל את זה על כל שינוי נתיב
}, [isAuthenticated, navigate]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <AuthProvider>
      <Routes>
        {/* Ruta pública para login */}
        <Route path="/auth" element={<AuthenticationScreen />} />

        {/* Ruta protegida para toda la app */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <div className="App">
                <header className="App-header">
                  <h3>Welcome to our world</h3>
                  <h1>Clicka</h1>
                  <h2>Co-working Space Management System</h2>
                </header>

                <div className="menu" style={{ backgroundColor: 'black' }}></div>

                <Accesibility />

                {/* Aquí se cargan todas las rutas internas */}
                <Routing />
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;
