import React, { useEffect, useState } from 'react';
import { z } from 'zod';
import { Form } from '../../../../Common/Components/BaseComponents/Form';
import { InputField } from '../../../../Common/Components/BaseComponents/Input';
import { NumberInputField } from '../../../../Common/Components/BaseComponents/InputNumber';
import { SelectField } from '../../../../Common/Components/BaseComponents/Select';
import FileUploader from '../FileUploader';
import { Expense, ExpenseCategory, ExpenseStatus } from 'shared-types';
import { useParams } from "react-router-dom";
import { useVendorsStore } from '../../../../Stores/Billing/vendorsStore';
import axiosInstance from '../../../../Service/Axios'; // נתיב בהתאם

interface CreateExpenseFormProps {
  fixedCategory?: ExpenseCategory;
  onSave?: (newExpense: Expense) => void;
}

// מילונים
const expenseCategoryLabels: Record<ExpenseCategory, string> = {
  RENT: 'שכירות',
  UTILITIES: 'חשבונות',
  CLEANING: 'ניקיון',
  MAINTENANCE: 'תחזוקה',
  OFFICE_SUPPLIES: 'ציוד משרדי',
  REFRESHMENTS: 'כיבוד',
  MARKETING: 'שיווק',
  SALARIES: 'משכורות',
  INSURANCE: 'ביטוחים',
  SOFTWARE: 'תוכנות',
  PROFESSIONAL_SERVICES: 'שירותים מקצועיים',
  TAXES: 'מיסים',
  EVENTS: 'אירועים',
  FURNITURE: 'ריהוט',
  EQUIPMENT: 'ציוד',
  PETTY_CASH: 'קופה קטנה',
  OTHER: 'אחר',
};

// סכימת אימות
const schema = z.object({
  vendorId: z.string().min(1, 'יש לבחור ספק'),
  category: z.nativeEnum(ExpenseCategory),
  description: z.string().min(2, 'נא להזין תיאור'),
  amount: z.coerce.number({ invalid_type_error: 'נא להזין סכום תקין' }).positive('הסכום חייב להיות חיובי'),
  date: z.string().min(1, 'נא להזין תאריך'),
  status: z.nativeEnum(ExpenseStatus, { required_error: 'יש לבחור סטטוס' }),
  reference: z.string().optional(),
  notes: z.string().optional(),
  receiptUrl: z.string().url('יש להזין קישור תקין').optional(),
});
type ExpenseFormValues = z.infer<typeof schema>;

export const CreateExpenseForm: React.FC<CreateExpenseFormProps> = ({ fixedCategory, onSave }) => {
  const { id } = useParams<{ id: string }>();
  const [defaultValues, setDefaultValues] = useState<Partial<ExpenseFormValues>>({});
  const [loadingExpense, setLoadingExpense] = useState(!!id);

  const { vendors, fetchVendors, loading } = useVendorsStore();

  const expenseStatusLabels: Record<ExpenseStatus, string> = {
    PENDING: 'ממתין',
    APPROVED: 'מאושר',
    PAID: 'שולם',
    REJECTED: 'נדחה',
  };

  useEffect(() => {
    fetchVendors();
  }, [fetchVendors]);

  useEffect(() => {
    if (id) {
      setLoadingExpense(true);
      axiosInstance.get(`/expenses/getExpenseById/${id}`)
        .then(res => {
          const data = res.data;
          setDefaultValues({
            vendorId: data.vendor_id,
            category: data.category,
            description: data.description,
            amount: data.amount,
            date: data.date?.slice(0, 10),
            status: data.status,
            reference: data.reference ?? "",
            notes: data.notes ?? "",
            receiptUrl: data.receipt_file?.url ?? "",
          });
        })
        .catch((error) => {
          console.error("שגיאה בטעינת הוצאה:", error);
          setDefaultValues({});
        })
        .finally(() => setLoadingExpense(false));
    }
  }, [id]);

  const handleSubmit = async (data: ExpenseFormValues) => {
    const vendor = vendors.find(v => v.id === data.vendorId);

    const payload = {
      vendor_id: data.vendorId,
      vendor_name: vendor?.name ?? '',
      category: data.category,
      description: data.description,
      amount: data.amount,
      date: data.date,
      status: data.status,
      reference: data.reference ?? null,
      notes: data.notes ?? null,
      receipt_file: data.receiptUrl ?? null,
      updated_at: new Date().toISOString(),
    };

    try {
      const url = id ? `/expenses/updateExpense/${id}` : '/expenses/createExpense';
      const method = id ? 'put' : 'post';

      const response = await axiosInstance.request({
        url,
        method,
        data: payload,
      });

      alert(id ? 'ההוצאה עודכנה בהצלחה!' : 'ההוצאה נשמרה בהצלחה!');
      if (onSave) onSave(response.data);
    } catch (error: any) {
      alert('שגיאה בשמירת ההוצאה: ' + (error.message || error));
    }
  };

  if (loading || loadingExpense) return <div>טוען...</div>;

  return (
    <Form
      schema={schema}
      onSubmit={handleSubmit}
      label={id ? "עריכת הוצאה" : "טופס יצירת הוצאה"}
      defaultValues={defaultValues}
    >
      <SelectField
        name="vendorId"
        label="בחר ספק"
        required
        options={vendors.map(v => ({ value: v.id, label: v.name }))}
      />
      <SelectField
        name="category"
        label="בחר קטגוריה"
        required
        options={Object.values(ExpenseCategory).map(val => ({
          value: val,
          label: expenseCategoryLabels[val],
        }))}
      />
      <InputField name="description" label="תיאור" required />
      <NumberInputField name="amount" label="סכום" required />
      <InputField name="date" label="תאריך" type="date" required />
      <SelectField
        name="status"
        label="סטטוס תשלום"
        required
        options={Object.values(ExpenseStatus).map(val => ({
          value: val,
          label: expenseStatusLabels[val],
        }))}
      />
      <InputField name="reference" label="אסמכתא" />
      <FileUploader
        onFilesUploaded={uploadedFiles => {
          const url = `https://drive.google.com/file/d/${uploadedFiles[0].id}`;
          const event = new CustomEvent('setFieldValue', {
            detail: { name: 'receiptUrl', value: url },
          });
          window.dispatchEvent(event);
        }}
      />
      <InputField name="receiptUrl" label="קישור לקבלה" />
      <InputField name="notes" label="הערות" />
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        שמור הוצאה
      </button>
    </Form>
  );
};
