import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { googleAuthConfig } from '../config/googleAuth';
import { LoginResponse } from '../../../../types/auth';
import { useAuthStore } from '../store/useAuthStore';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:3001',
    withCredentials: true, // Ensure cookies are sent with requests
});
export const LoginWithGoogle = () => {
    const setUser = useAuthStore((state) => state.setUser);
    const login = useGoogleLogin({
        flow: 'auth-code',
        onSuccess: async (codeResponse) => {
            try {
                console.log('Code received from Google:', codeResponse);
                
                const response = await axiosInstance.post<LoginResponse>(
                    '/api/google',
                    { code: codeResponse.code },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                );

                console.log('Server response:', response.data);
                setUser(response.data.user);
                // Optionally, you can handle the token and expiration here
            } catch (error) {
                console.error('Error sending code to server:', error);
            }
        },
        onError: (error) => console.error('Login Failed:', error),
        scope: googleAuthConfig.scopes.join(' '),
        redirect_uri: googleAuthConfig.redirectUri,
    });

    return (
        <button onClick= {() => login()}> התחבר עם Google </button>
    );
};


