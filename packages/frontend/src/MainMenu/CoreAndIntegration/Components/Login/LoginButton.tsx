import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { googleAuthConfig } from '../../Config/googleAuth';
import { LoginResponse } from "shared-types"
import { useAuthStore } from "../../../../Stores/Auth/useAuthStore";
import { axiosInstance } from '../../../../service/Axios';

export const LoginWithGoogle = () => {
    // const setUser = useAuthStore((state) => state.setUser);
    const { setUser, setSessionId } = useAuthStore();
    const login = useGoogleLogin({
        flow: 'auth-code',
        onSuccess: async (codeResponse) => {
            try {
                console.log('Code received from Google:', codeResponse);

                const response = await axiosInstance.post<LoginResponse>(
                    '/api/auth/google',
                    { code: codeResponse.code },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                );

                console.log('Server response:', response.data);
                setUser(response.data.user);
                setSessionId(response.data.sessionId!)
                // Optionally, you can handle the token and expiration here
            } catch (error:any) {
                 if (axios.isAxiosError(error) && error.response?.status === 401){
                    alert('You are not authorized to access this resource.');
                    return;
                 }
                 if(axios.isAxiosError(error)){
                    alert(error.message)
                 }
                console.error('Error sending code to server:', error);
            }
        },
        onError: (error) => console.error('Login Failed:', error),
        scope: googleAuthConfig.scopes.join(' '),
        redirect_uri: googleAuthConfig.redirectUri,
    });

    return (
        <button onClick={() => login()}> Google התחבר עם </button>
    );
};


