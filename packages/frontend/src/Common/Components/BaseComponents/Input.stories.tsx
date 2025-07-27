import { Meta, StoryObj } from '@storybook/react-webpack5';
import { InputField } from './Input';
import { useForm, FormProvider } from 'react-hook-form';

const meta: Meta<typeof InputField> = {
  title: 'BaseComponents/Input',
  component: InputField,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: 'testInput',
    label: 'Test Label',
    required: true,
    type: 'text',
    placeholder: 'Enter something...',
  },
  render: (args) => {
    const methods = useForm();
    return (
      <FormProvider {...methods}>
        <InputField {...args} />
      </FormProvider>
    );
  },
};
