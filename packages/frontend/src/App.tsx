import React, { useState, useEffect } from 'react';
import './App.css';

import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

// Simple component to demonstrate the project
function App() {
  const [healthStatus, setHealthStatus] = useState<{ status: string, timestamp: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  //////
  const navigate = useNavigate();




  useEffect(() => {
    // Check API health
    fetch('http://localhost:3001/api/health')
      .then(response => {
        if (!response.ok) {
          throw new Error('API server not responding');
        }
        return response.json();
      })
      .then(data => {
        setHealthStatus(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching API health:', err);
        setError('Could not connect to API server. Make sure it is running.');
        setLoading(false);
      });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
<<<<<<< HEAD
        <h3>welcome to our world</h3>
        <h1>Clicka</h1>
        <h2>Co-working Space Management System</h2>
      </header>
      <div className='menu' style={{ backgroundColor: 'black' }}>
        <Button variant="outlined" onClick={() => { navigate('/leadAndCustomer') }} sx={{ backgroundColor: 'black', color: 'white', borderColor: 'black', '&:hover': { borderColor: 'white' } }}>Lead & Customer</Button>
        <Button variant="outlined" onClick={() => { navigate('/workspaceMap') }} sx={{ backgroundColor: 'black', color: 'white', borderColor: 'black', '&:hover': { borderColor: 'white' } }}>Workspace</Button>
        <Button variant="outlined" onClick={() => { navigate('/billing') }} sx={{ backgroundColor: 'black', color: 'white', borderColor: 'black', '&:hover': { borderColor: 'white' } }}>Billing</Button>
      </div>
=======
        <h1>Chabad Tefen Tefillin Project</h1>
        <div className="api-status">
          <h2>API Connection Status</h2>
          {loading ? (
            <p>Checking API connection...</p>
          ) : error ? (
            <div className="error-message">
              <p>{error}</p>
              <p>Please start the backend server and refresh this page.</p>
            </div>
          ) : (
            <div className="success-message">
              <p>✅ Connected to API</p>
              <p>Status: {healthStatus?.status}</p>
              <p>Last checked: {new Date(healthStatus?.timestamp || '').toLocaleString()}</p>
            </div>
          )}
        </div>
      </header>
>>>>>>> workspacebranch
    </div>
  );
}

export default App;