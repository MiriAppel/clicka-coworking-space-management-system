import { z } from "zod";
import { Form } from '../../../../Common/Components/BaseComponents/Form';
import { InputField } from '../../../../Common/Components/BaseComponents/Input';
import { SelectField } from '../../../../Common/Components/BaseComponents/Select';
import { Button } from '../../../../Common/Components/BaseComponents/Button';
// import { showAlert } from '../../../../Common/Components/BaseComponents/ShowAlert';
import { EmailTemplate } from 'shared-types';
import { useEmailTemplateStore } from '../../../../Stores/CoreAndIntegration/emailTemplateStore';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({
    name: z.string().nonempty("Name is required"),
    subject: z.string().nonempty("Subject is required"),
    bodyHtml: z.string().nonempty("Body Html is required"),
    bodyText: z.string().nonempty("Body Text is required"),
    language: z.string().nonempty("Language is required"),
    variables: z.string().nonempty("Variables is required")
});

interface AddEmailTemplateProps {
    onClose?: () => void;
    onEmailTemplateAdded?: () => void;
}

export const AddEmailTemplate = ({ onClose, onEmailTemplateAdded }: AddEmailTemplateProps) => {
    const { createEmailTemplate, loading } = useEmailTemplateStore();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const methods = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: {
            language: "he"
        }
    });

    const handleSubmit = async (data: z.infer<typeof schema>) => {
        setIsSubmitting(true);
        try {
            const newEmailTemplate: EmailTemplate = {
                id: "",
                name: data.name,
                subject: data.subject,
                bodyHtml: data.bodyHtml,
                bodyText: data.bodyText,
                language: data.language as 'he' | 'en',
                // variables: ["יוסי"],
                variables: data.variables.split(',').map(v => v.trim()), // Assuming variables are comma-separated
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            const createdEmailTemplate = await createEmailTemplate(newEmailTemplate);
            
            if (createdEmailTemplate) {
                // showAlert("", "תבנית המייל נוספה בהצלחה", "success");
                alert("תבנית המייל נוספה בהצלחה");
                onEmailTemplateAdded?.();
                onClose?.();
            }
        } catch (error) {
            // showAlert("שגיאה", "הוספת תבנית המייל נכשלה. נסה שוב", "error");
            alert("הוספת תבנית המייל נכשלה. נסה שוב");
        } finally {
            setIsSubmitting(false);
        }
    };

    const languageOptions = [
        { value: "he", label: "עברית" },
        { value: "en", label: "English" },
    ];

    return (
        <div className="max-w-2xl mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">הוסף תבנית דוא"ל חדשה</h2>
                {onClose && (
                    <Button variant="secondary" onClick={onClose}>
                        לבטל
                    </Button>
                )}
            </div>

            <Form
                label='מידע על תבנית דוא"ל'
                schema={schema}
                onSubmit={handleSubmit}
                methods={methods}
                className="space-y-4"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField name="name" label="שם" required />
                    <InputField name="subject" label="נושא" required />
                </div>
                <InputField name="bodyHtml" label="גוף HTML" required />
                <InputField name="bodyText" label="גוף הטקסט" required />
                <SelectField name="language" label="שפה" options={languageOptions} required />
                {/* <InputField name="variables" label="משתנים" required /> */}
                <div className="flex gap-4 pt-4">
                    <Button
                        type="submit"
                        variant="primary"
                        disabled={isSubmitting || loading}
                        className="flex-1"
                    >
                        {isSubmitting ? 'יוצר...' : 'צור תבנית דוא"ל'}
                    </Button>
                </div>
            </Form>
        </div>
    );
};