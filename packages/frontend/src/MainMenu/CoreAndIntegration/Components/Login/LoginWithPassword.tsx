import { FieldValues, useForm } from "react-hook-form"
import { Form } from "../../../../Common/Components/BaseComponents/Form"
import { InputField } from "../../../../Common/Components/BaseComponents/Input"
import { Button } from "../../../../Common/Components/BaseComponents/Button"
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod"
import { useAuthStore } from "../../../../Stores/CoreAndIntegration/useAuthStore";
import axios from "axios";
import { showAlert } from "../../../../Common/Components/BaseComponents/ShowAlert";
import axiosInstance from "../../../../Service/Axios";
import { s } from "@fullcalendar/core/internal-common";
const schema = z.object({
    email: z.string().min(1, "Email required").email("Invalid Email").nonempty("EMAIL"),
    password: z.string().min(1, "Password required").nonempty("PASSWORD"),
});
type FormSchema = z.infer<typeof schema>;
export const LoginWithPassword = () => {
    const { setUser, setSessionId } = useAuthStore();

    const methods = useForm<FormSchema>({
        resolver: zodResolver(schema),
    });
    const onSubmit = async (data: FormSchema) => {
        try {
            console.log("sending: ", data);

            const response = await axiosInstance.post("/auth/loginWithPassword", JSON.stringify(data, null, 2));
            console.log(" success", response.data);
            setUser(response.data.user);
            setSessionId(response.data.sessionId);
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.data.error === 'Invalid email or password') {
                console.error("Invalid password", error.response?.data);
                showAlert("Invalid email or password", "מייל או סיסמא לא נכונים", "error");
            } else {
                console.error("error logging in", error);
            }

        }
    };
    const register = async (data: FormSchema) => {
        try {
            const response = await axiosInstance.post("/auth/registerUserPassword", JSON.stringify(data, null, 2));
            setUser(response.data.user);
            setSessionId(response.data.sessionId);
            console.log("Registration successful", response.data);
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.data.error === 'User password already exists') {
                showAlert("User password already exists", "קיימת סיסמה למשתמש", "error");
                return;
            }
            else if (axios.isAxiosError(error) && error.response?.data.error === 'User not exists') {
                showAlert("User not exists", "משתמש לא קיים", "error");
                return;
            }
            console.error("error logging in", error);
            showAlert("error", "Error registering user", "error");
        }
    }
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
            <Button
                type="button"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                onClick={() => register(methods.getValues() as FormSchema)}>
                הרשם
            </Button>
        </Form>
    )

}