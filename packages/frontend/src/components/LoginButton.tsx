import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { googleAuthConfig } from '../config/googleAuth';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:3001',
});
export const LoginWithGoogle = () => {
    const login = useGoogleLogin({
        flow: 'auth-code',
        onSuccess: async (codeResponse) => {
            try {
                const response = await axiosInstance.post(
                    '/google',
                    { code: codeResponse.code },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                );

                console.log('Server response:', response.data);
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


