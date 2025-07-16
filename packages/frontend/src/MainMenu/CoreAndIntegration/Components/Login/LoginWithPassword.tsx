import { FieldValues, useForm } from "react-hook-form"
import { Form } from "../../../../Common/Components/BaseComponents/Form"
import { InputField } from "../../../../Common/Components/BaseComponents/Input"
import { Button } from "../../../../Common/Components/BaseComponents/Button"
import axiosInstance from "../../../../Services/Axios"
import z from "zod"

export const LoginWithPassword = () => {
      const schema = z.object({
        email: z.string().min(1, "Email required").email("Invalid Email").nonempty("EMAIL"),
        password: z.string().min(1, "Password required").nonempty("PASSWORD"),
        acceptTerms: z.boolean().refine(val => val === true, {
          message: "Yo need to accept the terms",
        }),
      });
 const handleSubmit = async (data: z.infer<typeof schema>) => {
    try {
      console.log("🔐 sending: ", data);
      const response = await axiosInstance.post("/api/auth/loginWithPassword", data);
      console.log("✅ success", response.data);
    } catch (error) {
      console.error("❌ error logging in", error);
    }
  };
    return(
        <Form label="log-in" schema={schema}  onSubmit={handleSubmit} className="mx-auto mt-10">
            <InputField name="email" label="מייל" type="email" required placeholder="email"/>
            <br />
            <InputField name="password" label="סיסמה" type="password" required placeholder="password"/>
            <br />
            <Button type="submit" variant="primary" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">התחבר</Button>
        </Form>
    )
     
}