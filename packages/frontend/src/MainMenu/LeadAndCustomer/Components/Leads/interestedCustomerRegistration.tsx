import React, { useState, useEffect } from "react";
import { Button } from '../../../Common/Components/BaseComponents/Button';
import { useLocation, useNavigate } from 'react-router-dom';
import { CreateCustomerRequest, WorkspaceType } from "../../../../types/customer";
import { Form } from '../../../Common/Components/BaseComponents/Form';
import { InputField } from "../../../Common/Components/BaseComponents/Input";
import { FileInputField } from "../../../Common/Components/BaseComponents/FileInputFile";
import { SelectField } from '../../../Common/Components/BaseComponents/Select'; // מייבאים את הקומפוננטה
import { z } from "zod";
import { Lead } from "../../../../types/lead";
import { useForm, SubmitHandler, FieldValues } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

//בשביל שבתצוגה זה יהיה בעברית
const workspaceTypeOptions = [
    { value: WorkspaceType.PRIVATE_ROOM, label: 'חדר פרטי' },
    { value: WorkspaceType.DESK_IN_ROOM, label: 'שולחן בחדר' },
    { value: WorkspaceType.OPEN_SPACE, label: 'אופן ספייס' },
    { value: WorkspaceType.KLIKAH_CARD, label: 'כרטיס קליקה' },
];

const schema = z.object({
    name: z.string().nonempty("חובה למלא שם"),
    phone: z.string().nonempty("חובה למלא טלפון"),
    email: z.string().email("Invalid email").nonempty("חובה למלא אימייל"),
    idNumber: z.string().nonempty("חובה למלא ת\"ז").refine(val => !val || (/^\d{9}$/.test(val)), { message: "חובה להזין 9 ספרות בדיוק" }), // לא אופציונלי
    businessName: z.string().nonempty("חובה למלא שם עסק"), // לא אופציונלי
    businessType: z.string().nonempty("חובה למלא סוג עסק"), // לא אופציונלי
    workspaceType: z.nativeEnum(WorkspaceType).refine(val => !!val, { message: "חובה למלא סוג חלל עבודה" }),
    // workspaceCount: z.number().positive("Workspace count must be a positive number"), // חובה
    contractSignDate: z.string().nonempty("חובה למלא תאריך חתימת חוזה"), // חובה
    contractStartDate: z.string().nonempty("חובה למלא תאריך תחילת חוזה"), // חובה
    billingStartDate: z.string().nonempty("חובה למלא תאריך תחילת חיוב"), // חובה
    notes: z.string().optional(), // אופציונלי
    invoiceName: z.string().optional(), // אופציונלי
    paymentMethod: z.object({
        creditCardLast4: z.string().optional().refine(val => !val || (/^\d{4}$/.test(val)), { message: "חובה להזין 4 ספרות בדיוק" }), // אופציונלי
        creditCardExpiry: z.string().optional(), // אופציונלי
        creditCardHolderIdNumber: z.string().optional().refine(val => !val || (/^\d{9}$/.test(val)), { message: "חובה להזין 9 ספרות בדיוק" }), // אופציונלי
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

    const [currentStep, setCurrentStep] = useState<number>(0);

    // השתמשי ב-useForm פעם אחת לכל הטופס
    const methods = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        //צריך לבדוק מה משמעות הid שמגיע מהמתעניין
        //האם זה מזהה ואז ללקוח יש אחר
        //ואז צריך למלא ב idNumber את התז של הלקוח שעדיין אין לי
        //או שצריך להכניס אוטומטית בidNumber את lead.id
        //ואז גם אפשר להכניס את זה אוטומטית לcreditCardHolderIdNumber 
        defaultValues: { ...lead, workspaceType: undefined }

    });

    //אם רואים שלא מתעדכן הערכים עבור מתעניין חדש יש לשים את זה
    // useEffect(() => {
    //     methods.reset({
    //         name: lead?.name || "",
    //         phone: lead?.phone || "",
    //         email: lead?.email || "",
    //         idNumber: lead?.id || "",
    //         businessName: "",
    //         businessType: lead?.businessType || "",
    //         workspaceType: undefined,
    //         // workspaceCount: ""
    //         notes: "", // גם אם אופציונלי, תני ערך ריק
    //         invoiceName: "",
    //         contractSignDate: "",
    //         contractStartDate: "",
    //         billingStartDate: "",
    //         paymentMethod: {
    //             creditCardLast4: "",
    //             creditCardExpiry: "",
    //             creditCardHolderIdNumber: "",
    //             creditCardHolderPhone: "",
    //         },
    //         contractDocuments: []
    //     });
    // }, [lead, methods]);


    const stepFieldNames = [
        ["name", "phone", "email", "idNumber", "businessName", "businessType"] as const,
        ["workspaceType", "notes", "invoiceName"] as const,
        ["contractSignDate", "contractStartDate", "billingStartDate", "paymentMethod.creditCardLast4", "paymentMethod.creditCardExpiry", "paymentMethod.creditCardHolderIdNumber", "paymentMethod.creditCardHolderPhone", "contractDocuments"] as const
    ];

    //השדות שבהערה זה השדות שהם לא מסוג טקסט וזה עושה בעיה
    const steps = [
        {
            title: "פרופיל",
            content: (
                <>
                    <InputField name="name" label="שם" required />
                    <InputField name="phone" label="טלפון" required />
                    <InputField name="email" label="אימייל" required />
                    <InputField name="idNumber" label="תעודת זהות" required />
                    <InputField name="businessName" label="שם העסק" required />
                    <InputField name="businessType" label="סוג העסק" required />
                </>
            )
        },
        {
            title: "העדפות",
            content: (
                <>
                    <SelectField
                        name="workspaceType"
                        label="בחר סוג חלל עבודה"
                        options={workspaceTypeOptions}
                        required
                    />
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
                    <div>
                        {/* כדי לסדר יפה את השגיאה מתחת לאינפוט - בגלל שזה מקונן */}
                        <InputField name="paymentMethod.creditCardLast4" label="4 ספרות אחרונות של כרטיס אשראי" />
                        {methods.formState.errors?.paymentMethod?.creditCardLast4?.message && (
                            <p className="text-sm text-red-600">
                                {methods.formState.errors.paymentMethod.creditCardLast4.message}
                            </p>
                        )}
                    </div>
                    <InputField name="paymentMethod.creditCardExpiry" label="תוקף כרטיס אשראי" />
                    <div>
                        {/* כנל בגלל שזה מקונן ולא תומך בשגיאות אני שמה אותם לבד */}
                        <InputField name="paymentMethod.creditCardHolderIdNumber" label="תעודת זהות בעל הכרטיס" />
                        {methods.formState.errors?.paymentMethod?.creditCardHolderIdNumber?.message && (
                            <p className="text-sm text-red-600">
                                {methods.formState.errors.paymentMethod.creditCardHolderIdNumber.message}
                            </p>
                        )}
                    </div>
                    <InputField name="paymentMethod.creditCardHolderPhone" label="טלפון בעל הכרטיס" />
                    <FileInputField name="contractDocuments" label="מסמכי חוזה" multiple />
                </>
            )
        }
    ];


    const nextStep = async () => {
        // Validate only fields of the current step
        const valid = await methods.trigger(stepFieldNames[currentStep]);
        if (valid) {
            setCurrentStep((prev) => {
                const next = Math.min(prev + 1, steps.length - 1);
                // איפוס שגיאות במקטע הבא (שלא יופיעו שגיאות מיד)
                stepFieldNames[next].forEach((field) => {
                    methods.clearErrors(field as any);
                });
                return next;
            });
        }
        // אחרת, השגיאות יוצגו אוטומטית בשדות הלא תקינים
    };
    const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));


    const onSubmit = (data: z.infer<typeof schema>) => {
        // data.workspaceType = WorkspaceType.DESK_IN_ROOM;

        alert("The form has been sent successfully:\n" + JSON.stringify(data, null, 2));
        console.log(data);

        //ברגע שלא יהיו שדות בהערה זה יתאים לדאטה
        // const customerRequest: CreateCustomerRequest = data;
        // console.log(customerRequest);

        //לשלוח לשרת את הנתונים
        //לבדוק מה עם החוזה, איך הוא נוצר ומה צריך לעשות בשביל זה
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
                    onSubmit={onSubmit}
                    methods={methods}
                    className="mx-auto mt-10"
                >
                    {/* <div></div>
                    <div></div> */}
                    {/* <div></div> */}
                    <div
                        key={currentStep}
                        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                    >
                        {steps[currentStep].content}


                    </div>
                    <div className="col-span-2 flex justify-between">
                        {currentStep > 0 && (
                            <Button onClick={prevStep} variant="secondary" size="sm">
                                הקודם
                            </Button>
                        )}
                        {currentStep < steps.length - 1 && (
                            <Button onClick={nextStep} variant="secondary" size="sm">
                                הבא
                            </Button>
                        )}
                        {currentStep === steps.length - 1 && (
                            <Button
                                // className="bg-blue-600 text-white px-20 py-1 rounded hover:bg-blue-700"
                                variant="primary"
                                size="sm"
                                type="submit"
                            >
                                שלח
                            </Button>
                        )}
                    </div>
                </Form>
            </div>
            :
            <div className="text-center my-4">
                <h2 className="text-2xl font-semibold text-gray-700 mb-2">הלקוח נרשם בהצלחה!</h2>
                <Button onClick={() => navigate(`/leadAndCustomer/customers/${lead.id}`)} variant="primary" size="sm">למעבר ללקוח שנוסף</Button>
            </div>}
    </div>


}
