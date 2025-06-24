import React, { useState, useEffect } from 'react';
import './App.css';
import { useNavigate, Routes, Route } from 'react-router-dom';
import { LeadAndCustomerRouting } from './MainMenu/LeadAndCustomer/Components/LeadAndCustomerRouting';
import { Button } from './Common/Components/BaseComponents/Button';
import { LeadInteraction } from './MainMenu/LeadAndCustomer/Components/Interactions/leadIntersection';
import { AuthenticationScreen } from './Login/Components/AuthenticationScreen';
import { useAuthStore } from './Stores/Auth/useAuthStore';
import { AuthProvider } from './auth/Components/AuthProvider';

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

      <div className="space-x-4">
        <Button
          variant="primary"
          size="md"
          onClick={() => navigate('/leadAndCustomer')}
          className="border border-black hover:border-white bg-black text-white"
        >
          Lead & Customer
        </Button>

        <Button
          variant="primary"
          size="lg"
          onClick={() => navigate('/workspaceMap')}
          className="border border-black hover:border-white bg-black text-white"
        >
          Workspace
        </Button>

        <Button
          variant="primary"
          size="md"
          onClick={() => navigate('/billing')}
          className="border border-black hover:border-white bg-black text-white"
        >
          Billing
        </Button>
      </div>
      <LeadInteraction></LeadInteraction>
      {/* 👇 נתיבים */}
      <Routes>
        <Route path="/leadAndCustomer/*" element={<LeadAndCustomerRouting />} />
      </Routes>
      <AuthenticationScreen />
    </div>
    </AuthProvider>
    
  );
}

export default App;
