import React, { useState, useEffect } from "react";
import { Button } from '../../../../Common/Components/BaseComponents/Button';
import { useLocation, useNavigate } from 'react-router-dom';
import { CreateCustomerRequest, WorkspaceType, Lead, PaymentMethodType, LeadStatus } from "shared-types";
import { Form } from '../../../../Common/Components/BaseComponents/Form';
import { InputField } from "../../../../Common/Components/BaseComponents/Input";
import { FileInputField } from "../../../../Common/Components/BaseComponents/FileInputFile";
import { SelectField } from '../../../../Common/Components/BaseComponents/Select'; // מייבאים את הקומפוננטה
import { z } from "zod";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { NumberInputField } from "../../../../Common/Components/BaseComponents/InputNumber";
import { createCustomer, updateLead } from "../../Service/LeadAndCustomersService"
import { showAlert } from "../../../../Common/Components/BaseComponents/ShowAlert";
import axios from 'axios';

//האם להכניס עוד שדות שקשורים לחוזה????

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
    workspaceCount: z.number().positive("כמות חללי עבודה חובה מספר חיובי"), // חובה
    contractSignDate: z.string().nonempty("חובה למלא תאריך חתימת חוזה"), // חובה
    contractStartDate: z.string().nonempty("חובה למלא תאריך תחילת חוזה"), // חובה
    billingStartDate: z.string().nonempty("חובה למלא תאריך תחילת חיוב"), // חובה
    notes: z.string().optional(), // אופציונלי
    invoiceName: z.string().optional(), // אופציונלי
    // paymentMethod: z.object({
   creditCardLast4: z.string().optional().refine(val => val && /^\d{4}$/.test(val), { message: "חובה להזין 4 ספרות בדיוק" }),
    creditCardExpiry: z.string().optional().refine(val => val && /^(0[1-9]|1[0-2])\/\d{2}$/.test(val), { message: "פורמט תוקף לא תקין (MM/YY)" }),
    creditCardHolderIdNumber: z.string().optional().refine(val => val && /^\d{9}$/.test(val), { message: "חובה להזין 9 ספרות בדיוק" }),
    creditCardHolderPhone: z.string().optional().refine(val => val && /^0\d{8,9}$/.test(val), { message: "מספר טלפון לא תקין" }),
    // }).optional(), // אופציונלי
    paymentMethodType: z.nativeEnum(PaymentMethodType).refine(val => !!val, { message: "חובה" }),
    // creditCardLast4: z.string().optional(),
    // creditCardExpiry: z.string().optional(),
    // creditCardHolderIdNumber: z.string().optional(),
    // creditCardHolderPhone: z.string().optional(),
    contractDocuments: z.array(z.any()).optional(),
    ProfilePicture: z.any().optional(),
})
// type FormData = z.infer<typeof schema>;

export const InterestedCustomerRegistration: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // המידע שאני מקבלת מהדף הקודם - או לעשות קריאת שרת שמקבלת מתעניין בודד לפי מזהה
    const lead: Lead = location.state?.data;
    lead.idNumber = lead.idNumber != "UNKNOWN" ? lead.idNumber : "";

    const [currentStep, setCurrentStep] = useState<number>(0);

    const methods = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: { ...lead, workspaceCount: 1, creditCardHolderPhone: lead.phone, creditCardHolderIdNumber: lead.idNumber, notes: lead.notes || "" }
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
        ["name", "phone", "email", "idNumber", "businessName", "businessType", "notes", "ProfilePicture"] as const,
        ["paymentMethodType", "invoiceName", "creditCardLast4", "creditCardExpiry", "creditCardHolderIdNumber", "creditCardHolderPhone"] as const,
        ["workspaceType", "workspaceCount", "contractSignDate", "contractStartDate", "billingStartDate", "contractDocuments"] as const
    ];


    const steps = [
        {
            title: "פרופיל",
            content: (
                <>
                    <InputField name="name" label="שם" required />
                    <FileInputField name="ProfilePicture" label="תמונת פרופיל" />
                    <InputField name="phone" label="טלפון" required />
                    <InputField name="email" label="אימייל" required />
                    <InputField name="idNumber" label="תעודת זהות" required />
                    <InputField name="notes" label="הערות" />
                    <InputField name="businessName" label="שם העסק" required />
                    <InputField name="businessType" label="סוג העסק" required />
                </>
            )
        },
        {
            title: "פרטי תשלום",
            content: (
                <>
                    <SelectField
                        name="paymentMethodType"
                        label="בחר צורת תשלום"
                        options={PaymentMethodTypeOptions}
                        required
                    />
                    <InputField name="invoiceName" label="שם לחשבונית" />
                    <div className="col-span-2 mt-4 mb-2">
                        <h3 className="text-lg font-semibold text-gray-700 pb-1">פרטי אשראי</h3>
                    </div>
                    <InputField name="creditCardLast4" label="4 ספרות אחרונות של כרטיס אשראי" required={methods.getValues("paymentMethodType") === PaymentMethodType.CREDIT_CARD}/>
                    <InputField name="creditCardExpiry" label="תוקף כרטיס אשראי" required={methods.getValues("paymentMethodType") === PaymentMethodType.CREDIT_CARD}/>
                    <InputField name="creditCardHolderIdNumber" label="תעודת זהות בעל הכרטיס" required={methods.getValues("paymentMethodType") === PaymentMethodType.CREDIT_CARD}/>
                    <InputField name="creditCardHolderPhone" label="טלפון בעל הכרטיס" required={methods.getValues("paymentMethodType") === PaymentMethodType.CREDIT_CARD}/>

                </>
            )
        },
        {
            title: "פרטי חוזה",
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
                    <InputField name="contractSignDate" label="תאריך חתימת חוזה" required type="date" />
                    <InputField name="contractStartDate" label="תאריך תחילת חוזה" required type="date" />
                    <InputField name="billingStartDate" label="תאריך תחילת חיוב" required type="date" />
                    <FileInputField name="contractDocuments" label="מסמכי חוזה" multiple />
                </>
            )
        }
    ];

    const [validSteps, setValidSteps] = useState<boolean[]>(steps.map(() => false));

    //לבדוק דחוף למה לא מבטל שגיאות כמו לפני זה!!
    const goToStep = async (index: number) => {

        const valid = await methods.trigger(stepFieldNames[currentStep]);
        if (valid) {
            setValidSteps((prev) => {
            const updatedSteps = [...prev];
            updatedSteps[currentStep] = true; // עדכון המצב של השלב הנוכחי
            return updatedSteps; // מחזירים את המערך המעודכן
        });
            setCurrentStep((prev) => {
                // const next = Math.min(prev + 1, steps.length - 1);
                const next = index;
                // איפוס שגיאות במקטע הבא (שלא יופיעו שגיאות מיד)
                stepFieldNames[next].forEach((field) => {
                    methods.clearErrors(field as any);
                });
                return next;
            });

        }
        else {
            setValidSteps((prev) => {
            const updatedSteps = [...prev];
            updatedSteps[currentStep] = false; // עדכון המצב של השלב הנוכחי
            return updatedSteps; // מחזירים את המערך המעודכן
        });
            if (index < currentStep)
                setCurrentStep(index);
        }

        // אחרת, השגיאות יוצגו אוטומטית בשדות הלא תקינים
    };

    const onSubmit = async (data: z.infer<typeof schema>) => {

        //איך לשמור את התמונת פרופיל ואיפה ואם לא הכניסו אז לשים ברירת מחדל

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
        const customerRequest: CreateCustomerRequest = {
            name: data.name,
            phone: data.phone,
            email: data.email,
            idNumber: data.idNumber,
            businessName: data.businessName,
            businessType: data.businessType,
            workspaceType: data.workspaceType,
            workspaceCount: data.workspaceCount,
            contractSignDate: data.contractSignDate,
            contractStartDate: data.contractStartDate,
            billingStartDate: data.billingStartDate,
            notes: data.notes,
            invoiceName: data.invoiceName,
            paymentMethodType: data.paymentMethodType,
            paymentMethod: data.paymentMethodType === PaymentMethodType.CREDIT_CARD ? {
                creditCardLast4: data.creditCardLast4,
                creditCardExpiry: data.creditCardExpiry,
                creditCardHolderIdNumber: data.creditCardHolderIdNumber,
                creditCardHolderPhone: data.creditCardHolderPhone,
            } : undefined,
            contractDocuments: data.contractDocuments // אם יש שדה כזה
        };

        console.log(customerRequest);

        await createCustomer(customerRequest)
            .then(async () => {

                await updateLead(lead.id!, { status: LeadStatus.CONVERTED })
                    .then(() => {
                        showAlert("", "המתעניין נוסף ללקוחות בהצלחה", "success");
                        navigate(-1);
                    }).catch((error) => {
                        if (axios.isAxiosError(error)) {
                            // אם השגיאה היא של Axios
                            console.error('Axios error:', error.response?.data);
                            // תוכל להציג את השגיאה למשתמש או לוג
                            showAlert("שגיאה בעדכון סטטוס ", `שגיאה מהשרת: ${error.response?.data.error.details || 'שגיאה לא ידועה'}`, "error");
                        } else {
                            // טיפול בשגיאות אחרות
                            console.error('Unexpected error:', error);
                            showAlert("שגיאה בשינוי סטטוס", 'שגיאה בלתי צפויה', "error");
                        }
                    })

            }).catch((error: Error) => {
                if (axios.isAxiosError(error)) {
                    // אם השגיאה היא של Axios
                    console.error('Axios error:', error.response?.data);
                    // תוכל להציג את השגיאה למשתמש או לוג
                    showAlert("שגיאה ביצירת לקוח", `שגיאה מהשרת: ${error.response?.data.error.details || 'שגיאה לא ידועה'}`, "error");
                } else {
                    // טיפול בשגיאות אחרות
                    console.error('Unexpected error:', error);
                    showAlert("שגיאה ביצירת לקוח", 'שגיאה בלתי צפויה', "error");
                }
            });
    }


    return <div className='interestedCustomerRegistration mx-auto max-w-4xl'>
        <h1 className="text-3xl font-bold text-center text-blue-600 my-4">רישום מתעניין ללקוח</h1>
        <h4 className="text-lg text-center text-gray-600 my-2">מלא את הפרטים החסרים</h4>

        <Form
            // label={steps[currentStep].title}
            schema={schema}
            onSubmit={onSubmit}
            methods={methods}
            className="mx-auto w-full"
        >
            <div
                key={currentStep}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4 col-span-2"
            >
                <div className="flex justify-between w-full my-4 col-span-2 mb-10">
                    {steps.map((step, index) => (
                        <button
                            key={index}
                            className={`flex-1 text-center py-2 ${currentStep === index ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"} rounded-md`}
                            onClick={() => goToStep(index)}
                        >
                            {step.title}
                            {validSteps[index] && <span className="text-blue-600"> V </span>}
                        </button>
                    ))}
                </div>
                {steps[currentStep].content}

                <div className="col-span-2 flex justify-between">
                    {/* צד ימין: כפתור הקודם או ריק */}
                    {currentStep > 0 ? (
                        <Button onClick={() => goToStep(Math.max(currentStep - 1, 0))} variant="primary" size="sm">
                            הקודם
                        </Button>
                    ) : (
                        <span /> // אלמנט ריק כדי לדחוף את הבא לשמאל
                    )}

                    {/* צד שמאל: הבא או שלח */}
                    {currentStep < steps.length - 1 ? (
                        <Button onClick={() => goToStep(Math.min(currentStep + 1, steps.length - 1))} variant="primary" size="sm">
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


}
