import { z } from "zod";
import { Form } from '../../../../Common/Components/BaseComponents/Form';
import { InputField } from '../../../../Common/Components/BaseComponents/Input';
import { CheckboxField } from '../../../../Common/Components/BaseComponents/CheckBox';
import { SelectField } from '../../../../Common/Components/BaseComponents/Select';
import { Button } from '../../../../Common/Components/BaseComponents/Button';
import { User, UserRole } from 'shared-types';
import { useUserStore } from '../../../../Stores/CoreAndIntegration/userStore';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({
  email: z.string().email("Invalid Email").nonempty("EMAIL is required"),
  firstName: z.string().nonempty("First name is required"),
  lastName: z.string().nonempty("Last name is required"),
  role: z.string().nonempty("Role is required"),
  active: z.boolean().optional(),
  acceptTerms: z.boolean().refine(val => val === true, {
    message: "You need to accept the terms",
  }),
});

interface AddUserProps {
  onClose?: () => void;
  onUserAdded?: () => void;
}

export const AddUser = ({ onClose, onUserAdded }: AddUserProps) => {
  const { createUser, loading } = useUserStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const methods = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      active: true,
    }
  });

  const handleSubmit = async (data: z.infer<typeof schema>) => {
    console.log('🚀 handleSubmit called with data:', data);
    setIsSubmitting(true);
    
    try {
      const newUser: User = {
        id: "",
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role as UserRole,
        googleId: "",
        lastLogin: "",
        active: data.active ?? true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      console.log('📤 Creating user:', newUser);
      const createdUser = await createUser(newUser);
      
      if (createdUser) {
        console.log('✅ User created successfully!');
        alert("User created successfully!");
        onUserAdded?.();
        onClose?.();
      }
    } catch (error) {
      console.error("❌ Error creating user:", error);
      alert("Failed to create user. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const roleOptions = [
    { value: UserRole.ADMIN, label: "Admin" },
    { value: UserRole.MANAGER, label: "Manager" },
    { value: UserRole.SYSTEM_ADMIN, label: "System Admin" },
  ];

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Add New User</h2>
        {onClose && (
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
        )}
      </div>

      <Form
        label="User Information"
        schema={schema}
        onSubmit={handleSubmit}
        methods={methods}
        className="space-y-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField name="firstName" label="First Name" required />
          <InputField name="lastName" label="Last Name" required />
        </div>
        
        <InputField name="email" label="Email" required type="email" />
        
        <SelectField name="role" label="Role" options={roleOptions} required />
        
        <CheckboxField name="active" label="Active User" />
        
        <CheckboxField name="acceptTerms" label="Accept the terms and conditions" required />
        
        <div className="flex gap-4 pt-4">
          <Button 
            type="submit" 
            variant="primary" 
            disabled={isSubmitting || loading}
            className="flex-1"
          >
            {isSubmitting ? "Creating..." : "Create User"}
          </Button>
          
          {onClose && (
            <Button 
              type="button" 
              variant="secondary" 
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
          )}
        </div>
      </Form>
    </div>
  );
};