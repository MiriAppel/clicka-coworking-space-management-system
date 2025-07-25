import { CustomerRegistrationForm } from "../Customers/customerForm";
import { useCustomerStore } from "../../../../Stores/LeadAndCustomer/customerStore";
import { useLeadsStore } from "../../../../Stores/LeadAndCustomer/leadsStore";
import { useLocation, useNavigate } from "react-router-dom";
import {
  CreateCustomerRequest,
  Lead,
  LeadStatus,
  PaymentMethodType,
} from "shared-types";
import { showAlert } from "../../../../Common/Components/BaseComponents/ShowAlert";
import { ShowAlertWarn } from "../../../../Common/Components/BaseComponents/showAlertWarn";

export const InterestedCustomerRegistration: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const lead: Lead | undefined = location.state?.data;

  const { createCustomer, loading } = useCustomerStore();
  const { handleUpdateLead, loading: loadingLead } = useLeadsStore();

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
      paymentMethod:
        data.paymentMethodType === PaymentMethodType.CREDIT_CARD
          ? {
            creditCardNumber: data.creditCardNumber,
            creditCardExpiry: data.creditCardExpiry,
            creditCardHolderIdNumber: data.creditCardHolderIdNumber,
            creditCardHolderPhone: data.creditCardHolderPhone,
          }
          : undefined,
      contractDocuments: data.contractDocuments, // אם יש שדה כזה
    };

    console.log(customerRequest);


    try {
      await createCustomer(customerRequest);
      let latestError = useCustomerStore.getState().error;
      if (latestError) {
        showAlert("שגיאה ביצירת לקוח", latestError, "error");
        return;
      }
      showAlert("הלקוח נוסף בהצלחה", "להשלמת התהליך יש לאמת את הלקוח במייל", "success");
      await handleUpdateLead(lead!.id!, { status: LeadStatus.CONVERTED });
      latestError = useLeadsStore.getState().error;
      if (latestError) {
        showAlert(
          "שגיאה בעדכון סטטוס למתעניין",
          latestError || "שגיאה בלתי צפויה",
          "error"
        );

      }
      await new Promise(resolve => setTimeout(resolve, 3000));
      const confirmed = await ShowAlertWarn(`האם ברוצנך לבחור חלל עכשיו?`, "תוכל לבחור חלל מאוחר יותר דרך הקצאות במפת החללים", "question");
      if (confirmed) {
        navigate('/assignmentForm', {
          state: {
            customerId: data.idNumber,
            customerName: data.name,
            workspaceType: data.currentWorkspaceType,
          }
        });
      }
      else {
        navigate(-1);
      }
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || error.message || "שגיאה בלתי צפויה";
      showAlert("שגיאה ביצירת לקוח", errorMessage, "error");
    }

  };


  return (
    <div className="relative">
      <CustomerRegistrationForm
        defaultValues={{ ...lead, currentWorkspaceType: lead?.interestedIn }}
        onSubmit={onSubmit}
        title="רישום מתעניין ללקוח"
        subtitle="מלא את הפרטים החסרים"
      />
      {(loading) && (
        // {(loading || loadingLead) && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
        </div>
      )}
    </div>
  );
};
