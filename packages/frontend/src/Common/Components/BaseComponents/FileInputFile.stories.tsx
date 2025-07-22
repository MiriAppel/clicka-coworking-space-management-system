import { Meta, StoryObj } from '@storybook/react-webpack5';
import { FileInputField } from './FileInputFile';
import { useForm, FormProvider } from 'react-hook-form'; // הוסף את ה־FormProvider ו־useForm

const meta: Meta<typeof FileInputField> = {
  title: 'BaseComponents/FileInputFile',
  component: FileInputField,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: 'example',       // שמו של השדה (החיבור עם ה־useForm)
    label: 'Test File Input',
    required: true,        // אם דרוש
    multiple: true,        // אם ניתן לבחור הרבה קבצים
  },
  render: (args) => {
    // הגדרת useForm ו־FormProvider סביב ה־FileInputField
    const methods = useForm();  // יצירת אובייקט useForm
    return (
      <FormProvider {...methods}> {/* עוטף את הקומפוננטה ב־FormProvider */}
        <FileInputField {...args} />
      </FormProvider>
    );
  },
};
