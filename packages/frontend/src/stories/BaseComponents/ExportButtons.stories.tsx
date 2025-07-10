// import { Meta, StoryObj } from '@storybook/react-webpack5';
// import { ExportButtons } from '../../Common/Components/BaseComponents/exportButtons';
// import { ThemeProvider } from '../../Common/Components/themeConfig'; 
// import { useRef } from 'react';

// // מידע על הקומפוננטה שנשלח ל-Storybook
// const meta: Meta<typeof ExportButtons> = {
//   title: 'Components/ExportButtons', // כותרת הסיפור ב-Storybook
//   component: ExportButtons, // הקומפוננטה עצמה
//   parameters: {
//     docs: {
//       description: {
//         component: 'הקומפוננטה ExportButtons מציגה כפתורים לייצוא נתונים לפורמטים של CSV ו-PDF, בהתאם לנתונים שנמסרו לה.',
//       },
//     },
//   },
// };const meta: Meta<typeof ExportButtons> = {
//   title: 'Components/ExportButtons', // כותרת הסיפור ב-Storybook
//   component: ExportButtons, // הקומפוננטה עצמה
//   decorators: [
//     (Story) => (
//       <ThemeProvider>
//         <Story />
//       </ThemeProvider>
//     ),
//   ],
//   parameters: {
//     docs: {
//       description: {
//         component: 'הקומפוננטה ExportButtons מציגה כפתורים לייצוא נתונים לפורמטים של CSV ו-PDF, בהתאם לנתונים שנמסרו לה.',
//       },
//     },
//   },
// };

// export default meta;

// // יצירת סיפור עם פרופס שונים
// type Story = StoryObj<typeof meta>;

// // סיפור לדוגמה ל-ExportButtons
// export const ExportButtonsExample: Story = {
//   args: {
//     title: 'Export Example', // כותרת הדוח
//     exportData: [
//       { name: 'John Doe', email: 'john@example.com' },
//       { name: 'Jane Smith', email: 'jane@example.com' },
//     ], // נתונים להפקת CSV
//     refContent: useRef<HTMLDivElement | null>(null), // רפרנס לאלמנט שייתפס כ-PDF
//   },
// };


import { Meta, StoryObj } from '@storybook/react-webpack5';
import { ExportButtons } from '../../Common/Components/BaseComponents/exportButtons';
import { ThemeProvider } from '../../Common/Components/themeConfig'; 
import { useRef } from 'react';

// מידע על הקומפוננטה שנשלח ל-Storybook
const meta: Meta<typeof ExportButtons> = {
  title: 'Components/ExportButtons', // כותרת הסיפור ב-Storybook
  component: ExportButtons, // הקומפוננטה עצמה
  decorators: [
    (Story) => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component: 'הקומפוננטה ExportButtons מציגה כפתורים לייצוא נתונים לפורמטים של CSV ו-PDF, בהתאם לנתונים שנמסרו לה.',
      },
    },
  },
};

export default meta;

// יצירת סיפור עם פרופס שונים
type Story = StoryObj<typeof meta>;

// סיפור לדוגמה ל-ExportButtons
export const ExportButtonsExample: Story = {
  args: {
    title: 'Export Example', // כותרת הדוח
    exportData: [
      { name: 'John Doe', email: 'john@example.com' },
      { name: 'Jane Smith', email: 'jane@example.com' },
    ], // נתונים להפקת CSV
    refContent: useRef<HTMLDivElement | null>(null), // רפרנס לאלמנט שייתפס כ-PDF
  },
};