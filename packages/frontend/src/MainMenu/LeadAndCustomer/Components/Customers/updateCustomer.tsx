import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import { Customer, CustomerPaymentMethod } from "shared-types";
import { showAlert } from "../../../../Common/Components/BaseComponents/ShowAlert";
import { useCustomerStore } from "../../../../Stores/LeadAndCustomer/customerStore";
import { CustomerRegistrationForm } from "./customerForm";


export const UpdateCustomer: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { updateCustomer } = useCustomerStore();

    // קבלת ערכי הלקוח מהעמוד הקודם
    const customer: Customer = location.state?.data;

    const firstPayment = customer.paymentMethods![0] || {};

    const defaultValues = {
        ...customer,
        creditCardLast4: firstPayment.creditCardLast4 || "",
        creditCardExpiry: firstPayment.creditCardExpiry || "",
        creditCardHolderIdNumber: firstPayment.creditCardHolderIdNumber || customer.idNumber || "",
        creditCardHolderPhone: firstPayment.creditCardHolderPhone || customer.phone || "",
    };
    // פונקציית שליחה
    const onSubmit = async (data: any) => {
        const newCustomer: Partial<Customer> = { ...data };
        console.log("עדכון לקוח עם הנתונים in updatecustomer:", newCustomer);
        
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


