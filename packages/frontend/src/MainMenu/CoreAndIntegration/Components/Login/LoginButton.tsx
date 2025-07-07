import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { googleAuthConfig } from '../../Config/googleAuth';
import { LoginResponse } from "shared-types"
import { useAuthStore } from "../../../../Stores/CoreAndIntegration/useAuthStore";
const axiosInstance = axios.create({
    baseURL: 'http://localhost:3001',
    withCredentials: true, // Ensure cookies are sent with requests
});
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
                // setUser(response.data.user);
                setSessionId(response.data.sessionId!)
                // Optionally, you can handle the token and expiration here
                // נניח שזה השדה שבו נשמר ה-access token
                setUser(response.data.user);
                const googleAccessToken = response.data.googleAccessToken; // ← שימוש בטוקן של גוגל
                if (googleAccessToken) {
                    localStorage.setItem('google_token', googleAccessToken); // שמירה ב-localStorage
                    // בדיקת POST calendar
                    fetch('http://localhost:3001/api/calendar/calendars/primary/events', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${googleAccessToken}`,
                        },
                        body: JSON.stringify({
                            summary: ' ניסיון נחמי איתן',
                            start: {
                                dateTime: '2025-07-21T15:00:00+03:00',
                                timeZone: 'Asia/Jerusalem'
                            },
                            end: {
                                dateTime: new Date(new Date('2025-07-21T15:00:00+03:00').getTime() + 60 * 60 * 1000).toISOString(),
                                timeZone: 'Asia/Jerusalem'
                            },
                            recurrence: ['RRULE:FREQ=WEEKLY;BYDAY=MO;COUNT=4']
                        }),
                    })
                        .then(res => res.json())
                        .then(data => console.log('POST event:', data))
                        .catch(err => console.error(err));
                    // בדיקת GET calendar
                    fetch('http://localhost:3001/api/calendar/calendars/primary/events', {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${googleAccessToken}`,
                        },
                    })
                        .then(res => res.json())
                        .then(data => console.log('GET events:', data))
                        .catch(err => console.error(err));
                    // בדיקת PATCH calendar
                    // const eventId = 'l6vt5oo4l9a2816g4vbaje5v6g_20250721T120000Z';
                    // fetch(`http://localhost:3001/api/calendar/calendars/primary/events/${eventId}`, {
                    //     method: 'PATCH',
                    //     headers: {
                    //         'Content-Type': 'application/json',
                    //         'Authorization': `Bearer ${googleAccessToken}`,
                    //     },
                    //     body: JSON.stringify({
                    //         summary: 'אירוע מעודכן',
                    //         description: 'עודכן מה-frontend',
                    //         recurrence: ['RRULE:FREQ=WEEKLY;BYDAY=MO;COUNT=4'],
                    //     }),
                    // })
                    //     .then(res => res.json())
                    //     .then(data => console.log('אירוע עודכן:', data))
                    //     .catch(err => console.error('שגיאה בעדכון:', err));
                    // בדיקת DELETE calendar
                    // const evenId = 'l6vt5oo4l9a2816g4vbaje5v6g_20250721T120000Z';
                    // fetch(`http://localhost:3001/api/calendar/calendars/primary/events/${evenId}`, {
                    //     method: 'DELETE',
                    //     headers: {
                    //         'Authorization': `Bearer ${googleAccessToken}`,
                    //     },
                    // })
                    //     .then(res => {
                    //         if (res.ok) {
                    //             console.log('האירוע נמחק בהצלחה!');
                    //         } else {
                    //             res.json().then(data => console.error('שגיאה במחיקה:', data));
                    //         }
                    //     })
                    //     .catch(err => console.error('שגיאה במחיקה:', err));
                    // בדיקת freeBusy calendar
                //     fetch('http://localhost:3001/api/calendar/calendars/primary/freeBusy', {
                //         method: 'POST',
                //         headers: {
                //             'Content-Type': 'application/json',
                //             'Authorization': `Bearer ${googleAccessToken}`,
                //         },
                //         body: JSON.stringify({
                //             start: '2025-07-23T15:00:00+03:00',
                //             end: '2025-07-23T16:00:00+03:00'
                //         }),
                //     })
                //         .then(res => res.json())
                //         .then(data => console.log('FreeBusy:', data))
                //         .catch(err => console.error(err));
                }
                    //עד כאן
                } catch (error) {
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
