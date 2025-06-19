import { useEffect } from 'react';

function GmailSender() {
  useEffect(() => {
    async function sendEmail() {
      const token = localStorage.getItem('google_token'); // ודאי שזה קיים
      if (!token) {
        console.error('אין טוקן');
        return;
      }

      const response = await fetch('/api/gmail/v1/users/me/messages/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          to: ['someone@example.com'],
          subject: 'נשלח מקומפוננטה',
          body: 'בדיקת שליחה אוטומטית',
          isHtml: false,
        }),
      });

      const result = await response.json();
      console.log('תוצאה:', result);
    }

    sendEmail();
  }, []);

  return <p>מייל נשלח (אם הכל תקין)</p>;
}

export default GmailSender;
