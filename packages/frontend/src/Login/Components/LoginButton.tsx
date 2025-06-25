import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { googleAuthConfig } from '../../Config/googleAuth';
import { LoginResponse } from '../../../../../types/auth';
import { useAuthStore } from '../../store/useAuthStore';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:3001',
    withCredentials: true, // Ensure cookies are sent with requests
});
export const LoginWithGoogle = () => {
    const setUser = useAuthStore((state) => state.setUser);
    console.log('Using redirectUri:', googleAuthConfig.redirectUri);
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
                console.log(JSON.stringify(codeResponse, null, 2));

                console.log('Server response:', response.data);
                setUser(response.data.user);
                const googleAccessToken = response.data.googleAccessToken; // ← שימוש בטוקן של גוגל
                if (googleAccessToken) {
                    localStorage.setItem('google_token', googleAccessToken); // שמירה ב-localStorage
                    // שליחת מייל
                    const sendRes = await fetch('http://localhost:3001/api/gmail/v1/users/me/messages/send', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${googleAccessToken}`,
                        },
                        body: JSON.stringify({
                            to: ['L0548544962@gmail.com'],
                            subject: 'welcome',
                            body: 'זהו מייל שנשלח לאחר login מוצלח',
                            isHtml: false,
                        }),
                    });
                    console.log('Send mail response:', sendRes);
                    try {
                        const sendData = await sendRes.json();
                        console.log('Send mail data:', sendData);
                        if (sendRes.ok) {
                            alert('המייל נשלח בהצלחה!');
                        } else {
                            alert('שליחת המייל נכשלה: ' + (sendData.error || sendRes.status));
                        }
                    } catch (e) {
                        alert('שגיאה בקריאת תשובת השרת');
                    }

                    // }
                    // --- כאן להוסיף בדיקת GET gmail---
                    //     const getRes = await fetch('http://localhost:3001/api/gmail/v1/users/me/messages', {
                    //         method: 'GET',
                    //         headers: {
                    //             'Authorization': `Bearer ${googleAccessToken}`,
                    //         },
                    //     });
                    //     const getData = await getRes.json();
                    //     console.log('GET response:', getData);

                    // } else {
                    //     alert('לא התקבל access token מגוגל');
                    // }
                    //     // העלאת קובץ דוגמה (text file)
                    //     const uploadData = new FormData();
                    //     uploadData.append('file', new Blob(['Hello from frontend!'], { type: 'text/plain' }), 'example.txt');

                    //     const uploadRes = await fetch('http://localhost:3001/api/drive/v3/files', {
                    //         method: 'POST',
                    //         headers: {
                    //             'Authorization': `Bearer ${googleAccessToken}`,
                    //             // אל תוסיף Content-Type, הדפדפן יגדיר אותו אוטומטית עבור FormData
                    //         },
                    //         body: uploadData,
                    //     });
                    //     const uploadResult = await uploadRes.json();
                    //     console.log('Upload response:', uploadResult);
                    //     // Optionally, you can handle the token and expiration here
                    // }
                    //בדיקת post calendar
                    // fetch('http://localhost:3001/api/calendar/calendars/primary/events', {
                    //     method: 'POST',
                    //     headers: {
                    //         'Content-Type': 'application/json',
                    //         'Authorization': `Bearer ${googleAccessToken}`,
                    //     },
                    //     body: JSON.stringify({
                    //         summary: 'פגישת בדיקה',
                    //         description: 'פגישה לדוגמה',
                    //         start: { dateTime: '2025-07-23T15:00:00+03:00' },
                    //         end: { dateTime: '2025-07-23T16:00:00+03:00' }
                    //         // אפשר להוסיף עוד שדות לפי הצורך
                    //     }),
                    // })
                    //     .then(res => res.json())
                    //     .then(data => console.log(data))
                    //     .catch(err => console.error(err));
                    // //בדיקת GET calendar
                    // fetch('http://localhost:3001/api/calendar/calendars/primary/events', {
                    //     method: 'GET',
                    //     headers: {
                    //         'Authorization': `Bearer ${googleAccessToken}`,
                    //     },
                    // })
                    //     .then(res => res.json())
                    //     .then(data => console.log(data))
                    // .catch(err => console.error(err));

                    //בדיקת PATCH calendar
                    // const eventId = 't7uo6gg0dusalh51snqig80rgk';

                    // fetch(`http://localhost:3001/api/calendar/calendars/primary/events/${eventId}`, {
                    //     method: 'PATCH',
                    //     headers: {
                    //         'Content-Type': 'application/json',
                    //         'Authorization': `Bearer ${googleAccessToken}`,
                    //     },
                    //     body: JSON.stringify({
                    //         summary: 'פגישה מעודכנת',
                    //         description: 'עודכן מה-frontend',
                    //         // אפשר לעדכן גם start, end, location וכו'
                    //     }),
                    // })
                    //     .then(res => res.json())
                    //     .then(data => console.log('אירוע עודכן:', data))
                    //     .catch(err => console.error('שגיאה בעדכון:', err));
                    //בדיקת DELETE calendar
                    // const eventId = 't7uo6gg0dusalh51snqig80rgk';

                    // fetch(`http://localhost:3001/api/calendar/calendars/primary/events/${eventId}`, {
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
                    //בדיקת freeBusy calendar
                    // fetch('http://localhost:3001/api/calendar/calendars/primary/freeBusy', {
                    //     method: 'POST',
                    //     headers: {
                    //         'Content-Type': 'application/json',
                    //         'Authorization': `Bearer ${googleAccessToken}`,
                    //     },
                    //     body: JSON.stringify({
                    //         start: '2025-07-23T15:00:00+03:00',
                    //         end: '2025-07-23T16:00:00+03:00'
                    //     }),
                    // })
                    //     .then(res => res.json())
                    //     .then(data => console.log('FreeBusy:', data))
                    //     .catch(err => console.error(err));
                    // 1. העלאת קובץ ל-Drive
                    // const fileContent = new Blob(['get from Clicka!'], { type: 'text/plain' });
                    // const formData = new FormData();
                    // formData.append('file', fileContent, 'hello.txt');

                    // const uploadRes = await fetch('http://localhost:3001/api/drive/v3/files', {
                    //     method: 'POST',
                    //     headers: {
                    //         'Authorization': `Bearer ${googleAccessToken}`,
                    //     },
                    //     body: formData,
                    // });
                    // const uploadData = await uploadRes.json();
                    // console.log('Upload response:', uploadData);

                    // const fileId = uploadData.id; // ודא שזה השדה הנכון שמוחזר מהשרת
                    // 2. הורדת הקובץ שהועלה
                    // const downloadRes = await fetch(`http://localhost:3001/api/drive/v3/files/${fileId}`, {
                    //     method: 'GET',
                    //     headers: {
                    //         'Authorization': `Bearer ${googleAccessToken}`,
                    //     },
                    // });

                    // if (!downloadRes.ok) {
                    //     const errorText = await downloadRes.text();
                    //     console.error('Download failed:', errorText);
                    // }
                    //  else
                     {
                        // const blob = await downloadRes.blob();
                        // const contentDisposition = downloadRes.headers.get("Content-Disposition");

                        // let fileName = 'downloaded_file';
                        // if (contentDisposition) {
                        //     const match = contentDisposition.match(/filename="?(.+?)"?$/);
                        //     if (match?.[1]) {
                        //         fileName = decodeURIComponent(match[1]);
                        //     }
                        // }

                        // const url = window.URL.createObjectURL(blob);
                        // const a = document.createElement('a');
                        // a.href = url;
                        // a.download = fileName;
                        // document.body.appendChild(a);
                        // a.click();
                        // a.remove();
                        // window.URL.revokeObjectURL(url);
                        // console.log('📥 הקובץ ירד בהצלחה:', fileName);

                        // 3. שיתוף הקובץ עם מייל
                        // const shareRes = await fetch(`http://localhost:3001/api/drive/v3/files/${fileId}/permissions`, {
                        //     method: 'POST',
                        //     headers: {
                        //         'Content-Type': 'application/json',
                        //         'Authorization': `Bearer ${googleAccessToken}`,
                        //     },
                        //     body: JSON.stringify({
                        //         role: 'reader', // אפשר גם 'writer'
                        //         type: 'user',
                        //         emailAddress: 'L0548544962@gmail.com' // ← שימי כאן את האימייל שאיתו לשתף את הקובץ
                        //     }),
                        // });

                        // if (shareRes.ok) {
                        //     console.log('✅ הקובץ שותף בהצלחה');
                        //     alert('הקובץ שותף בהצלחה!');
                        // } else {
                        //     const err = await shareRes.text();
                        //     console.error('❌ שגיאה בשיתוף הקובץ:', err);
                        //     alert('שגיאה בשיתוף הקובץ:\n' + err);
                        // }
                        // 3. מחיקת הקובץ מה-Drive
                    //     const deleteRes = await fetch(`http://localhost:3001/api/drive/v3/files/${fileId}`, {
                    //         method: 'DELETE',
                    //         headers: {
                    //             'Authorization': `Bearer ${googleAccessToken}`,
                    //         },
                    //     });

                    //     if (deleteRes.ok) {
                    //         console.log('🗑️ הקובץ נמחק בהצלחה מה-Drive');
                    //         alert('הקובץ נמחק בהצלחה!');
                    //     } else {
                    //         const errText = await deleteRes.text();
                    //         console.error('❌ שגיאה במחיקת הקובץ:', errText);
                    //         alert('שגיאה במחיקת הקובץ:\n' + errText);
                    //     }
                    }
                }
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


