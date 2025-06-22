import { Button } from '../../../Common/Components/BaseComponents/Button';
import { Form } from '../../../Common/Components/BaseComponents/Form';
import { z } from "zod";
import { InputField } from "../../../Common/Components/BaseComponents/Input";
import { CheckboxField } from "../../../Common/Components/BaseComponents/CheckBox";


export const AddContract = () => {
    const schema = z.object({
        email: z.string().email("Invalid Email").nonempty("EMAIL"),
        acceptTerms: z.boolean().refine(val => val === true, {
            message: "Yo need to accept the terms",
        }),
    });
    const handleSubmit = (data: z.infer<typeof schema>) => {
        alert("The form has been sent successfully:\n" + JSON.stringify(data, null, 2));
    };
    return (
        <div>
            <h1 className="text-3xl font-bold text-center text-blue-600 my-4">add Contract</h1>

            {/* זה רק טופס לדוג' צריך להכניס את הפרטים של החוזה */}
            <Form
                label="Example Form"
                schema={schema}
                onSubmit={handleSubmit}
                className="mx-auto mt-10"
            >
                <InputField name="email" label="Email" required />
                <CheckboxField name="acceptTerms" label="Accept the terms" required />
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    Send
                </button>
            </Form>
        </div>
    );
}