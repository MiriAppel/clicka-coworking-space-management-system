import React, { useEffect, useState } from 'react';
import { z } from 'zod';
import { Form } from '../../../../Common/Components/BaseComponents/Form';
import { InputField } from '../../../../Common/Components/BaseComponents/Input';
import { NumberInputField } from '../../../../Common/Components/BaseComponents/InputNumber';
import { SelectField } from '../../../../Common/Components/BaseComponents/Select';
import FileUploader from '../FileUploader';
import { ExpenseCategory, ExpenseStatus, Vendor } from 'shared-types';
import { getAllVendors } from '../../../../Api/vendor-api'; // ודאי שזה הנתיב הנכון אצלך

// --------------------------------------------------
// מילונים
// --------------------------------------------------
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

const expenseStatusLabels: Record<ExpenseStatus, string> = {
  PENDING: 'ממתין',
  APPROVED: 'מאושר',
  PAID: 'שולם',
  REJECTED: 'נדחה',
};

// --------------------------------------------------
// סכימת אימות
// --------------------------------------------------
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

export type ExpenseFormValues = z.infer<typeof schema>;

// --------------------------------------------------
// קומפוננטת יצירת הוצאה
// --------------------------------------------------
export const CreateExpenseForm: React.FC = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const fetchVendors = async () => {
    try {
      const data = await getAllVendors();
      console.log("✅ ספקים שהתקבלו:", data); // 🔥 תוספת חשובה!
      setVendors(data);
    } catch (error) {
      console.error('❌ שגיאה בשליפת ספקים:', error);
    } finally {
      setLoading(false);
    }
  };

  fetchVendors();
}, []);

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
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE ?? 'http://localhost:3001'}/api/expenses/createExpense`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        },
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      alert('ההוצאה נשמרה בהצלחה!');
    } catch (error: any) {
      alert('שגיאה בשמירת ההוצאה: ' + error.message);
    }
  };

  if (loading) return <div>טוען ספקים...</div>;

  return (
    <Form schema={schema} onSubmit={handleSubmit} label="טופס יצירת הוצאה">
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
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        שמור הוצאה
      </button>
    </Form>
  );
};
