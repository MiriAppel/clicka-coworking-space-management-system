import React, { useState, useEffect } from 'react';
import './App.css';

// Simple component to demonstrate the project
function App() {
  const [healthStatus, setHealthStatus] = useState<{status: string, timestamp: string} | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    </div>
  );
}

export default App;