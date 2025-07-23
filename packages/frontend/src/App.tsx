import React, { useState, useEffect } from 'react';
import './App.css';
import { useNavigate, Routes, Route, Navigate } from 'react-router-dom';
import { AuthenticationScreen } from './MainMenu/CoreAndIntegration/Components/Login/AuthenticationScreen';
import { AuthProvider } from './MainMenu/CoreAndIntegration/Components/Login/AuthProvider';
import { Accesibility } from './Common/Components/BaseComponents/Accesibility';
import { Button } from './Common/Components/BaseComponents/Button';
import { useAuthStore } from './Stores/CoreAndIntegration/useAuthStore';
import {Routing} from './routing'; 

function App() {
  const [healthStatus, setHealthStatus] = useState<{ status: string; timestamp: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  // const { user, isLoading } = useAuthStore();
  const { user, isLoading, setUser } = useAuthStore();
  const [apiLoading, setApiLoading] = useState(true); 
  const [userLoading, setUserLoading] = useState(true);

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
        // setApiLoading(false); 
      })
      .catch((err) => {
        console.error('Error fetching API health:', err);
        setError('Could not connect to API server. Make sure it is running.');
        setLoading(false);
        setApiLoading(false);
      });
  }, []);
useEffect(() => {
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    setUser(JSON.parse(storedUser));
  }
  setUserLoading(false);
}, []);

// const storedSession = localStorage.getItem('sessionId');
// if (storedSession) {
//   setSessionId(storedSession);
// }


useEffect(() => {
     if (!isLoading && !user) {
    // navigate('/auth');
  }
}, [isLoading, user, navigate]);

 if (apiLoading || userLoading || isLoading) {
  return <div>Loading...</div>;
}



  return (
    <AuthProvider>
      <div className="App">
        <header className="App-header">
          <h3>welcome to our world</h3>
          <h1>Clicka</h1>
          <h2>Co-working Space Management System</h2>
        </header>

        <Button
          onClick={() => navigate('/graph')}
          className="mb-4 bg-green-500 text-white px-4 py-2 rounded"
        >
          graph
        </Button>

        <div className="menu" style={{ backgroundColor: 'black' }}></div>

        <Accesibility />

        <Routes>
          {/* RUTA DE LOGIN */}
          <Route
            path="/auth"
            element={user ? <Navigate to="/*" replace /> : <AuthenticationScreen />}
          />

          {/* RUTA PRINCIPAL */}
          <Route
            path="/*"
            element={user ? <AuthenticationScreen /> : <Navigate to="/auth" replace />}
          />
        </Routes>
        
      </div>
    </AuthProvider>
    
  );
  
}
 
export default App;
