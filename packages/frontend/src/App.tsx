import React, { useState, useEffect } from 'react';
import './App.css';
import { useNavigate } from 'react-router-dom';
import {Button} from './MainMenu/Common/Components/BaseComponents/Button'
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
          const res = await fetch("/api/auth/verify", {
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
    
  );
}

export default App;