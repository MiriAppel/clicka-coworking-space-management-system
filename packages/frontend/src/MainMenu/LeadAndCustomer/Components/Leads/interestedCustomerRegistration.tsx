import React, { useState } from "react";
import { Button } from '../../../Common/Components/BaseComponents/Button';
import { useLocation, useNavigate } from 'react-router-dom';
import { CreateCustomerRequest, WorkspaceType } from "../../../../types/customer";
import { Form } from '../../../Common/Components/BaseComponents/Form';
import { InputField } from "../../../Common/Components/BaseComponents/Input";
import { CheckboxField } from "../../../Common/Components/BaseComponents/CheckBox";
import { z } from "zod";
import { Lead } from "../../../../types/lead";
import { useForm, SubmitHandler, FieldValues } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { cursorTo } from "readline";

// יש בעיה בטופס עם המקטעים שעוברים הערכים ממקטע אחד לשני
// לא הצלחתי לסדר אז בנתיים זה כך
// יש גם את הקוד של טופס ללא מקטעים למטה

//כל השדות שבהערה זה שדות שהם לא מסוג טקסט ואז זה עושה בעיה
const schema = z.object({
    name: z.string().nonempty("Name is required"),
    phone: z.string().nonempty("Phone is required"),
    email: z.string().email("Invalid email").nonempty("Email is required"),
    idNumber: z.string().nonempty("ID Number is required"), // לא אופציונלי
    businessName: z.string().nonempty("Business Name is required"), // לא אופציונלי
    businessType: z.string().nonempty("Business Type is required"), // לא אופציונלי
    // workspaceType: z.nativeEnum(WorkspaceType).refine(val => !!val, { message: "Workspace type is required" }),
    // workspaceCount: z.number().positive("Workspace count must be a positive number"), // חובה
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
    // contractDocuments: z.array(z.any()).optional(),

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

    const [currentStep, setCurrentStep] = useState<number>(0);
    const [formData, setFormData] = useState<Partial<FormData>>({}); // State לשמירת נתוני הטופס

    // const { register, formState: { errors }, reset, watch } = useForm<FormData>({
    //     resolver: zodResolver(schema),
    // });


    //השדות שבהערה זה השדות שהם לא מסוג טקסט וזה עושה בעיה
    const steps = [
        {
            title: "פרופיל",
            content: (
                <>
                    <InputField name="name" label="שם" required defaultValue={lead.name} />
                    <InputField name="phone" label="טלפון" required defaultValue={lead.phone} />
                    <InputField name="email" label="אימייל" required defaultValue={lead.email} />
                    <InputField name="idNumber" label="תעודת זהות" required defaultValue={lead.id} />
                    <InputField name="businessName" label="שם העסק" required />
                    <InputField name="businessType" label="תחום עיסוק" required defaultValue={lead.businessType} />
                </>
            )
        },
        {
            title: "העדפות",
            content: (
                <>
                    {/* צריך ליצור אינפוט מסוג סלקט במשותף!!! */}
                    {/* <select name="workspaceType" required>
                    <option value="">בחר סוג חלל עבודה</option>
                    {Object.values(WorkspaceType).map(type => (
                        <option key={type} value={type}>{type}</option>
                    ))}
                </select> */}
                    {/* <InputField name="workspaceType" label="סוג חלל עבודה" required /> */}
                    {/* <InputField name="workspaceCount" label="כמות עמדות/חדרים" required type="number" /> */}
                    <InputField name="notes" label="הערות" />
                    <InputField name="invoiceName" label="שם לחשבונית" />
                </>
            )
        },
        {
            title: "פרטי חוזה",
            content: (
                <>
                    <InputField name="contractSignDate" label="תאריך חתימת חוזה" required type="date" />
                    <InputField name="contractStartDate" label="תאריך תחילת חוזה" required type="date" />
                    <InputField name="billingStartDate" label="תאריך תחילת חיוב" required type="date" />
                    <InputField name="paymentMethod.creditCardLast4" label="4 ספרות אחרונות של כרטיס אשראי" />
                    <InputField name="paymentMethod.creditCardExpiry" label="תוקף כרטיס אשראי" />
                    <InputField name="paymentMethod.creditCardHolderIdNumber" label="תעודת זהות בעל הכרטיס" />
                    <InputField name="paymentMethod.creditCardHolderPhone" label="טלפון בעל הכרטיס" />
                    {/* <InputField name="contractDocuments" label="מסמכי חוזה" type="file" multiple /> */}
                </>
            )
        }
    ];


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


    const nextStep = () => {
        // const currentValues = getCurrentValues(); // קבלת הערכים הנוכחיים
        // setFormData((prev) => ({ ...prev, ...currentValues })); // שמירת הערכים הנוכחיים

        // אפס את השדות עם הערכים הנוכחיים
        // reset();
        setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    };

    const prevStep = () => {
        // טען את הערכים הקודמים לשדות
        // reset(formData);
        setCurrentStep((prev) => Math.max(prev - 1, 0));
    };


    const handleSubmit = (data: z.infer<typeof schema>) => {
        // יש בעיה עם כל השדות שהם לא מסוג טקסט: הקבצים, סוג חלל עבודה,וכמות חללי עבודה
        // כל עוד זה לא מסודר הפונקציה הזו לא נקראת
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

        //ברגע שלא יהיו שדות בהערה זה יתאים לדאטה
        // const customerRequest: CreateCustomerRequest = data;
        // console.log(customerRequest);

        //לשלוח לשרת את הנתונים

        setShowForm(false);
    }


    return <div className='interestedCustomerRegistration'>
        {/* כל עוד הטופס לא תקין רואים אותו ולאחר שליחה רואים את הדיב שבסוף */}
        {showForm ?
            <div>
                <h1 className="text-3xl font-bold text-center text-blue-600 my-4">רישום מתעניין ללקוח</h1>
                <h4 className="text-lg text-center text-gray-600 my-2">מלא את הפרטים החסרים</h4>
                <Form
                    label={steps[currentStep].title}
                    schema={schema}
                    onSubmit={handleSubmit}
                    className="mx-auto mt-10"
                >
                    {steps[currentStep].content}
                    <div>
                        {currentStep > 0 && <Button onClick={prevStep} variant="primary" size="sm" >הקודם</Button>}
                        {currentStep < steps.length - 1 && <Button onClick={nextStep} variant="primary" size="sm" >הבא</Button>}
                        {currentStep === steps.length - 1 && <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" type="submit">שלח</button>}
                    </div>
                </Form>
                {/* זה עבור טופס בלי מקטעים */}
                {/* <Form
                    // label={}
                    schema={schema}
                    onSubmit={handleSubmit}
                    className="mx-auto mt-10"
                >
                    <h4 className="text-lg font-semibold text-gray-800 my-4">פרופיל</h4>
                    <InputField name="name" label="Name" required defaultValue={lead.name} />
                    <InputField name="phone" label="Phone" required defaultValue={lead.phone} />
                    <InputField name="email" label="Email" required defaultValue={lead.email} />
                    <InputField name="idNumber" label="ID Number" required defaultValue={lead.id} />
                    <InputField name="businessName" label="Business Name" required />
                    <InputField name="businessType" label="Business Type" required defaultValue={lead.businessType} />
                    <br />
                    <h4 className="text-lg font-semibold text-gray-800 my-4">העדפות</h4>
                    <InputField name="workspaceType" label="Workspace Type" required />
                    כדאי ליצור אינפוט סלקט במשותף!!!
                    <select name="workspaceType" required>
                        <option value="">בחר סוג חלל עבודה</option>
                        {Object.values(WorkspaceType).map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                    <InputField name="workspaceCount" label="Workspace Count" required type="number"/>
                    <InputField name="notes" label="Notes" />
                    <InputField name="invoiceName" label="Invoice Name" />
                    <br />
                    <h4 className="text-lg font-semibold text-gray-800 my-4">פרטי חוזה</h4>
                    <InputField name="contractSignDate" label="Contract Sign Date" required type="date" />
                    <InputField name="contractStartDate" label="Contract Start Date" required type="date" />
                    <InputField name="billingStartDate" label="Billing Start Date" required type="date" />
                    <InputField name="paymentMethod.creditCardLast4" label="Credit Card Last 4" />
                    <InputField name="paymentMethod.creditCardExpiry" label="Credit Card Expiry" />
                    <InputField name="paymentMethod.creditCardHolderIdNumber" label="Credit Card Holder ID Number" />
                    <InputField name="paymentMethod.creditCardHolderPhone" label="Credit Card Holder Phone" />
                    <InputField name="contractDocuments" label="Contract Documents" type="file" multiple />
                    <Button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                        Send
                    </Button>
                </Form> */}
            </div>
            :
            <div className="text-center my-4">
                <h2 className="text-2xl font-semibold text-gray-700 mb-2">הלקוח נרשם בהצלחה!</h2>
                <Button onClick={() => navigate(`/leadAndCustomer/customers/${lead.id}`)} variant="primary" size="sm">למעבר ללקוח שנוסף</Button>
            </div>}
    </div>


}
