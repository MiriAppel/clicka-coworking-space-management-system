import React from 'react';

// useNavigate – מאפשר לנו לנתב בין עמודים (למשל לחזור אחורה).
// useLocation – מאפשר לנו לדעת באיזה עמוד אנחנו נמצאים כרגע.
import { useNavigate, useLocation } from 'react-router-dom';

import { Button } from './Button';

// קומפוננטה פונקציונלית – מציגה כפתור "חזרה" רק אם לא נמצאים בעמוד הראשי.
const BackButton = () => {
  // hook שמאפשר לנו לבצע ניווט בתוכנית (כמו לחיצה על back).
  const navigate = useNavigate();

  // hook שמחזיר מידע על הנתיב הנוכחי (לדוגמה: '/', '/customers', '/settings')
  const location = useLocation();

  // קובע אם להציג את כפתור החזרה – נציג אותו רק אם לא נמצאים בעמוד הראשי.
  const showBackButton = location.pathname !== '/';

  // אם אנחנו בעמוד הראשי, לא מציגים בכלל את הקומפוננטה – מחזיר null.
  if (!showBackButton) return null;

  // אחרת – מציגים את הכפתור עם עיצוב בסיסי וריווח.
  return (
    <div>
      {/* כפתור שמעביר את המשתמש עמוד אחד אחורה בהיסטוריית הדפדפן */}
      <Button variant="primary" onClick={() => navigate(-1)}>
        חזרה
      </Button>
    </div>
  );
};

// מייצא את הקומפוננטה כך שנוכל להשתמש בה בקבצים אחרים.
export default BackButton;
