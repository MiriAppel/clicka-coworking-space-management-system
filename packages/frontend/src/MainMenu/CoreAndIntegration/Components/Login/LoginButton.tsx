import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { LoginResponse } from "shared-types"
import { useAuthStore } from "../../../../Stores/CoreAndIntegration/useAuthStore";
import { axiosInstance } from '../../../../Services/Axios';
import { googleAuthConfig } from '../../../../Config/googleAuth';
import { showAlert } from '../../../../Common/Components/BaseComponents/ShowAlert';

export const LoginWithGoogle = () => {
    const { setUser, setSessionId } = useAuthStore();
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
            } catch (error: any) {
                if (axios.isAxiosError(error) && error.response?.status === 401) {
                    showAlert("", "המשתמש לא מורשה לגשת למשאב זה", "error");
                    return;
                }
                if (axios.isAxiosError(error)) {
                    showAlert("", error.message, "error");
                }
                console.error('Error sending code to server:', error);
            }
        },
        onError: (error: any) => console.error('Login Failed:', error),
        scope: googleAuthConfig.scopes.join(' '),
        redirect_uri: googleAuthConfig.redirectUri,
        extraQueryParams: {
            prompt: 'consent',
            access_type: 'offline',
             include_granted_scopes: 'false',
        }
    } as any);

    return (
        <button onClick={() => login()}> Google התחבר עם </button>
    );
};


