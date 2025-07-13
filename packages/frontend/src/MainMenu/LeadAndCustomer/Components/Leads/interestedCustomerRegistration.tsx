// import React, { useState, useEffect } from "react";
// import { Button } from '../../../../Common/Components/BaseComponents/Button';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { CreateCustomerRequest, WorkspaceType, Lead, PaymentMethodType, LeadStatus } from "shared-types";
// import { Form } from '../../../../Common/Components/BaseComponents/Form';
// import { InputField } from "../../../../Common/Components/BaseComponents/Input";
// import { FileInputField } from "../../../../Common/Components/BaseComponents/FileInputFile";
// import { SelectField } from '../../../../Common/Components/BaseComponents/Select'; // מייבאים את הקומפוננטה
// import { z } from "zod";
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { NumberInputField } from "../../../../Common/Components/BaseComponents/InputNumber";
// import { showAlert } from "../../../../Common/Components/BaseComponents/ShowAlert";
// import { useCustomerStore } from "../../../../Stores/LeadAndCustomer/customerStore";
// import { useLeadsStore } from "../../../../Stores/LeadAndCustomer/leadsStore";

// //האם להכניס עוד שדות שקשורים לחוזה????

// //בשביל שבתצוגה זה יהיה בעברית
// const workspaceTypeOptions = [
//     { value: WorkspaceType.PRIVATE_ROOM, label: 'חדר פרטי' },
//     { value: WorkspaceType.DESK_IN_ROOM, label: 'שולחן בחדר' },
//     { value: WorkspaceType.OPEN_SPACE, label: 'אופן ספייס' },
//     { value: WorkspaceType.KLIKAH_CARD, label: 'כרטיס קליקה' },
// ];

// const PaymentMethodTypeOptions = [
//     { value: PaymentMethodType.CREDIT_CARD, label: 'כרטיס אשראי' },
//     { value: PaymentMethodType.BANK_TRANSFER, label: 'העברה בנקאית' },
//     { value: PaymentMethodType.CHECK, label: 'שיק' },
//     { value: PaymentMethodType.CASH, label: 'מזומן' },
//     { value: PaymentMethodType.OTHER, label: 'אחר' },
// ];

// const schema = z.object({
//     name: z.string().nonempty("חובה למלא שם"),
//     phone: z.string().nonempty("חובה למלא טלפון").refine(val => /^0\d{8,9}$/.test(val), { message: "מספר טלפון לא תקין" }),
//     email: z.string().email("Invalid email").nonempty("חובה למלא אימייל"),
//     idNumber: z.string().nonempty("חובה למלא ת\"ז").refine(val => !val || (/^\d{9}$/.test(val)), { message: "חובה להזין 9 ספרות בדיוק" }), // לא אופציונלי
//     businessName: z.string().nonempty("חובה למלא שם עסק"), // לא אופציונלי
//     businessType: z.string().nonempty("חובה למלא סוג עסק"), // לא אופציונלי
//     workspaceType: z.nativeEnum(WorkspaceType).refine(val => !!val, { message: "חובה למלא סוג חלל עבודה" }),
//     workspaceCount: z.number().positive("כמות חללי עבודה חובה מספר חיובי"), // חובה
//     contractSignDate: z.string().nonempty("חובה למלא תאריך חתימת חוזה"), // חובה
//     contractStartDate: z.string().nonempty("חובה למלא תאריך תחילת חוזה"), // חובה
//     billingStartDate: z.string().nonempty("חובה למלא תאריך תחילת חיוב"), // חובה
//     notes: z.string().optional(), // אופציונלי
//     invoiceName: z.string().optional(), // אופציונלי
//     // paymentMethod: z.object({
//     //    creditCardLast4: z.string().optional().refine(val => val && /^\d{4}$/.test(val), { message: "חובה להזין 4 ספרות בדיוק" }),
//     //     creditCardExpiry: z.string().optional().refine(val => val && /^(0[1-9]|1[0-2])\/\d{2}$/.test(val), { message: "פורמט תוקף לא תקין (MM/YY)" }),
//     //     creditCardHolderIdNumber: z.string().optional().refine(val => val && /^\d{9}$/.test(val), { message: "חובה להזין 9 ספרות בדיוק" }),
//     //     creditCardHolderPhone: z.string().optional().refine(val => val && /^0\d{8,9}$/.test(val), { message: "מספר טלפון לא תקין" }),
//     // }).optional(), // אופציונלי
//     paymentMethodType: z.nativeEnum(PaymentMethodType).refine(val => !!val, { message: "חובה" }),
//     creditCardLast4: z.string().optional(),
//     creditCardExpiry: z.string().optional(),
//     creditCardHolderIdNumber: z.string().optional(),
//     creditCardHolderPhone: z.string().optional(),
//     contractDocuments: z.array(z.any()).optional(),
//     ProfilePicture: z.any().optional(),
// }).superRefine((data, ctx) => {
//     if (data.paymentMethodType === PaymentMethodType.CREDIT_CARD) {
//         if (!data.creditCardLast4 || !/^\d{4}$/.test(data.creditCardLast4)) {
//             ctx.addIssue({
//                 code: z.ZodIssueCode.custom,
//                 path: ['creditCardLast4'],
//                 message: "חובה להזין 4 ספרות בדיוק",
//             });
//         }
//         if (!data.creditCardExpiry || !/^(0[1-9]|1[0-2])\/\d{2}$/.test(data.creditCardExpiry)) {
//             ctx.addIssue({
//                 code: z.ZodIssueCode.custom,
//                 path: ['creditCardExpiry'],
//                 message: "פורמט תוקף לא תקין (MM/YY)",
//             });
//         }
//         if (!data.creditCardHolderIdNumber || !/^\d{9}$/.test(data.creditCardHolderIdNumber)) {
//             ctx.addIssue({
//                 code: z.ZodIssueCode.custom,
//                 path: ['creditCardHolderIdNumber'],
//                 message: "חובה להזין 9 ספרות בדיוק",
//             });
//         }
//         if (!data.creditCardHolderPhone || !/^0\d{8,9}$/.test(data.creditCardHolderPhone)) {
//             ctx.addIssue({
//                 code: z.ZodIssueCode.custom,
//                 path: ['creditCardHolderPhone'],
//                 message: "מספר טלפון לא תקין",
//             });
//         }
//     }
// });
// // type FormData = z.infer<typeof schema>;

// export const InterestedCustomerRegistration: React.FC = () => {
//     const navigate = useNavigate();
//     const location = useLocation();

//     // המידע שאני מקבלת מהדף הקודם - או לעשות קריאת שרת שמקבלת מתעניין בודד לפי מזהה
//     const lead: Lead = location.state?.data;
//     lead.idNumber = lead.idNumber != "UNKNOWN" ? lead.idNumber : "";

//     const [currentStep, setCurrentStep] = useState<number>(0);

//     const {
//         createCustomer,
//     } = useCustomerStore();

//     const { handleUpdateLead } = useLeadsStore();

//     const methods = useForm<z.infer<typeof schema>>({
//         resolver: zodResolver(schema),
//         defaultValues: { ...lead, workspaceCount: 1, creditCardHolderPhone: lead.phone, creditCardHolderIdNumber: lead.idNumber, notes: lead.notes || "" }
//     });

//     //אם רואים שלא מתעדכן הערכים עבור מתעניין חדש יש לשים את זה
//     // useEffect(() => {
//     //     methods.reset({
//     //         name: lead?.name || "",
//     //         phone: lead?.phone || "",
//     //         email: lead?.email || "",
//     //         idNumber: lead?.id || "",
//     //         businessName: "",
//     //         businessType: lead?.businessType || "",
//     //         workspaceType: undefined,
//     //         // workspaceCount: 1
//     //         notes: "", // גם אם אופציונלי, תני ערך ריק
//     //         invoiceName: "",
//     //         contractSignDate: "",
//     //         contractStartDate: "",
//     //         billingStartDate: "",
//     //         paymentMethod: {
//     //             creditCardLast4: "",
//     //             creditCardExpiry: "",
//     //             creditCardHolderIdNumber: "",
//     //             creditCardHolderPhone: "",
//     //         },
//     //         contractDocuments: []
//     //     });
//     // }, [lead, methods]);


//     const stepFieldNames = [
//         ["name", "phone", "email", "idNumber", "businessName", "businessType", "notes", "ProfilePicture"] as const,
//         ["workspaceType", "workspaceCount", "contractSignDate", "contractStartDate", "billingStartDate", "contractDocuments"] as const,
//         ["paymentMethodType", "invoiceName", "creditCardLast4", "creditCardExpiry", "creditCardHolderIdNumber", "creditCardHolderPhone"] as const,

//     ];
//     const paymentMethodType = methods.watch("paymentMethodType");


//     const steps = [
//         {
//             title: "פרופיל",
//             content: (
//                 <>
//                     <InputField name="name" label="שם" required />
//                     <FileInputField name="ProfilePicture" label="תמונת פרופיל" />
//                     <InputField name="phone" label="טלפון" required />
//                     <InputField name="email" label="אימייל" required />
//                     <InputField name="idNumber" label="תעודת זהות" required />
//                     <InputField name="notes" label="הערות" />
//                     <InputField name="businessName" label="שם העסק" required />
//                     <InputField name="businessType" label="סוג העסק" required />
//                 </>
//             )
//         },

//         {
//             title: "פרטי חוזה",
//             content: (
//                 <>
//                     <SelectField
//                         name="workspaceType"
//                         label="בחר סוג חלל עבודה"
//                         options={workspaceTypeOptions}
//                         required
//                     />
//                     <NumberInputField
//                         name="workspaceCount"
//                         label="כמות חללי עבודה"
//                         required
//                         // placeholder="הכנס כמות"
//                         min={1}
//                         // step={1}
//                         dir="rtl"
//                     />
//                     <InputField name="contractSignDate" label="תאריך חתימת חוזה" required type="date" />
//                     <InputField name="contractStartDate" label="תאריך תחילת חוזה" required type="date" />
//                     <InputField name="billingStartDate" label="תאריך תחילת חיוב" required type="date" />
//                     <FileInputField name="contractDocuments" label="מסמכי חוזה" multiple />
//                 </>
//             )
//         },
//         {
//             title: "פרטי תשלום",
//             content: (
//                 <>
//                     <SelectField
//                         name="paymentMethodType"
//                         label="בחר צורת תשלום"
//                         options={PaymentMethodTypeOptions}
//                         required
//                     />
//                     <InputField name="invoiceName" label="שם לחשבונית" />
//                     <div className="col-span-2 mt-4 mb-2">
//                         <h3 className="text-lg font-semibold text-gray-700 pb-1">פרטי אשראי</h3>
//                     </div>
//                     <InputField name="creditCardLast4" label="4 ספרות אחרונות של כרטיס אשראי" required={paymentMethodType === PaymentMethodType.CREDIT_CARD} />
//                     <InputField name="creditCardExpiry" label="תוקף כרטיס אשראי" required={paymentMethodType === PaymentMethodType.CREDIT_CARD} />
//                     <InputField name="creditCardHolderIdNumber" label="תעודת זהות בעל הכרטיס" required={paymentMethodType === PaymentMethodType.CREDIT_CARD} />
//                     <InputField name="creditCardHolderPhone" label="טלפון בעל הכרטיס" required={paymentMethodType === PaymentMethodType.CREDIT_CARD} />

//                 </>
//             )
//         },
//     ];

//     const [validSteps, setValidSteps] = useState<boolean[]>(steps.map(() => false));

//     //לבדוק דחוף למה לא מבטל שגיאות כמו לפני זה!!
//     const goToStep = async (index: number) => {
//         // המרה לטיפוס הנכון
//         const fields = stepFieldNames[currentStep] as readonly (keyof z.infer<typeof schema>)[];
//         let valid = await methods.trigger(fields);

//         if (valid) {
//             setValidSteps((prev) => {
//                 const updatedSteps = [...prev];
//                 updatedSteps[currentStep] = true;
//                 return updatedSteps;
//             });
//             setCurrentStep(index);
//         } else {
//             setValidSteps((prev) => {
//                 const updatedSteps = [...prev];
//                 updatedSteps[currentStep] = false;
//                 return updatedSteps;
//             });
//             if (index < currentStep)
//                 setCurrentStep(index);
//         }
//     };

//     useEffect(() => {
//         stepFieldNames[currentStep].forEach((field) => {
//             methods.clearErrors(field as any);
//         });
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [currentStep]);


//     const onSubmit = async (data: z.infer<typeof schema>) => {

//         //איך לשמור את התמונת פרופיל ואיפה ואם לא הכניסו אז לשים ברירת מחדל

//         //צריך להמיר את הטפסים שהתקבלו ל
//         // export interface FileReference {
//         //     id: ID;
//         //     name: string;
//         //     path: string;
//         //     mimeType: string;
//         //     size: number;
//         //     url: string;
//         //     googleDriveId?: string;
//         //     createdAt: DateISO;
//         //     updatedAt: DateISO;
//         // }

//         JSON.stringify(data, null, 2);
//         const customerRequest: CreateCustomerRequest = {
//             name: data.name,
//             phone: data.phone,
//             email: data.email,
//             idNumber: data.idNumber,
//             businessName: data.businessName,
//             businessType: data.businessType,
//             workspaceType: data.workspaceType,
//             workspaceCount: data.workspaceCount,
//             contractSignDate: data.contractSignDate,
//             contractStartDate: data.contractStartDate,
//             billingStartDate: data.billingStartDate,
//             notes: data.notes,
//             invoiceName: data.invoiceName,
//             paymentMethodType: data.paymentMethodType,
//             paymentMethod: data.paymentMethodType === PaymentMethodType.CREDIT_CARD ? {
//                 creditCardLast4: data.creditCardLast4,
//                 creditCardExpiry: data.creditCardExpiry,
//                 creditCardHolderIdNumber: data.creditCardHolderIdNumber,
//                 creditCardHolderPhone: data.creditCardHolderPhone,
//             } : undefined,
//             contractDocuments: data.contractDocuments // אם יש שדה כזה
//         };

//         console.log(customerRequest);

//         await createCustomer(customerRequest);

//         const latestError = useCustomerStore.getState().error;
//         if (latestError) {
//             showAlert("שגיאה ביצירת לקוח", latestError || "שגיאה בלתי צפויה", "error");
//         } else {
//             await handleUpdateLead(lead.id!, { status: LeadStatus.CONVERTED })
//             const latestError = useLeadsStore.getState().error;
//             if (latestError) {
//                 showAlert("שגיאה בעדכון סטטוס למתעניין", latestError || "שגיאה בלתי צפויה", "error");
//             }
//             else {
//                 showAlert("", "המתעניין נוסף ללקוחות בהצלחה", "success");
//                 navigate(-1);
//             }
//         }

//     }


//     return <div className='interestedCustomerRegistration mx-auto max-w-4xl'>
//         <h1 className="text-3xl font-bold text-center text-blue-600 my-4">רישום מתעניין ללקוח</h1>
//         <h4 className="text-lg text-center text-gray-600 my-2">מלא את הפרטים החסרים</h4>

//         <Form
//             // label={steps[currentStep].title}
//             schema={schema}
//             onSubmit={onSubmit}
//             methods={methods}
//             className="mx-auto w-full"
//         >
//             {/* כפתורים למעלה של המקטעים, אי אפשר לעבור אם המקטע לא תקין, אם המקטע תקין יש לו עיצוב אחר */}
//             <div
//                 key={currentStep}
//                 className="grid grid-cols-1 sm:grid-cols-2 gap-4 col-span-2"
//             >
//                 <div className="flex justify-between w-full my-4 col-span-2 mb-10">
//                     {steps.map((step, index) => (
//                         <button
//                             key={index}
//                             className={
//                                 `flex-1 text-center py-2 mx-1 rounded-md transition-all duration-200
//                 ${currentStep === index
//                                     ? "bg-blue-600 text-white shadow-lg scale-105"
//                                     : validSteps[index]
//                                         ? "bg-gradient-to-r from-green-400 to-green-600 text-white border-2 border-green-500 shadow"
//                                         : "bg-gray-200 text-gray-600 border border-gray-300"
//                                 }`
//                             }
//                             onClick={() => goToStep(index)}
//                         >
//                             <span className="flex items-center justify-center gap-2">
//                                 {step.title}
//                                 {validSteps[index] && (
//                                     <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-white border border-green-500 ml-1">
//                                         <svg className="w-3 h-3 text-green-500" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
//                                             <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
//                                         </svg>
//                                     </span>
//                                 )}
//                             </span>
//                         </button>
//                     ))}
//                 </div>
//                 {steps[currentStep].content}

//                 <div className="col-span-2 flex justify-between">
//                     {/* צד ימין: כפתור הקודם או ריק */}
//                     {currentStep > 0 ? (
//                         <Button onClick={() => goToStep(Math.max(currentStep - 1, 0))} variant="primary" size="sm">
//                             הקודם
//                         </Button>
//                     ) : (
//                         <span /> // אלמנט ריק כדי לדחוף את הבא לשמאל
//                     )}

//                     {/* צד שמאל: הבא או שלח */}
//                     {currentStep < steps.length - 1 ? (
//                         <Button onClick={() => goToStep(Math.min(currentStep + 1, steps.length - 1))} variant="primary" size="sm">
//                             הבא
//                         </Button>
//                     ) : (
//                         <Button
//                             variant="primary"
//                             size="sm"
//                             type="submit"
//                         >
//                             שלח
//                         </Button>
//                     )}
//                 </div>
//             </div>
//         </Form>
//     </div>


// }

import { CustomerRegistrationForm } from "../Customers/customerForm";
import { useCustomerStore } from "../../../../Stores/LeadAndCustomer/customerStore";
import { useLeadsStore } from "../../../../Stores/LeadAndCustomer/leadsStore";
import { useLocation, useNavigate } from "react-router-dom";
import { CreateCustomerRequest, Lead, LeadStatus, PaymentMethodType } from "shared-types";
import { showAlert } from "../../../../Common/Components/BaseComponents/ShowAlert";

export const InterestedCustomerRegistration: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const lead: Lead | undefined = location.state?.data;

    const { createCustomer } = useCustomerStore();
    const { handleUpdateLead } = useLeadsStore();

    const onSubmit = async (data: any) => {

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

        await createCustomer(customerRequest);

        const latestError = useCustomerStore.getState().error;
        if (latestError) {
            showAlert("שגיאה ביצירת לקוח", latestError || "שגיאה בלתי צפויה", "error");
        } else {
            await handleUpdateLead(lead!.id!, { status: LeadStatus.CONVERTED })
            const latestError = useLeadsStore.getState().error;
            if (latestError) {
                showAlert("שגיאה בעדכון סטטוס למתעניין", latestError || "שגיאה בלתי צפויה", "error");
            }
            else {
                showAlert("", "המתעניין נוסף ללקוחות בהצלחה", "success");
                navigate(-1);
            }
        }

    }


    return (
        <CustomerRegistrationForm
            defaultValues={lead}
            onSubmit={onSubmit}
            title="רישום מתעניין ללקוח"
            subtitle="מלא את הפרטים החסרים"
        />
    );
};
