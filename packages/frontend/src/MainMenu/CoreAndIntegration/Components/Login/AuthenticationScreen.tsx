import { useState, useEffect } from "react";
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { Dialog } from "primereact/dialog";
import { googleAuthConfig } from '../../../../Config/googleAuth';
import { LoginResponse } from "shared-types";
import { useAuthStore } from "../../../../Stores/CoreAndIntegration/useAuthStore";
import { LoginWithPassword } from "./LoginWithPassword";
import { LogoutButton } from "./LogoutButton";
import { useNavigate } from 'react-router-dom';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3001',
  withCredentials: true,
});

export const AuthenticationScreen = () => {
  const { user, isAuthenticated, setUser, setSessionId } = useAuthStore();
  const [showDialog, setShowDialog] = useState(false);
  const navigate = useNavigate();

  const login = useGoogleLogin({
    flow: 'auth-code',
    onSuccess: async (codeResponse) => {
      try {
        const response = await axiosInstance.post<LoginResponse>(
          '/api/auth/google',
          { code: codeResponse.code },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        setUser(response.data.user);
        setSessionId(response.data.sessionId!);
        navigate("/auth");
      } catch (error) {
        console.error('Error during Google login:', error);
      }
    },
    onError: (error) => console.error('Login Failed:', error),
    scope: googleAuthConfig.scopes.join(' '),
    redirect_uri: googleAuthConfig.redirectUri,
  });

  // Redirige automáticamente si ya está autenticado
 useEffect(() => {
  if (user) {
    navigate("/auth");
  }
}, [user, navigate]);

  return (
    <div className="authentication-screen">
      {/* Solo muestra el contenido si NO está autenticado */}
      {!isAuthenticated && (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-white to-blue-50 px-4">
          <button
            onClick={() => setShowDialog(true)}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-full shadow-lg transition-all duration-200 transform hover:scale-105"
          >
            Register
          </button>

          <Dialog
            visible={showDialog}
            onHide={() => setShowDialog(false)}
            style={{ width: '22rem' }}
            modal
            dismissableMask
            closable={false}
            className="rounded-2xl shadow-2xl animate-fade-in"
            contentStyle={{
              borderRadius: '1.5rem',
              padding: '1.25rem 1.5rem',
              background: 'linear-gradient(to bottom right, #f0f4ff, #dbe8ff)',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
            }}
          >
            <div className="flex flex-col items-center w-full gap-4">
              <h2 className="text-lg font-semibold text-gray-800 text-center">
                התחברות
              </h2>

              <div className="w-full">
                <LoginWithPassword />
              </div>

              <div className="flex items-center w-full">
                <hr className="flex-grow border-t border-gray-300" />
                <span className="mx-2 text-gray-400 text-xs">או</span>
                <hr className="flex-grow border-t border-gray-300" />
              </div>

              <button
                onClick={() => login()}
                className="flex items-center justify-center gap-2 bg-white border border-gray-300 hover:border-blue-500 text-gray-700 font-medium py-1.5 px-4 rounded-full shadow-sm hover:shadow-md transition-all duration-200 text-sm"
              >
                <img
                  src="https://developers.google.com/identity/images/g-logo.png"
                  alt="Google"
                  className="w-4 h-4"
                />
                התחבר עם Google
              </button>
            </div>
          </Dialog>
        </div>
      )}
    </div>
  );
};
