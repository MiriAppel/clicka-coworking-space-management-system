import React, { useState, useEffect } from "react";
import { Button } from '../../../../Common/Components/BaseComponents/Button';
import { useLocation, useNavigate } from 'react-router-dom';
import { CreateCustomerRequest, WorkspaceType, Lead, PaymentMethodType } from "shared-types";
import { Form } from '../../../../Common/Components/BaseComponents/Form';
import { InputField } from "../../../../Common/Components/BaseComponents/Input";
import { FileInputField } from "../../../../Common/Components/BaseComponents/FileInputFile";
import { SelectField } from '../../../../Common/Components/BaseComponents/Select'; // מייבאים את הקומפוננטה
import { z } from "zod";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { NumberInputField } from "../../../../Common/Components/BaseComponents/InputNumber";
import { createCustomer, deleteLead } from "../../Service/LeadAndCustomersService"

//בשביל שבתצוגה זה יהיה בעברית
const workspaceTypeOptions = [
    { value: WorkspaceType.PRIVATE_ROOM, label: 'חדר פרטי' },
    { value: WorkspaceType.DESK_IN_ROOM, label: 'שולחן בחדר' },
    { value: WorkspaceType.OPEN_SPACE, label: 'אופן ספייס' },
    { value: WorkspaceType.KLIKAH_CARD, label: 'כרטיס קליקה' },
];

const PaymentMethodTypeOptions = [
    { value: PaymentMethodType.CREDIT_CARD, label: 'כרטיס אשראי' },
    { value: PaymentMethodType.BANK_TRANSFER, label: 'העברה בנקאית' },
    { value: PaymentMethodType.CHECK, label: 'שיק' },
    { value: PaymentMethodType.CASH, label: 'מזומן' },
    { value: PaymentMethodType.OTHER, label: 'אחר' },

];

const schema = z.object({
    name: z.string().nonempty("חובה למלא שם"),
    phone: z.string().nonempty("חובה למלא טלפון").refine(val => /^0\d{8,9}$/.test(val), { message: "מספר טלפון לא תקין" }),
    email: z.string().email("Invalid email").nonempty("חובה למלא אימייל"),
    idNumber: z.string().nonempty("חובה למלא ת\"ז").refine(val => !val || (/^\d{9}$/.test(val)), { message: "חובה להזין 9 ספרות בדיוק" }), // לא אופציונלי
    businessName: z.string().nonempty("חובה למלא שם עסק"), // לא אופציונלי
    businessType: z.string().nonempty("חובה למלא סוג עסק"), // לא אופציונלי
    workspaceType: z.nativeEnum(WorkspaceType).refine(val => !!val, { message: "חובה למלא סוג חלל עבודה" }),
    workspaceCount: z.number().positive("כמות חללי עבודה חייב להיות חיובי"), // חובה
    contractSignDate: z.string().nonempty("חובה למלא תאריך חתימת חוזה"), // חובה
    contractStartDate: z.string().nonempty("חובה למלא תאריך תחילת חוזה"), // חובה
    billingStartDate: z.string().nonempty("חובה למלא תאריך תחילת חיוב"), // חובה
    notes: z.string().optional(), // אופציונלי
    invoiceName: z.string().optional(), // אופציונלי
    //לבדוק דחוף מה עם זה!!!!!!!
    // paymentMethod: z.object({
    //     creditCardLast4: z.string().optional().refine(val => !val || (/^\d{4}$/.test(val)), { message: "חובה להזין 4 ספרות בדיוק" }), // אופציונלי
    //     creditCardExpiry: z.string().optional().refine(val => !val || /^(0[1-9]|1[0-2])\/\d{2}$/.test(val), { message: "פורמט תוקף לא תקין (MM/YY)" }), // אופציונלי
    //     creditCardHolderIdNumber: z.string().optional().refine(val => !val || (/^\d{9}$/.test(val)), { message: "חובה להזין 9 ספרות בדיוק" }), // אופציונלי
    //     creditCardHolderPhone: z.string().optional().refine(val => !val || /^0\d{8,9}$/.test(val), { message: "מספר טלפון לא תקין" }), // אופציונלי
    // }).optional(), // אופציונלי
    paymentMethodType: z.nativeEnum(PaymentMethodType).refine(val => !!val, { message: "חובה" }),
    contractDocuments: z.array(z.any()).optional(),

});

// type FormData = z.infer<typeof schema>;

export const InterestedCustomerRegistration: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // המידע שאני מקבלת מהדף הקודם - או לעשות קריאת שרת שמקבלת מתעניין בודד לפי מזהה
    const lead: Lead = location.state?.data;

    const [showForm, setShowForm] = useState<boolean>(true);

    const [currentStep, setCurrentStep] = useState<number>(0);

    const methods = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        // defaultValues: { ...lead, workspaceCount: 1, paymentMethod: { creditCardHolderPhone: lead.phone, creditCardHolderIdNumber: lead.idNumber } }
        defaultValues: { ...lead, workspaceCount: 1 }

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
    //         // workspaceCount: 1
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
        ["workspaceType", "workspaceCount", "notes", "invoiceName"] as const,
        // ["contractSignDate", "contractStartDate", "billingStartDate", "paymentMethod.creditCardLast4", "paymentMethod.creditCardExpiry", "paymentMethod.creditCardHolderIdNumber", "paymentMethod.creditCardHolderPhone", "contractDocuments"] as const
        ["contractSignDate", "contractStartDate", "billingStartDate", "paymentMethodType", "contractDocuments"] as const

    ];

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
                    <NumberInputField
                        name="workspaceCount"
                        label="כמות חללי עבודה"
                        required
                        // placeholder="הכנס כמות"
                        min={1}
                        // step={1}
                        dir="rtl"
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
                    <FileInputField name="contractDocuments" label="מסמכי חוזה" multiple />
                    <SelectField
                        name="paymentMethodType"
                        label="בחר צורת תשלום"
                        options={PaymentMethodTypeOptions}
                        required
                    />
                    {/* <div className="col-span-2 mt-4 mb-2">
                        <h3 className="text-lg font-semibold text-gray-700 pb-1">פרטי אשראי</h3>
                    </div>
                    <InputField name="paymentMethod.creditCardLast4" label="4 ספרות אחרונות של כרטיס אשראי" />
                    <InputField name="paymentMethod.creditCardExpiry" label="תוקף כרטיס אשראי" />
                    <InputField name="paymentMethod.creditCardHolderIdNumber" label="תעודת זהות בעל הכרטיס" />
                    <InputField name="paymentMethod.creditCardHolderPhone" label="טלפון בעל הכרטיס" /> */}
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


    const onSubmit = async (data: z.infer<typeof schema>) => {

        //צריך להמיר את הטפסים שהתקבלו ל
        // export interface FileReference {
        //     id: ID;
        //     name: string;
        //     path: string;
        //     mimeType: string;
        //     size: number;
        //     url: string;
        //     googleDriveId?: string;
        //     createdAt: DateISO;
        //     updatedAt: DateISO;
        // }

        JSON.stringify(data, null, 2);
        const customerRequest: CreateCustomerRequest = data;
        console.log(customerRequest);

        await createCustomer(customerRequest)
            .then(() => {
                setShowForm(false);
                console.log("successfully create customer");

            }).catch((error: Error) => {
                console.error("Error create customer:", error);
            });

        //מחיקת המתעניין
        try {
            await deleteLead(lead.id!);
        } catch (error) {
            console.error("שגיאה במחיקת מתעניין:", error);
            alert("מחיקה נכשלה");
        }

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
                    <div
                        key={currentStep}
                        className="col-span-2"
                    >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {steps[currentStep].content}
                        </div>

                        <div className="col-span-2 flex justify-between">
                            {/* צד ימין: כפתור הקודם או ריק */}
                            {currentStep > 0 ? (
                                <Button onClick={prevStep} variant="primary" size="sm">
                                    הקודם
                                </Button>
                            ) : (
                                <span /> // אלמנט ריק כדי לדחוף את הבא לשמאל
                            )}

                            {/* צד שמאל: הבא או שלח */}
                            {currentStep < steps.length - 1 ? (
                                <Button onClick={nextStep} variant="primary" size="sm">
                                    הבא
                                </Button>
                            ) : (
                                <Button
                                    variant="primary"
                                    size="sm"
                                    type="submit"
                                >
                                    שלח
                                </Button>
                            )}
                        </div>
                    </div>
                </Form>
            </div>
            :
            <div className="text-center my-4">
                <h2 className="text-2xl font-semibold text-gray-700 mb-2">הלקוח נרשם בהצלחה!</h2>
                <Button onClick={() => navigate(`/leadAndCustomer/customers`)} variant="primary" size="sm">למעבר לרשימת הלקוחות</Button>
            </div>}
    </div>


}
