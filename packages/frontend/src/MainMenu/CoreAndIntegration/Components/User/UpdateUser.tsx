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

interface UpdateUserProps {
    user: User;
    onClose?: () => void;
    onUserUpdated?: () => void;
}

export const UpdateUser = ({ user, onClose, onUserUpdated }: UpdateUserProps) => {
    const { updateUser, loading } = useUserStore();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const methods = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: {
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            active: user.active,
            acceptTerms: true, // תמיד true לעדכון
        }
    });

    const handleSubmit = async (data: z.infer<typeof schema>) => {
        setIsSubmitting(true);

        try {
            const updatedUser: User = {
                ...user,
                email: data.email,
                firstName: data.firstName,
                lastName: data.lastName,
                role: data.role as UserRole,
                active: data.active ?? user.active,
                updatedAt: new Date().toISOString(),
            };

            const result = await updateUser(user.id as string, updatedUser);

            if (result) {
                alert("User updated successfully!");
                onUserUpdated?.();
                onClose?.();
            } else {
                alert("Failed to update user - no response from server");
            }
        } catch (error) {
            console.error("Error details:", {
                message: error instanceof Error ? error.message : 'Unknown error',
                stack: error instanceof Error ? error.stack : undefined,
                fullError: error
            });
            alert(`Failed to update user: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
                <h2 className="text-2xl font-bold">Update User</h2>
                {onClose && (
                    <Button variant="secondary" onClick={onClose}>
                        Cancel
                    </Button>
                )}
            </div>

            <Form
                label="Update User Information"
                schema={schema}
                onSubmit={handleSubmit}
                methods={methods}
                className="space-y-4"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField
                        name="firstName"
                        label="First Name"
                        required
                    />
                    <InputField
                        name="lastName"
                        label="Last Name"
                        required
                    />
                </div>

                <InputField
                    name="email"
                    label="Email"
                    required
                    type="email"
                />

                <SelectField
                    name="role"
                    label="Role"
                    options={roleOptions}
                    required
                />

                <CheckboxField
                    name="active"
                    label="Active User"
                />

                <CheckboxField
                    name="acceptTerms"
                    label="Confirm changes"
                    required
                />

                <div className="flex gap-4 pt-4">
                    <Button
                        type="submit"
                        variant="primary"
                        disabled={isSubmitting || loading}
                        className="flex-1"
                    >
                        {isSubmitting ? "Updating..." : "Update User"}
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

                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-700 mb-2">Current User Info:</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                        <p><strong>Created:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
                        <p><strong>Last Updated:</strong> {new Date(user.updatedAt).toLocaleDateString()}</p>
                    </div>
                </div>

                {isSubmitting && (
                    <div className="bg-blue-50 border border-blue-200 rounded p-4">
                        <p className="text-blue-800">Updating user, please wait...</p>
                    </div>
                )}
            </Form>
        </div>
    );
};