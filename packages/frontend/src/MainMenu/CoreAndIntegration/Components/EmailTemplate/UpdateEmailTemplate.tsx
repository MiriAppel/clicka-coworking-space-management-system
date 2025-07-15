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
    // variables: z.string().nonempty("Variables is required")
});

interface UpdateEmailTemplateProps {
    emailTemplate: EmailTemplate;
    onClose?: () => void;
    onEmailTemplateUpdated?: () => void;
}

export const UpdateEmailTemplate = ({ emailTemplate, onClose, onEmailTemplateUpdated }: UpdateEmailTemplateProps) => {
    const { updateEmailTemplate, loading } = useEmailTemplateStore();
    const [isSubmitting, setIsSubmitting] = useState(false);
    // const [language, setLanguage] = useState<'he' | 'en'>(emailTemplate.language || 'he');

    const methods = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: emailTemplate.name,
            subject: emailTemplate.subject,
            bodyHtml: emailTemplate.bodyHtml,
            bodyText: emailTemplate.bodyText,
            language: emailTemplate.language || 'he',
            // variables: emailTemplate.variables.join(',')
        }
    });

    const handleSubmit = async (data: z.infer<typeof schema>) => {
        setIsSubmitting(true);
        try {
            const updatedEmailTemplate: EmailTemplate = {
                ...emailTemplate,
                name: data.name,
                subject: data.subject,
                bodyHtml: data.bodyHtml,
                bodyText: data.bodyText,
                language: data.language as 'he' | 'en',
                // variables: ["יוסי"],
                // variables: data.variables.split(',').map(v => v.trim()), // Assuming variables are comma-separated
                updatedAt: new Date().toISOString(),
            };

            const result = await updateEmailTemplate(emailTemplate.id as string, updatedEmailTemplate);

            if (result) {
                // showAlert("", "תבנית המייל עודכנה בהצלחה", "success");
                alert("תבנית המייל עודכנה בהצלחה");
                onEmailTemplateUpdated?.();
                onClose?.();
            }
        } catch (error) {
            console.error("Error details:", {
                message: error instanceof Error ? error.message : 'Unknown error',
                stack: error instanceof Error ? error.stack : undefined,
                fullError: error
            });
            // showAlert("שגיאה", "עדכון תבנית המייל נכשלה. נסה שוב", "error");
            alert("עדכון תבנית המייל נכשלה. נסה שוב");
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
                <h2 className="text-2xl font-bold">עדכון תבנית דוא"ל</h2>
                {onClose && (
                    <Button variant="secondary" onClick={onClose}>
                        לבטל
                    </Button>
                )}
            </div>

            <Form
                label='עדכון מידע על תבנית דוא"ל'
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
                {/* <InputField name="variables" label="variables" required /> */}
                <div className="flex gap-4 pt-4">
                    <Button
                        type="submit"
                        variant="primary"
                        disabled={isSubmitting || loading}
                        className="flex-1"
                    >
                        {isSubmitting ? 'מעדכן' : 'עדכן תבנית דוא"ל'}
                    </Button>
                </div>

                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-700 mb-2">מידע על תבנית הדוא"ל הנוכחית:</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                        <p><strong>נוצר:</strong> {new Date(emailTemplate.createdAt).toLocaleDateString()}</p>
                        <p><strong>עדכון אחרון:</strong> {new Date(emailTemplate.updatedAt).toLocaleDateString()}</p>
                    </div>
                </div>

                {isSubmitting && (
                    <div className="bg-blue-50 border border-blue-200 rounded p-4">
                        <p className="text-blue-800">מעדכן תבנית אימייל, אנא המתן...</p>
                    </div>
                )}
            </Form>
        </div>
    );
};