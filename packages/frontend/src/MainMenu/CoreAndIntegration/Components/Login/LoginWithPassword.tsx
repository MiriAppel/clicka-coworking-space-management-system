import { FieldValues, useForm } from "react-hook-form"
import { Form } from "../../../../Common/Components/BaseComponents/Form"
import { InputField } from "../../../../Common/Components/BaseComponents/Input"
import { Button } from "../../../../Common/Components/BaseComponents/Button"
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod"
import axiosInstance from "../../../../Services/Axios";
import { useAuthStore } from "../../../../Stores/CoreAndIntegration/useAuthStore";
import { useNavigate } from 'react-router-dom';
const schema = z.object({
    email: z.string().min(1, "Email required").email("Invalid Email").nonempty("EMAIL"),
    password: z.string().min(1, "Password required").nonempty("PASSWORD"),
});

type FormSchema = z.infer<typeof schema>;
export const LoginWithPassword = () => {
    const { setUser, setSessionId } = useAuthStore();
    const navigate = useNavigate();

    const methods = useForm<FormSchema>({
        resolver: zodResolver(schema),
    });
    const onSubmit = async (data: FormSchema) => {
        try {
            console.log("🔐 sending: ", data);

            const response = await axiosInstance.post("/auth/loginWithPassword", JSON.stringify(data, null, 2));
            console.log("✅ success", response.data);
            setUser(response.data.user);
            setSessionId(response.data.sessionId);
            navigate("/");
        } catch (error) {
            console.error("❌ error logging in", error);
        }
    };
    return (
        <Form
            schema={schema}
            methods={methods}
            onSubmit={onSubmit}
            className="mx-auto mt-10">
            <InputField name="email" label="מייל" type="email" required placeholder="email" />
            <br />
            <InputField name="password" label="סיסמה" type="password" required placeholder="password" />
            <br />
            <Button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                התחבר
            </Button>
        </Form>
    )

}