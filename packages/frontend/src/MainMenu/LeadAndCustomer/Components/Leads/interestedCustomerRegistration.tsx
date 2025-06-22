import React, { useState } from "react";
import { Button } from '../../../Common/Components/BaseComponents/Button';
import { useLocation, useNavigate } from 'react-router-dom';
import { CreateCustomerRequest } from "../../../../types/customer";
import { Form } from '../../../Common/Components/BaseComponents/Form';
import { InputField } from "../../../Common/Components/BaseComponents/Input";
import { CheckboxField } from "../../../Common/Components/BaseComponents/CheckBox";
import { z } from "zod";
import { Lead } from "../../../../types/lead";
import { useForm, SubmitHandler, FieldValues } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { cursorTo } from "readline";

//כל מה שבהערה זה בשביל שהטופס יהיה רב מקטעי כמו בדרישות 
// אבל יש בעיה שהערכים ממקטע אחד עוברים למקטע אחר
// אז בנתיים זה בהערה

const schema = z.object({
    name: z.string().nonempty("Name is required"),
    phone: z.string().nonempty("Phone is required"),
    email: z.string().email("Invalid email").nonempty("Email is required"),
    idNumber: z.string().nonempty("ID Number is required"), // לא אופציונלי
    businessName: z.string().nonempty("Business Name is required"), // לא אופציונלי
    businessType: z.string().nonempty("Business Type is required"), // לא אופציונלי
    workspaceType: z.string().nonempty("Workspace type is required"),
    workspaceCount: z.number().positive("Workspace count must be a positive number"), // חובה
    contractSignDate: z.string().nonempty("Contract sign date is required"), // חובה
    contractStartDate: z.string().nonempty("Contract start date is required"), // חובה
    billingStartDate: z.string().nonempty("Billing start date is required"), // חובה
    notes: z.string().optional(), // אופציונלי
    invoiceName: z.string().optional(), // אופציונלי
    paymentMethod: z.object({
        creditCardLast4: z.string().optional(), // אופציונלי
        creditCardExpiry: z.string().optional(), // אופציונלי
        creditCardHolderIdNumber: z.string().optional(), // אופציונלי
        creditCardHolderPhone: z.string().optional(), // אופציונלי
    }).optional(), // אופציונלי
    contractDocuments: z.array(z.any()).optional(),

});

// type FormData = z.infer<typeof schema>;

export const InterestedCustomerRegistration: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    //המידע שאני מקבלת מהדף הקודם
    const lead: Lead = location.state?.data;

    const [showForm, setShowForm] = useState<boolean>(true);
    const [convertToCustomer, setConvertToCustomer] = useState<CreateCustomerRequest>(
        //אם לאתחל אז יש למטה, או לא 
    );

    // const [currentStep, setCurrentStep] = useState<number>(0);
    const [formData, setFormData] = useState<Partial<FormData>>({}); // State לשמירת נתוני הטופס

    // const { register, handleSubmit, formState: { errors }, reset, watch } = useForm<FormData>({
    //     resolver: zodResolver(schema),
    // });


    // const steps = [
    //     {
    //         title: "פרופיל",
    //         content: (
    //             <>
    //                 <InputField name="name" label="Name" required defaultValue={lead.name} />
    //                 <InputField name="phone" label="Phone" required defaultValue={lead.phone} />
    //                 <InputField name="email" label="Email" required defaultValue={lead.email} />
    //                 <InputField name="idNumber" label="ID Number" required defaultValue={lead.id} />
    //                 <InputField name="businessName" label="Business Name" required />
    //                 <InputField name="businessType" label="Business Type" required defaultValue={lead.businessType} />
    //             </>
    //         )
    //     },
    //     {
    //         title: "העדפות",
    //         content: (
    //             <>
    //                 <InputField name="workspaceType" label="Workspace Type" required />
    //                 <InputField name="workspaceCount" label="Workspace Count" required type="number" />
    //                 <InputField name="notes" label="Notes" />
    //                 <InputField name="invoiceName" label="Invoice Name" />
    //             </>
    //         )
    //     },
    //     {
    //         title: "פרטי חוזה",
    //         content: (
    //             <>
    //                 <InputField name="contractSignDate" label="Contract Sign Date" required type="date" />
    //                 <InputField name="contractStartDate" label="Contract Start Date" required type="date" />
    //                 <InputField name="billingStartDate" label="Billing Start Date" required type="date" />
    //                 <InputField name="paymentMethod.creditCardLast4" label="Credit Card Last 4" />
    //                 <InputField name="paymentMethod.creditCardExpiry" label="Credit Card Expiry" />
    //                 <InputField name="paymentMethod.creditCardHolderIdNumber" label="Credit Card Holder ID Number" />
    //                 <InputField name="paymentMethod.creditCardHolderPhone" label="Credit Card Holder Phone" />
    //                 <InputField name="contractDocuments" label="Contract Documents" type="file" multiple />

    //             </>
    //         )
    //     }
    // ];

    // const getCurrentValues = () => {
    //     const currentValues: Partial<FormData> = {};

    //     // קבלת הערכים הנוכחיים מהשדות
    //     currentValues.name = watch("name");
    //     currentValues.phone = watch("phone");
    //     currentValues.email = watch("email");
    //     currentValues.idNumber = watch("idNumber");
    //     currentValues.businessName = watch("businessName");
    //     currentValues.businessType = watch("businessType");
    //     currentValues.workspaceType = watch("workspaceType");
    //     currentValues.workspaceCount = watch("workspaceCount");
    //     currentValues.contractSignDate = watch("contractSignDate");
    //     currentValues.contractStartDate = watch("contractStartDate");
    //     currentValues.billingStartDate = watch("billingStartDate");
    //     currentValues.notes = watch("notes");
    //     currentValues.invoiceName = watch("invoiceName");
    //     const files = watch("contractDocuments");
    //     currentValues.contractDocuments = files ? Array.from(files) : [];

    //     // עבור שדות בתת-אובייקט paymentMethod
    //     currentValues.paymentMethod = {
    //         creditCardLast4: watch("paymentMethod.creditCardLast4"),
    //         creditCardExpiry: watch("paymentMethod.creditCardExpiry"),
    //         creditCardHolderIdNumber: watch("paymentMethod.creditCardHolderIdNumber"),
    //         creditCardHolderPhone: watch("paymentMethod.creditCardHolderPhone"),
    //     };
    //     console.log(currentValues);


    //     return currentValues;
    // };


    // const nextStep = () => {
    //     // const currentValues = getCurrentValues(); // קבלת הערכים הנוכחיים
    //     // setFormData((prev) => ({ ...prev, ...currentValues })); // שמירת הערכים הנוכחיים

    //     // אפס את השדות עם הערכים הנוכחיים
    //     // reset();
    //     setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    // };

    // const prevStep = () => {
    //     // טען את הערכים הקודמים לשדות
    //     // reset(formData);
    //     setCurrentStep((prev) => Math.max(prev - 1, 0));
    // };

    // const onSubmit = (data: z.infer<typeof schema>) => {
    //     console.log("Submitting form..."); // הוספת לוג
    //     alert("The form has been sent successfully:\n" + JSON.stringify(data, null, 2));
    //     console.log(data);

    //     // קבלת הקבצים מהשדה
    //     // const files = watch("contractDocuments");

    //     // המרת הקבצים למערך
    //     // const contractDocuments = files ? Array.from(files) : [];

    //     // שמירת הנתונים שנשלחו
    //     // const formDataToSend = {
    //     //     ...data,
    //     //     contractDocuments, // הוספת הקבצים לנתונים
    //     // };

    //     setFormData((prev) => ({ ...prev, ...data }));

    //     if (currentStep < steps.length - 1) {
    //         nextStep();
    //     } else {
    //         console.log(data); // הדפסת הנתונים כולל הקבצים
    //         // כאן תוכל להוסיף את הלוגיקה לשליחת הנתונים לשרת
    //         setShowForm(false);
    //     }
    // };


    const handleSubmit = (data: z.infer<typeof schema>) => {
        // יש בעיה שהפונצקיה הזו לא נקראת משום מה
        //וכן יש בעיה עם הקלטים שהם לא טקסט
        // if (data.workspaceCount) {
        //     data.workspaceCount = Number(data.workspaceCount);
        // }
        // if (!data.contractDocuments || !Array.isArray(data.contractDocuments)) {
        //     data.contractDocuments = [];
        // } else {
        //     // במקרה של קבצים, המרתם למערך
        //     data.contractDocuments = Array.from(data.contractDocuments);
        // }
        // console.log("Submitting form..."); // הוספת לוג
        alert("The form has been sent successfully:\n" + JSON.stringify(data, null, 2));
        console.log(data);
        //לשלוח לשרת את הנתונים
        setShowForm(false);
    }



    //כל הפרטים שחסר לי ואני צריכה למלא כי אין לי אותם עדיין
    //  <Button onClick={דף של החוזה} variant="primary" size="sm" >לינק לחוזה </Button>
    // וחוץ מזה כפתור שמעביר לחוזה
    return <div className='interestedCustomerRegistration'>
        {/* כל עוד הטופס לא תקין רואים אותו ולאחר שליחה רואים את הדיב */}
        {showForm ?
            <div>
                <h1 className="text-3xl font-bold text-center text-blue-600 my-4">רישום מתעניין ללקוח</h1>
                <h4 className="text-lg text-center text-gray-600 my-2">מלא את הפרטים החסרים</h4>
                {/* <Form
                    label={steps[currentStep].title}
                    schema={schema}
                    onSubmit={onSubmit}
                    className="mx-auto mt-10"
                >
                    {steps[currentStep].content}
                    <div>
                        {currentStep > 0 && <Button onClick={prevStep} variant="primary" size="sm" >Back</Button>}
                        {currentStep < steps.length - 1 && <Button onClick={nextStep} variant="primary" size="sm" >Next</Button>}
                        {currentStep === steps.length - 1 && <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" type="submit">Submit</button>}
                    </div>
                </Form> */}
                <Form
                    // label={}
                    schema={schema}
                    onSubmit={handleSubmit}
                    className="mx-auto mt-10"
                >
                    {/* <h4 className="text-lg font-semibold text-gray-800 my-4">פרופיל</h4> */}
                    <InputField name="name" label="Name" required defaultValue={lead.name} />
                    <InputField name="phone" label="Phone" required defaultValue={lead.phone} />
                    <InputField name="email" label="Email" required defaultValue={lead.email} />
                    <InputField name="idNumber" label="ID Number" required defaultValue={lead.id} />
                    <InputField name="businessName" label="Business Name" required />
                    <InputField name="businessType" label="Business Type" required defaultValue={lead.businessType} />
                    {/* <br /> */}
                    {/* <h4 className="text-lg font-semibold text-gray-800 my-4">העדפות</h4> */}
                    <InputField name="workspaceType" label="Workspace Type" required />
                    {/* <InputField name="workspaceCount" label="Workspace Count" required type="number"/> */}
                    <InputField name="notes" label="Notes" />
                    <InputField name="invoiceName" label="Invoice Name" />
                    {/* <br /> */}
                    {/* <h4 className="text-lg font-semibold text-gray-800 my-4">פרטי חוזה</h4> */}
                    <InputField name="contractSignDate" label="Contract Sign Date" required type="date" />
                    <InputField name="contractStartDate" label="Contract Start Date" required type="date" />
                    <InputField name="billingStartDate" label="Billing Start Date" required type="date" />
                    <InputField name="paymentMethod.creditCardLast4" label="Credit Card Last 4" />
                    <InputField name="paymentMethod.creditCardExpiry" label="Credit Card Expiry" />
                    <InputField name="paymentMethod.creditCardHolderIdNumber" label="Credit Card Holder ID Number" />
                    <InputField name="paymentMethod.creditCardHolderPhone" label="Credit Card Holder Phone" />
                    {/* <InputField name="contractDocuments" label="Contract Documents" type="file" multiple /> */}
                    <Button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                        Send
                    </Button>
                </Form>
            </div>
            :
            <div className="text-center my-4">
                <h2 className="text-2xl font-semibold text-gray-700 mb-2">הלקוח נרשם בהצלחה!</h2>
                <Button onClick={() => navigate(`/leadAndCustomer/customers/${lead.id}`)} variant="primary" size="sm">למעבר ללקוח שנוסף</Button>
            </div>}
    </div>


}
