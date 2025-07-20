import React, { useEffect } from 'react';
import './App.css';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

// Simple component to demonstrate the project
function App() {
  const navigate = useNavigate();



  useEffect(() => {
    // Check API health
    fetch(process.env.REACT_APP_API_URL + '/health')
      .then(response => {
        if (!response.ok) {
          throw new Error('API server not responding');
        }
        return response.json();
      })
      .catch(err => {
        console.error('Error fetching API health:', err);
      });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h3>welcome to our world</h3>
        <h1>Clicka</h1>
        <h2>Co-working Space Management System</h2>
      </header>
      <div className='menu' style={{ backgroundColor: 'black' }}>
        <Button variant="outlined" onClick={() => { navigate('/leadAndCustomer') }} sx={{ backgroundColor: 'black', color: 'white', borderColor: 'black', '&:hover': { borderColor: 'white' } }}>Lead & Customer</Button>
        <Button variant="outlined" onClick={() => { navigate('/workspaceMap') }} sx={{ backgroundColor: 'black', color: 'white', borderColor: 'black', '&:hover': { borderColor: 'white' } }}>Workspace</Button>
        <Button variant="outlined" onClick={() => { navigate('/billing') }} sx={{ backgroundColor: 'black', color: 'white', borderColor: 'black', '&:hover': { borderColor: 'white' } }}>Billing</Button>
      </div>
    </div>
  );
}

export default App;