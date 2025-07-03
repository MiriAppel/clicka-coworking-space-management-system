import React, { useState, useEffect } from "react";
import { Button } from '../../../../Common/Components/BaseComponents/Button';
import { useLocation, useNavigate } from 'react-router-dom';
import { WorkspaceType, Customer, CustomerStatus, UpdateCustomerRequest } from "shared-types";
import { z } from "zod";
import { Form } from "../../../../Common/Components/BaseComponents/Form";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SelectField } from '../../../../Common/Components/BaseComponents/Select'; // מייבאים את הקומפוננטה
import { InputField } from "../../../../Common/Components/BaseComponents/Input";
import { patchCustomer } from "../../service/LeadAndCustomersService"

const schema = z.object({
    name: z.string().optional(),
    phone: z.string().optional().refine(val => !val || /^0\d{8,9}$/.test(val), { message: "מספר טלפון לא תקין" }),
    email: z.string().email("Invalid email").optional(),
    idNumber: z.string().optional().refine(val => !val || (/^\d{9}$/.test(val)), { message: "חובה להזין 9 ספרות בדיוק" }),
    businessName: z.string().optional(),
    businessType: z.string().optional(),
    // status: z.nativeEnum(CustomerStatus).optional(),
    //לא צריך גם את זה?
    // workspaceType: z.nativeEnum(WorkspaceType).optional(),
    // workspaceCount: z.number().optional(),
    notes: z.string().optional(), // אופציונלי
    invoiceName: z.string().optional(), // אופציונלי
    //לבדוק דחוף מה עם זה!!!
    // paymentMethods: z.array(z.object({
    //     creditCardLast4: z.string().optional().refine(val => !val || (/^\d{4}$/.test(val)), { message: "חובה להזין 4 ספרות בדיוק" }), // אופציונלי
    //     creditCardExpiry: z.string().optional().refine(val => !val || /^(0[1-9]|1[0-2])\/\d{2}$/.test(val), { message: "פורמט תוקף לא תקין (MM/YY)" }), // אופציונלי
    //     creditCardHolderIdNumber: z.string().optional().refine(val => !val || (/^\d{9}$/.test(val)), { message: "חובה להזין 9 ספרות בדיוק" }), // אופציונלי
    //     creditCardHolderPhone: z.string().optional().refine(val => !val || /^0\d{8,9}$/.test(val), { message: "מספר טלפון לא תקין" }), // אופציונלי
    // })).optional(), // אופציונלי
});


export const UpdateCustomer: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // המידע שאני מקבלת מהדף הקודם - או לעשות קריאת שרת שמקבלת לקוח בודד לפי מזהה
    const customer: Customer = location.state?.data;

    const [showForm, setShowForm] = useState<boolean>(true);


    const onSubmit = async (data: z.infer<typeof schema>) => {

        //צריך לשלוח רק את השדות ששונו - אם אפשר לדעת
        JSON.stringify(data, null, 2);
        const updateCustomer: Partial<UpdateCustomerRequest> = { ...data }
        console.log(updateCustomer);


        await patchCustomer(customer.id!, updateCustomer)
            .then(() => {
                setShowForm(false);
                console.log("Customer update successfully");
            })
            .catch((error: Error) => {
                alert("Failed to update customer. Please try again.");
                console.error("Error update customer:", error);
            });

    }

    const methods = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: { ...customer }

    });


    return <div className='interestedCustomerRegistration'>
        {/* כל עוד הטופס לא תקין רואים אותו ולאחר שליחה רואים את הדיב שבסוף */}
        {showForm ?
            <div>
                <h1 className="text-3xl font-bold text-center text-blue-600 my-4">עדכון פרטי לקוח</h1>
                <h4 className="text-lg text-center text-gray-600 my-2">ערוך את הפרטים הרצוים</h4>
                <Form
                    label=""
                    schema={schema}
                    onSubmit={onSubmit}
                    methods={methods}
                    className="mx-auto mt-10"
                >
                    <InputField name="name" label="שם" required />
                    <InputField name="phone" label="טלפון" required />
                    <InputField name="email" label="אימייל" required />
                    <InputField name="idNumber" label="תעודת זהות" required />
                    <InputField name="businessName" label="שם העסק" required />
                    <InputField name="businessType" label="סוג העסק" required />
                    <InputField name="notes" label="הערות" />
                    <InputField name="invoiceName" label="שם לחשבונית" />
                    <div className="flex justify-center mt-4 col-span-2">
                        <Button
                            variant="primary"
                            size="md"
                            type="submit"
                        >
                            ערוך
                        </Button>
                    </div>
                </Form>
            </div >
            :
            <div className="text-center my-4">
                <h2 className="text-2xl font-semibold text-gray-700 mb-2">הלקוח עודכן בהצלחה!</h2>
                <Button onClick={() => navigate(`/leadAndCustomer/customers`)} variant="primary" size="sm">לחזרה לעמוד הלקוחות</Button>
            </div>}
    </div >


}
