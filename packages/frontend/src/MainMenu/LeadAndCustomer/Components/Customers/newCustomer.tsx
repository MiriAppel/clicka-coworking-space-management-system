// דוגמה לעמוד יצירת לקוח חדש
import { CustomerRegistrationForm } from "./customerForm";
import { useCustomerStore } from "../../../../Stores/LeadAndCustomer/customerStore";
import { showAlert } from "../../../../Common/Components/BaseComponents/ShowAlert";
import { useNavigate } from "react-router-dom";
import { CreateCustomerRequest, PaymentMethodType } from "shared-types";

export const NewCustomerPage: React.FC = () => {
    const navigate = useNavigate();
    const { createCustomer, loading } = useCustomerStore();

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
            currentWorkspaceType: data.currentWorkspaceType,
            workspaceCount: data.workspaceCount,
            contractSignDate: data.contractSignDate,
            contractStartDate: data.contractStartDate,
            billingStartDate: data.billingStartDate,
            notes: data.notes,
            invoiceName: data.invoiceName,
            paymentMethodType: data.paymentMethodType,
            paymentMethod: data.paymentMethodType === PaymentMethodType.CREDIT_CARD ? {
                creditCardNumber: data.creditCardNumber,
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
        <div className="relative">
            <CustomerRegistrationForm
                defaultValues={{}} // אין ערכי ברירת מחדל
                onSubmit={onSubmit}
                title="יצירת לקוח חדש"
                subtitle="מלא את כל הפרטים"
            />
            {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
                </div>
            )}
        </div>
    );
};