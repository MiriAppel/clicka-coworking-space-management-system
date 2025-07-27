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

export const InterestedCustomerRegistration: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const lead: Lead | undefined = location.state?.data;

  const { createCustomer } = useCustomerStore();
  const { handleUpdateLead } = useLeadsStore();

  const onSubmit = async (data: any) => {
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
      contractDocuments: data.contractDocuments,
      requireEmailVerification: data.requireEmailVerification || false,
    };

    console.log(customerRequest);

    try {
      await createCustomer(customerRequest);

      const successMessage = data.requireEmailVerification 
        ? "להשלמת התהליך יש לאמת את הלקוח במייל"
        : "הלקוח נוסף בהצלחה!";
      
      showAlert("", successMessage, "success");

      await handleUpdateLead(lead!.id!, { status: LeadStatus.CONVERTED });

      const latestError = useLeadsStore.getState().error;
      if (latestError) {
        showAlert(
          "שגיאה בעדכון סטטוס למתעניין",
          latestError || "שגיאה בלתי צפויה",
          "error"
        );
      } else {
        navigate(-1);
      }
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || error.message || "שגיאה בלתי צפויה";
      showAlert("שגיאה ביצירת לקוח", errorMessage, "error");
    }
  };

  return (
    <CustomerRegistrationForm
      defaultValues={lead}
      onSubmit={onSubmit}
      title="רישום מתעניין ללקוח"
      subtitle="מלא את הפרטים החסרים"
    />
  );
};
