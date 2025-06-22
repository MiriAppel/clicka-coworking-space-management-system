import React, { useState, useEffect } from 'react';
import './App.css';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
import { LoginWithGoogle } from './Login/Components/LoginButton';
import { AuthenticationScreen } from './Login/Components/AuthenticationScreen';
import { useAuthStore } from './store/useAuthStore';

// Simple component to demonstrate the project
function App() {
  //////
  const navigate = useNavigate();
const { setUser, clearUser, setLoading } = useAuthStore();

    useEffect(() => {
      const checkAuth = async () => {
        try {
          setLoading(true);
          const res = await fetch("/api/verify", {
            credentials: "include", // חשוב לשם שליחת ה-cookie
          });
          if (res.status==200) {
            console.log("Authenticated successfully in useEffect at App");          
            const data = await res.json();
            setUser(data.user);
            console.log(data.user);            
          } else {
            console.log("Authenticate faild un useEffect at App");
            clearUser(); // אם אין התחברות תקפה
          }
        } catch (err) {
          console.log("Error during authentication check:", err);
          console.log("Not authenticated");
          clearUser();
        } finally {
          setLoading(false);
        }
      };
  
      checkAuth();
    }, [setUser, clearUser, setLoading]);


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
      <AuthenticationScreen />
    </div>
    
  );
}

export default App;