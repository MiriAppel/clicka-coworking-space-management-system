import React, { useState, useEffect } from 'react';
import './App.css';
import { useNavigate } from 'react-router-dom';
import {Button} from './MainMenu/Common/Components/BaseComponents/Button'
import { AuthenticationScreen } from './Login/Components/AuthenticationScreen';
import { useAuthStore } from './store/useAuthStore';
import { AuthProvider } from './auth/Components/AuthProvider';

// Simple component to demonstrate the project
function App() {
  //////
  const navigate = useNavigate();
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
      <AuthenticationScreen />
    </div>
    </AuthProvider>
    
  );
}

export default App;