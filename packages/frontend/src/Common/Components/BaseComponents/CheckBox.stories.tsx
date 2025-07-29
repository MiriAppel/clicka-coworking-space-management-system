import { Meta, StoryObj } from '@storybook/react-webpack5';
import { CheckboxField } from './CheckBox';
import { useForm, FormProvider } from 'react-hook-form';
const meta: Meta<typeof CheckboxField> = {
  title: 'BaseComponents/CheckBox',
  component: CheckboxField,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: 'example',
    label: 'Test Checkbox',
    required: true,
  },
  render: (args) => {
    const methods = useForm();
    return (
      <FormProvider {...methods}>
        <CheckboxField {...args} />
      </FormProvider>
    );
  },
};