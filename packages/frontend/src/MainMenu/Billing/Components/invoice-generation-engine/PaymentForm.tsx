import React, { useEffect } from "react";
import axios from "axios";
import { useForm, SubmitHandler } from "react-hook-form";
import { useInvoiceStore } from "../invoice-generation-engine/invoiceStore";
import { usePaymentStore } from "../../../Workspace/Components/invoice-generation-engine/paymentStore";
import { InvoiceStatus, PaymentMethodType } from "shared-types";
import { Form } from "../../../../Common/Components/BaseComponents/Form";
import { SelectField } from "../../../../Common/Components/BaseComponents/Select";
import { NumberInputField } from "../../../../Common/Components/BaseComponents/InputNumber";
import { InputField } from "../../../../Common/Components/BaseComponents/Input";
import { Button } from "../../../../Common/Components/BaseComponents/Button";


interface FormFields {
  amount: number;
  reference?: string;
  invoiceId: string;
  paymentMethod: PaymentMethodType;
}

// קריאה ל-API לשליחת תשלום
async function sendPaymentToApi(payment: any) {
  try {
    const response = await axios.post("http://localhost:3000/payments", payment);
    return response.data;
  } catch (error) {
    console.error("שגיאה בשליחת תשלום לשרת:", error);
    throw error;
  }
}

// קריאה ל-API שיוצר את הקבלה מהתבנית
async function createReceiptFromPayment(payment: any) {
  try {
    const response = await axios.post("/api/documents", {
      templateId: "receipt-default",
      entityId: payment.id,
      variables: {
        customerName: payment.customer_name,
        amount: payment.amount,
        paymentMethod: payment.method,
        paymentDate: payment.date,
        invoiceId: payment.invoice_id,
      },
      language: "hebrew",
      deliveryMethod: "link",
    });
    return response.data.url;
  } catch (error) {
    console.error("שגיאה ביצירת קבלה:", error);
    throw error;
  }
}

export default function PaymentForm() {
  const { invoices, fetchInvoices, updateInvoiceStatus } = useInvoiceStore();
  const { payments, addPayment } = usePaymentStore();

  const methods = useForm<FormFields>({
    mode: "onSubmit",
    defaultValues: {
      amount: 0,
      paymentMethod: PaymentMethodType.CASH,
      invoiceId: "",
      reference: "",
    },
  });

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    const { amount, invoiceId, paymentMethod, reference } = data;
    const invoice = invoices.find((inv) => inv.id === invoiceId);
    if (!invoice) return;

    const paid = payments
      .filter((p) => p.invoice_id === invoiceId)
      .reduce((sum, p) => sum + p.amount, 0);
    const remaining = invoice.subtotal - paid;

    if (amount <= 0) {
      alert("אנא הזן סכום תקין.");
      return;
    }

    if (amount > remaining) {
      alert("לא ניתן לשלם יותר מהיתרה!");
      return;
    }

    const paymentObj = {
      id: Math.random().toString(36).substr(2, 9),
      customer_id: invoice.customer_id,
      customer_name: invoice.customer_name,
      invoice_id: invoiceId,
      amount,
      method: paymentMethod,
      date: new Date().toISOString().slice(0, 10),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      transaction_reference: reference || "",
    };

    try {
      await sendPaymentToApi(paymentObj);
      addPayment(paymentObj);

      const paidAfter = paid + amount;
      const remainingAfter = invoice.subtotal - paidAfter;
      if (remainingAfter === 0) {
        updateInvoiceStatus(invoiceId, InvoiceStatus.PAID);
      }

      // 🎯 יצירת קבלה אוטומטית:
      const receiptUrl = await createReceiptFromPayment(paymentObj);
      alert("✅ הקבלה נוצרה!\n" + receiptUrl);

    } catch (error) {
      alert("❌ שגיאה בתשלום או ביצירת קבלה");
      return;
    }

    methods.reset();
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-lg shadow" dir="rtl">
      <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">טופס תשלום</h2>
      <Form onSubmit={onSubmit} methods={methods}>
        <SelectField
          name="paymentMethod"
          label="שיטת תשלום"
          options={[
            { value: PaymentMethodType.CASH, label: "מזומן" },
            { value: PaymentMethodType.CREDIT_CARD, label: "כרטיס אשראי" },
            { value: PaymentMethodType.BANK_TRANSFER, label: "העברה בנקאית" },
          ]}
          required
        />
        <NumberInputField
          name="amount"
          label="סכום"
          required
          min={0}
          step={0.01}
        />
        <InputField name="reference" label="רפרנס" />
        <SelectField
          name="invoiceId"
          label="חשבונית"
          options={[
            { value: "", label: "בחר חשבונית" },
            ...invoices.map((inv) => ({
              value: inv.id,
              label: `${inv.invoice_number} - ${inv.customer_name}`,
            })),
          ]}
          required
        />
        {methods.watch("invoiceId") && (
          <div className="bg-gray-50 border rounded p-4 space-y-2">
            <div>
              <strong>סטטוס חשבונית:</strong>{" "}
              {invoices.find((inv) => inv.id === methods.watch("invoiceId"))?.status}
            </div>
            <div>
              <strong>תשלומים לחשבונית:</strong>
              {payments.filter((p) => p.invoice_id === methods.watch("invoiceId")).length === 0 ? (
                <div>אין תשלומים לחשבונית זו.</div>
              ) : (
                payments
                  .filter((p) => p.invoice_id === methods.watch("invoiceId"))
                  .map((p) => (
                    <div key={p.id}>
                      {p.amount} ש"ח - {p.method} - {new Date(p.date).toLocaleDateString()}
                    </div>
                  ))
              )}
            </div>
            <div>
              <strong>יתרה לתשלום:</strong>{" "}
              {(() => {
                const invoice = invoices.find((inv) => inv.id === methods.watch("invoiceId"));
                const paid = payments
                  .filter((p) => p.invoice_id === methods.watch("invoiceId"))
                  .reduce((sum, p) => sum + p.amount, 0);
                return invoice ? invoice.subtotal - paid : 0;
              })()} ש"ח
            </div>
          </div>
        )}
        <Button type="submit">רשום תשלום</Button>
      </Form>
    </div>
  );
}
