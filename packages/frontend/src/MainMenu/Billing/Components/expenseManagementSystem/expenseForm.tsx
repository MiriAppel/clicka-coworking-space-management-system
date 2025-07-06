// // import { useExpenseStore } from "../../../../Stores/Billing/expenseStore";

// // export const ExpenseForm = () => {
// // // const {fetchExpenseDetails,handleCreateExpense,handleUpdateExpense,
// // //   handleFieldChange,resetForm,validateExpenseForm}= useExpenseStore();
// //   //functions


// //   // סגירת הטופס
// //   const handleCloseForm = (): void => { };



// //   return <div>

// //   </div>

// // }
// import React from 'react';
// import { useForm } from 'react-hook-form';
// import { z } from 'zod';
// import { zodResolver } from '@hookform/resolvers/zod';
// // import { ExpenseCategory, ExpenseStatus, Vendor } from  'shared-types/expense';
// import { ExpenseCategory ,ExpenseStatus,Vendor } from 'shared-types';
// import FileUploader from '../FileUploader';

// const expenseSchema = z.object({
//   vendorId: z.string().min(1, 'יש לבחור ספק'),
//   category: z.nativeEnum(ExpenseCategory),
//   description: z.string().min(2, 'נא להזין תיאור'),
//   amount: z.number({ invalid_type_error: 'נא להזין סכום תקין' }).positive('הסכום חייב להיות חיובי'),
//   date: z.string().min(1, 'נא להזין תאריך'),
//   status: z.nativeEnum(ExpenseStatus, { required_error: 'יש לבחור סטטוס' }),
//   notes: z.string().optional(),
//   receiptUrl: z.string().url('יש להזין קישור תקין').optional(),
// });

// type ExpenseFormValues = z.infer<typeof expenseSchema>;

// type Props = {
//   vendors: Vendor[];
// };

// export const CreateExpenseForm: React.FC<Props> = ({ vendors }) => {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     setValue, //נשתמש בזה כדי לעדכן receiptUrl
//     reset,
//   } = useForm<ExpenseFormValues>({
//     resolver: zodResolver(expenseSchema),
//     defaultValues: {
//       category: ExpenseCategory.OTHER,
//       date: new Date().toISOString().split('T')[0],
//       status: ExpenseStatus.PENDING,
//     },
//   });

//   const onFormSubmit = async (data: ExpenseFormValues) => {
//     const formData = new FormData();
//     Object.entries(data).forEach(([key, value]) => {
//       if (value !== undefined && value !== null) {
//         formData.append(key, value.toString());
//       }
//     });

//     try {
//       const response = await fetch('/api/expenses', {
//         method: 'POST',
//         body: formData,
//       });

//       if (!response.ok) {
//         const errorText = await response.text();
//         throw new Error(errorText);
//       }

//       alert('ההוצאה נשמרה בהצלחה!');
//       reset();
//     } catch (error: any) {
//       alert('שגיאה בשמירת ההוצאה: ' + error.message);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit(onFormSubmit)} className="expense-form">
//       <label>
//         ספק:
//         <select {...register('vendorId')}>
//           <option value="">בחר ספק</option>
//           {vendors.map((v) => (
//             <option key={v.id} value={v.id}>{v.name}</option>
//           ))}
//         </select>
//         {errors.vendorId && <span>{errors.vendorId.message}</span>}
//       </label>

//       <label>
//         קטגוריה:
//         <select {...register('category')}>
//           {Object.entries(ExpenseCategory).map(([key, val]) => (
//             <option key={key} value={val}>{val}</option>
//           ))}
//         </select>
//         {errors.category && <span>{errors.category.message}</span>}
//       </label>

//       <label>
//         תיאור:
//         <input type="text" {...register('description')} />
//         {errors.description && <span>{errors.description.message}</span>}
//       </label>

//       <label>
//         סכום:
//         <input type="number" step="0.01" {...register('amount', { valueAsNumber: true })} />
//         {errors.amount && <span>{errors.amount.message}</span>}
//       </label>

//       <label>
//         תאריך:
//         <input type="date" {...register('date')} />
//         {errors.date && <span>{errors.date.message}</span>}
//       </label>

//       <label>
//         סטטוס תשלום:
//         <select {...register('status')}>
//           {Object.entries(ExpenseStatus).map(([key, val]) => (
//             <option key={key} value={val}>{val}</option>
//           ))}
//         </select>
//         {errors.status && <span>{errors.status.message}</span>}
//       </label>

//       {/* 🆕 העלאת קובץ קבלה */}
//       <label>
//         העלאת קובץ קבלה:
//         <FileUploader
//           onFilesUploaded={(uploadedFiles) => {
//             // שימי לב: זה הקישור הדמה שהקובץ מחזיר כרגע
//             const url = 'https://drive.google.com/file/d/' + uploadedFiles[0].id;
//             setValue('receiptUrl', url); // נכניס את הקישור לטופס
//           }}
//         />
//       </label>

//       {/* 🛠️ נסתיר את שדה receiptUrl כי הוא כבר מוזן אוטומטית */}
//       <input type="hidden" {...register('receiptUrl')} />
//       {errors.receiptUrl && <span>{errors.receiptUrl.message}</span>}

//       <label>
//         הערות:
//         <textarea {...register('notes')} />
//       </label>

//       <button type="submit">שמור הוצאה</button>
//     </form>
//   );
// };


////ניסיון

import React from 'react';
import { z } from 'zod';
import { Form } from '../../../../Common/Components/BaseComponents/Form';
import { InputField } from '../../../../Common/Components/BaseComponents/Input';
import { NumberInputField } from '../../../../Common/Components/BaseComponents/InputNumber';
import { SelectField } from '../../../../Common/Components/BaseComponents/Select';
import { CheckboxField } from '../../../../Common/Components/BaseComponents/CheckBox';
import FileUploader from '../FileUploader';
import { ExpenseCategory, ExpenseStatus, Vendor } from 'shared-types';




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

const schema = z.object({
  vendorId: z.string().min(1, 'יש לבחור ספק'),
  category: z.nativeEnum(ExpenseCategory),
  description: z.string().min(2, 'נא להזין תיאור'),
  // amount: z.number({ invalid_type_error: 'נא להזין סכום תקין' }).positive('הסכום חייב להיות חיובי'),
  date: z.string().min(1, 'נא להזין תאריך'),
  status: z.nativeEnum(ExpenseStatus, { required_error: 'יש לבחור סטטוס' }),
  notes: z.string().optional(),
  receiptUrl: z.string().url('יש להזין קישור תקין').optional(),
});

type ExpenseFormValues = z.infer<typeof schema>;

type Props = {
  vendors: Vendor[];
};

export const CreateExpenseForm: React.FC<Props> = ({ vendors }) => {
  const handleSubmit = async (data: ExpenseFormValues) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });

    try {
      const response = await fetch('/api/expenses', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      alert('ההוצאה נשמרה בהצלחה!');
    } catch (error: any) {
      alert('שגיאה בשמירת ההוצאה: ' + error.message);
    }
  };

  return (
    <Form schema={schema} onSubmit={handleSubmit} label="טופס יצירת הוצאה">
      <SelectField
        name="vendorId"
        label="בחר ספק"
        required
        options={vendors.map((vendor) => ({ value: vendor.id, label: vendor.name }))}
      />

      <SelectField
        name="category"
        label="בחר קטגוריה"
        required
        options={Object.entries(ExpenseCategory).map(([key, val]) => ({
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
        options={Object.entries(ExpenseStatus).map(([key, val]) => ({
          value: val,
          label: expenseStatusLabels[val],
        }))}
      />

     
      <FileUploader
        onFilesUploaded={(uploadedFiles) => {
          const url = 'https://drive.google.com/file/d/' + uploadedFiles[0].id;
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
