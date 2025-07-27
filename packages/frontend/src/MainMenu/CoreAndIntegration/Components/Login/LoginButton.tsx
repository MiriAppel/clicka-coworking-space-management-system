import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { LoginResponse } from "shared-types"
import { useAuthStore } from "../../../../Stores/CoreAndIntegration/useAuthStore";
import { axiosInstance } from '../../../../Service/Axios';
import { googleAuthConfig } from '../../../../Config/googleAuth';
import { showAlert } from '../../../../Common/Components/BaseComponents/ShowAlert';

export const LoginWithGoogle = () => {
    const { setUser, setSessionId } = useAuthStore();
    interface GoogleCodeResponse {
        code: string;
        // Add other properties if needed
    }
    interface GoogleLoginConfig {
        flow: 'auth-code';
        onSuccess: (codeResponse: GoogleCodeResponse) => Promise<void>;
        onError: (error: unknown) => void;
        scope: string;
        redirect_uri: string;
        extraQueryParams: {
            prompt: string;
            access_type: string;
            include_granted_scopes: string;
        };
    }
    const login = useGoogleLogin({
        flow: 'auth-code',
        onSuccess: async (codeResponse: { code: any; }) => {
            try {
                console.log('Code received from Google:', codeResponse);
                const response = await axiosInstance.post<LoginResponse>(
                    '/auth/google',
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
                    //no puede entrar a clika y hacer redirect a login 
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
        //no puede entrar a clika y hacer redirect a login 
    });

    return (
        <button onClick={() => login()}> Google התחבר עם </button>
    );
};




















