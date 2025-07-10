// import { Meta, StoryObj } from '@storybook/react-webpack5';
// import { ChartDisplay, ChartData } from '../../Common/Components/BaseComponents/Graph';

// // זהו המידע על הקומפוננטה שנשלח ל-Storybook
// const meta: Meta<typeof ChartDisplay> = {
//   title: 'Components/ChartDisplay', // כותרת הסיפור ב-Storybook
//   component: ChartDisplay, // הקומפוננטה עצמה
// };

// export default meta;

// // יצירת סיפור עם פרופס שונים
// type Story = StoryObj<typeof meta>;

// export const ChartExample: Story = {
//   args: {
//     data: [
//       { label: 'Jan', value: 400 },
//       { label: 'Feb', value: 500 },
//       { label: 'Mar', value: 300 },
//       { label: 'Apr', value: 700 },
//     ], // נתוני הגרף
//     title: 'Chart Example', // כותרת לגרף
//     rtl: false, // אם להציג את הגרף מימין לשמאל
//   },
// };


import { Meta, StoryObj } from '@storybook/react-webpack5';
import { ChartDisplay } from '../../Common/Components/BaseComponents/Graph';

// זהו המידע על הקומפוננטה שנשלח ל-Storybook
const meta: Meta<typeof ChartDisplay> = {
  title: 'Components/ChartDisplay', // כותרת הסיפור ב-Storybook
  component: ChartDisplay, // הקומפוננטה עצמה
  parameters: {
    docs: {
      description: {
        component: 'הקומפוננטה ChartDisplay מציגה גרפים אינטראקטיביים, המאפשרים להצגת נתונים בצורה גרפית וויזואלית. תומך בגרפים מסוגים שונים, כולל גרף קו וגרף עמודות.',
      },
    },
  },
};

export default meta;

// יצירת סיפור עם פרופס שונים
type Story = StoryObj<typeof meta>;

export const ChartExample: Story = {
  args: {
    data: [
      { label: 'Jan', value: 400 },
      { label: 'Feb', value: 500 },
      { label: 'Mar', value: 300 },
      { label: 'Apr', value: 700 },
    ], // נתוני הגרף
    title: 'Chart Example', // כותרת לגרף
    rtl: false, // אם להציג את הגרף מימין לשמאל
  },
};
