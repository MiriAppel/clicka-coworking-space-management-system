// import React, { useEffect, useState } from 'react';
// import { z } from 'zod';
// import { Form } from '../../../../Common/Components/BaseComponents/Form';
// import { InputField } from '../../../../Common/Components/BaseComponents/Input';
// import { NumberInputField } from '../../../../Common/Components/BaseComponents/InputNumber';
// import { SelectField } from '../../../../Common/Components/BaseComponents/Select';
// import FileUploader from '../FileUploader';
// import { ExpenseCategory, ExpenseStatus, Vendor } from 'shared-types';
// import { getAllVendors } from '../../../../Api/vendor-api'; // ודאי שזה הנתיב הנכון אצלך

// // --------------------------------------------------
// // מילונים
// // --------------------------------------------------
// const expenseCategoryLabels: Record<ExpenseCategory, string> = {
//   RENT: 'שכירות',
//   UTILITIES: 'חשבונות',
//   CLEANING: 'ניקיון',
//   MAINTENANCE: 'תחזוקה',
//   OFFICE_SUPPLIES: 'ציוד משרדי',
//   REFRESHMENTS: 'כיבוד',
//   MARKETING: 'שיווק',
//   SALARIES: 'משכורות',
//   INSURANCE: 'ביטוחים',
//   SOFTWARE: 'תוכנות',
//   PROFESSIONAL_SERVICES: 'שירותים מקצועיים',
//   TAXES: 'מיסים',
//   EVENTS: 'אירועים',
//   FURNITURE: 'ריהוט',
//   EQUIPMENT: 'ציוד',
//   PETTY_CASH: 'קופה קטנה',
//   OTHER: 'אחר',
// };

// const expenseStatusLabels: Record<ExpenseStatus, string> = {
//   PENDING: 'ממתין',
//   APPROVED: 'מאושר',
//   PAID: 'שולם',
//   REJECTED: 'נדחה',
// };

// // --------------------------------------------------
// // סכימת אימות
// // --------------------------------------------------
// const schema = z.object({
//   vendorId: z.string().min(1, 'יש לבחור ספק'),
//   category: z.nativeEnum(ExpenseCategory),
//   description: z.string().min(2, 'נא להזין תיאור'),
//   amount: z.coerce.number({ invalid_type_error: 'נא להזין סכום תקין' }).positive('הסכום חייב להיות חיובי'),
//   date: z.string().min(1, 'נא להזין תאריך'),
//   status: z.nativeEnum(ExpenseStatus, { required_error: 'יש לבחור סטטוס' }),
//   reference: z.string().optional(),
//   notes: z.string().optional(),
//   receiptUrl: z.string().url('יש להזין קישור תקין').optional(),
// });

// export type ExpenseFormValues = z.infer<typeof schema>;

// // --------------------------------------------------
// // קומפוננטת יצירת הוצאה
// // --------------------------------------------------
// export const CreateExpenseForm: React.FC = () => {
//   const [vendors, setVendors] = useState<Vendor[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//   const fetchVendors = async () => {
//     try {
//       const data = await getAllVendors();
//       console.log("✅ ספקים שהתקבלו:", data); // 🔥 תוספת חשובה!
//       setVendors(data);
//     } catch (error) {
//       console.error('❌ שגיאה בשליפת ספקים:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   fetchVendors();
// }, []);

//   const handleSubmit = async (data: ExpenseFormValues) => {
//     const vendor = vendors.find(v => v.id === data.vendorId);

//     const payload = {
//       vendor_id: data.vendorId,
//       vendor_name: vendor?.name ?? '',
//       category: data.category,
//       description: data.description,
//       amount: data.amount,
//       date: data.date,
//       status: data.status,
//       reference: data.reference ?? null,
//       notes: data.notes ?? null,
//       receipt_file: data.receiptUrl ?? null,
//       created_at: new Date().toISOString(),
//       updated_at: new Date().toISOString(),
//     };

//     try {
//       const response = await fetch(
//         `${process.env.REACT_APP_API_BASE ?? 'http://localhost:3001'}/api/expenses/createExpense`,
//         {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify(payload),
//         },
//       );

//       if (!response.ok) {
//         const errorText = await response.text();
//         throw new Error(errorText);
//       }

//       alert('ההוצאה נשמרה בהצלחה!');
//     } catch (error: any) {
//       alert('שגיאה בשמירת ההוצאה: ' + error.message);
//     }
//   };

//   if (loading) return <div>טוען ספקים...</div>;

//   return (
//     <Form schema={schema} onSubmit={handleSubmit} label="טופס יצירת הוצאה">
//       <SelectField
//         name="vendorId"
//         label="בחר ספק"
//         required
//         options={vendors.map(v => ({ value: v.id, label: v.name }))}
//       />
//       <SelectField
//         name="category"
//         label="בחר קטגוריה"
//         required
//         options={Object.values(ExpenseCategory).map(val => ({
//           value: val,
//           label: expenseCategoryLabels[val],
//         }))}
//       />
//       <InputField name="description" label="תיאור" required />
//       <NumberInputField name="amount" label="סכום" required />
//       <InputField name="date" label="תאריך" type="date" required />
//       <SelectField
//         name="status"
//         label="סטטוס תשלום"
//         required
//         options={Object.values(ExpenseStatus).map(val => ({
//           value: val,
//           label: expenseStatusLabels[val],
//         }))}
//       />
//       <InputField name="reference" label="אסמכתא" />
//       <FileUploader
//         onFilesUploaded={uploadedFiles => {
//           const url = `https://drive.google.com/file/d/${uploadedFiles[0].id}`;
//           const event = new CustomEvent('setFieldValue', {
//             detail: { name: 'receiptUrl', value: url },
//           });
//           window.dispatchEvent(event);
//         }}
//       />
//       <InputField name="receiptUrl" label="קישור לקבלה" />
//       <InputField name="notes" label="הערות" />
//       <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
//         שמור הוצאה
//       </button>
//     </Form>
//   );
// };
import React, { useEffect, useState } from 'react';
import { z } from 'zod';
import { Form } from '../../../../Common/Components/BaseComponents/Form';
import { InputField } from '../../../../Common/Components/BaseComponents/Input';
import { NumberInputField } from '../../../../Common/Components/BaseComponents/InputNumber';
import { SelectField } from '../../../../Common/Components/BaseComponents/Select';
import { Button } from '../../../../Common/Components/BaseComponents/Button';
import { Modal } from '../../../../Common/Components/BaseComponents/Modal'; // ודא שזה הנתיב הנכון
import FileUploader from '../FileUploader';

import {
  ExpenseCategory,
  ExpenseStatus,
  Vendor,
  VendorCategory,
  VendorStatus,
  PaymentMethod,
} from 'shared-types';

import { getAllVendors, createVendor } from '../../../../Api/vendor-api';

// --------------------------------------------------
// סכימות ותרגומים
// --------------------------------------------------
const expenseSchema = z.object({
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

type ExpenseFormValues = z.infer<typeof expenseSchema>;

const vendorSchema = z.object({
  name: z.string().min(2, 'יש להזין שם'),
  contact_name: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email('כתובת לא תקינה').optional(),
  address: z.string().optional(),
  website: z.string().url('כתובת אתר לא תקינה').optional(),
  taxId: z.string().optional(),
  preferred_payment_method: z.nativeEnum(PaymentMethod).optional(),
  category: z.nativeEnum(VendorCategory).default(VendorCategory.Other),
  status: z.nativeEnum(VendorStatus).default(VendorStatus.Active),
  notes: z.string().optional(),
});

type NewVendor = z.infer<typeof vendorSchema>;

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

const vendorCategoryLabels: Record<VendorCategory, string> = {
  Equipment: 'ציוד',
  Services: 'שירותים',
  Maintenance: 'תחזוקה',
  Other: 'אחר',
};

const paymentMethodLabels: Record<PaymentMethod, string> = {
  CASH: 'מזומן',
  CREDIT_CARD: 'כרטיס אשראי',
  BANK_TRANSFER: 'העברה בנקאית',
  CHECK: 'שיק',
  OTHER: 'אחר',
};

const vendorStatusLabels: Record<VendorStatus, string> = {
  Active: 'פעיל',
  Inactive: 'לא פעיל',
  Suspended: 'מושהה',
};

// --------------------------------------------------
// קומפוננטת פופאפ ליצירת הוצאה
// --------------------------------------------------

interface CreateExpenseModalProps {
  open: boolean;
  onClose: () => void;
}

export const CreateExpenseModal: React.FC<CreateExpenseModalProps> = ({ open, onClose }) => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [newVendor, setNewVendor] = useState<NewVendor>({
    name: '',
    contact_name: '',
    phone: '',
    email: '',
    address: '',
    website: '',
    taxId: '',
    preferred_payment_method: undefined,
    category: VendorCategory.Other,
    status: VendorStatus.Active,
    notes: '',
  });

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const data = await getAllVendors();
        const activeVendors = data.filter((v: Vendor) => v.status === VendorStatus.Active);
        setVendors(activeVendors);
      } catch (error) {
        console.error('שגיאה בשליפת ספקים:', error);
      } finally {
        setLoading(false);
      }
    };
    if (open) fetchVendors();
  }, [open]);

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
      const response = await fetch(`${process.env.REACT_APP_API_BASE ?? 'http://localhost:3001'}/api/expenses/createExpense`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error(await response.text());
      alert('ההוצאה נשמרה בהצלחה!');
      onClose(); // סגירת הפופאפ אחרי הצלחה
    } catch (error: any) {
      alert('שגיאה בשמירת ההוצאה: ' + error.message);
    }
  };

  if (!open || loading) return null;

  return (
    <Modal open={open} onClose={onClose} title="יצירת הוצאה">
      <Form schema={expenseSchema} onSubmit={handleSubmit}>
        <div className="flex gap-2 items-end">
          <SelectField
            name="vendorId"
            label="בחר ספק"
            required
            options={vendors.map(v => ({ value: v.id, label: v.name }))}
          />
          <Button type="button" onClick={() => setDialogOpen(true)}>
            הוסף ספק
          </Button>
        </div>

        <SelectField
          name="category"
          label="קטגוריה"
          required
          options={Object.values(ExpenseCategory).map(val => ({ value: val, label: expenseCategoryLabels[val] }))}
        />
        <InputField name="description" label="תיאור" required />
        <NumberInputField name="amount" label="סכום" required />
        <InputField name="date" label="תאריך" type="date" required />
        <SelectField
          name="status"
          label="סטטוס"
          required
          options={Object.values(ExpenseStatus).map(val => ({ value: val, label: expenseStatusLabels[val] }))}
        />
        <InputField name="reference" label="אסמכתא" />
        <FileUploader onFilesUploaded={files => {
          const url = `https://drive.google.com/file/d/${files[0].id}`;
          const event = new CustomEvent('setFieldValue', { detail: { name: 'receiptUrl', value: url } });
          window.dispatchEvent(event);
        }} />
        <InputField name="receiptUrl" label="קישור לקבלה" />
        <InputField name="notes" label="הערות" />
        <Button type="submit">שמור הוצאה</Button>
      </Form>

      {/* דיאלוג פנימי להוספת ספק – עדיין לא ממודאל, נטפל בזה בהמשך */}
      {isDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded p-4 w-full max-w-md shadow">
            <h2 className="text-xl font-bold mb-4">הוספת ספק חדש</h2>
            <div className="grid gap-3">
              <input className="input" placeholder="שם" value={newVendor.name} onChange={(e) => setNewVendor({ ...newVendor, name: e.target.value })} />
              <input className="input" placeholder="איש קשר" value={newVendor.contact_name} onChange={(e) => setNewVendor({ ...newVendor, contact_name: e.target.value })} />
              <input className="input" placeholder="טלפון" value={newVendor.phone} onChange={(e) => setNewVendor({ ...newVendor, phone: e.target.value })} />
              <input className="input" placeholder="אימייל" value={newVendor.email} onChange={(e) => setNewVendor({ ...newVendor, email: e.target.value })} />
              <input className="input" placeholder="כתובת" value={newVendor.address} onChange={(e) => setNewVendor({ ...newVendor, address: e.target.value })} />
              <input className="input" placeholder="אתר" value={newVendor.website} onChange={(e) => setNewVendor({ ...newVendor, website: e.target.value })} />
              <input className="input" placeholder="ח.פ / עוסק" value={newVendor.taxId} onChange={(e) => setNewVendor({ ...newVendor, taxId: e.target.value })} />
              <select className="input" value={newVendor.preferred_payment_method ?? ''} onChange={(e) => setNewVendor({ ...newVendor, preferred_payment_method: e.target.value as PaymentMethod })}>
                <option value="">בחר שיטת תשלום</option>
                {Object.values(PaymentMethod).map(val => (
                  <option key={val} value={val}>{paymentMethodLabels[val]}</option>
                ))}
              </select>
              <select className="input" value={newVendor.category} onChange={(e) => setNewVendor({ ...newVendor, category: e.target.value as VendorCategory })}>
                {Object.values(VendorCategory).map(val => (
                  <option key={val} value={val}>{vendorCategoryLabels[val]}</option>
                ))}
              </select>
              <select className="input" value={newVendor.status} onChange={(e) => setNewVendor({ ...newVendor, status: e.target.value as VendorStatus })}>
                {Object.values(VendorStatus).map(val => (
                  <option key={val} value={val}>{vendorStatusLabels[val]}</option>
                ))}
              </select>
              <input className="input" placeholder="הערות" value={newVendor.notes} onChange={(e) => setNewVendor({ ...newVendor, notes: e.target.value })} />
              <div className="flex justify-end gap-2 mt-2">
                <Button variant="secondary" onClick={() => setDialogOpen(false)}>ביטול</Button>
                <Button type="button" onClick={async () => {
                  try {
                    vendorSchema.parse(newVendor);
                    const vendorToSave = {
                      name: newVendor.name,
                      category: newVendor.category,
                      phone: newVendor.phone ?? '',
                      email: newVendor.email ?? '',
                      address: newVendor.address ?? '',
                    };
                    const response = await fetch(`${process.env.REACT_APP_API_BASE ?? 'http://localhost:3001'}/vendor`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(vendorToSave),
                    });
                    if (!response.ok) throw new Error(await response.text());
                    const savedVendor = await response.json();
                    setVendors(prev => [...prev, savedVendor]);
                    setDialogOpen(false);
                    setNewVendor({
                      name: '',
                      contact_name: '',
                      phone: '',
                      email: '',
                      address: '',
                      website: '',
                      taxId: '',
                      preferred_payment_method: undefined,
                      category: VendorCategory.Other,
                      status: VendorStatus.Active,
                      notes: '',
                    });
                  } catch (error: any) {
                    alert('שגיאה בהוספת ספק: ' + error.message);
                  }
                }}>שמור ספק</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};

