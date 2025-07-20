// קובץ preview.ts של Storybook
// קובץ זה קובע את ההגדרות הגלובליות של סטוריבורד לכל הסיפורים (stories)

import type { Preview } from '@storybook/react-webpack5';

// טוען את קובץ העיצוב הגלובלי של הפרויקט (RTL, פונטים, מרווחים וכו')
// חובה על מנת שכל קומפוננטה תיראה כפי שהיא נראית באפליקציה עצמה
// import '../index.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        // זיהוי אוטומטי של פרופסים שמכילים צבע (background, color) להצגה ב־storybook controls
        color: /(background|color)$/i,
        // זיהוי אוטומטי של שדות תאריך להצגה עם ממשק בחירת תאריך
        date: /Date$/i,
      },
    },
  },
};

export default preview;
