import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import { WorkspaceType, Customer, CustomerStatus, UpdateCustomerRequest, CustomerPaymentMethod } from "shared-types";
import { showAlert } from "../../../../Common/Components/BaseComponents/ShowAlert";
import { useCustomerStore } from "../../../../Stores/LeadAndCustomer/customerStore";
import { CustomerRegistrationForm } from "./customerForm";
import { log } from "console";



export const UpdateCustomer: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { updateCustomer, getCustomerPaymentMethods } = useCustomerStore();

    const [paymentMethods, setPaymentMethods] = useState<CustomerPaymentMethod[]>([]);

    // קבלת ערכי הלקוח מהעמוד הקודם
    const customer: Customer = location.state?.data;

    useEffect(() => {
        if (customer?.id) {
            getCustomerPaymentMethods(customer.id).then(setPaymentMethods);
        }
    }, [customer?.id, getCustomerPaymentMethods]);

    if (paymentMethods === null) {
    // לא מציגים כלום עד שהמידע מוכן
    return null;
}

    const firstPayment = paymentMethods[0] || {};

    const defaultValues = {
        ...customer,
        workspaceType: customer.currentWorkspaceType,
        creditCardLast4: firstPayment.creditCardLast4 || "",
        creditCardExpiry: firstPayment.creditCardExpiry || "",
        creditCardHolderIdNumber: firstPayment.creditCardHolderIdNumber || "",
        creditCardHolderPhone: firstPayment.creditCardHolderPhone || ""
    };
    // פונקציית שליחה
    const onSubmit = async (data: any) => {
        const newCustomer: Partial<Customer> = { ...data };
        await updateCustomer(customer.id!, newCustomer);
        const latestError = useCustomerStore.getState().error;
        if (latestError) {
            showAlert("שגיאה בעדכון לקוח", latestError || "שגיאה בלתי צפויה", "error");
        } else {
            showAlert("עדכון", "לקוח עודכן בהצלחה", "success");
            navigate(-1);
        }
    };

    return (
        <CustomerRegistrationForm
            defaultValues={defaultValues}
            onSubmit={onSubmit}
            title="עדכון פרטי לקוח"
            subtitle="ערוך את הפרטים הרצויים"
        />
    );
};


