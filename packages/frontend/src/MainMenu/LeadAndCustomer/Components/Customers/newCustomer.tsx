// דוגמה לעמוד יצירת לקוח חדש
import { CustomerRegistrationForm } from "./customerForm";
import { useCustomerStore } from "../../../../Stores/LeadAndCustomer/customerStore";
import { showAlert } from "../../../../Common/Components/BaseComponents/ShowAlert";
import { useNavigate } from "react-router-dom";
import { CreateCustomerRequest, PaymentMethodType } from "shared-types";

export const NewCustomerPage: React.FC = () => {
    const navigate = useNavigate();
    const { createCustomer } = useCustomerStore();

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
            showAlert("", "הלקוח נוסף בהצלחה", "success");
            navigate(-1);
        }

    }

    return (
        <CustomerRegistrationForm
            defaultValues={{}} // אין ערכי ברירת מחדל
            onSubmit={onSubmit}
            title="יצירת לקוח חדש"
            subtitle="מלא את כל הפרטים"
        />
    );
};