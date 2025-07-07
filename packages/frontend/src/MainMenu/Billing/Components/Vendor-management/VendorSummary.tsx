import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Expense, Vendor } from 'shared-types';
import { Button } from '../../../../Common/Components/BaseComponents/Button';
import { Table } from '../../../../Common/Components/BaseComponents/Table';
import VendorDocuments from './VendorDocuments';

// טיפוס הפרופס - מערך ספקים ופונקציה לעדכון
type VendorSummaryProps = {
  vendors: Vendor[];
  setVendors: React.Dispatch<React.SetStateAction<Vendor[]>>;
};

export default function VendorSummary({ vendors, setVendors }: VendorSummaryProps) {
  const { id } = useParams();
  const navigate = useNavigate();

  // ה-Hooks חייבים להיקרא תמיד - לכן הם תמיד בראש הפונקציה
const [expenses, setExpenses] = useState<Expense[]>([]);
  const [summary, setSummary] = useState<null | {
    totalExpenses: number;
    expenseCount: number;
    lastExpenseDate: string | null;
    averageExpense: number;
    onTimePayments: number;
    latePayments: number;
    averagePaymentDays: number;
  }>(null);

  // חיפוש ספק לפי מזהה
  const vendor = vendors.find((v) => v.id === id);

  // קריאת הוצאות מהשרת
  useEffect(() => {
    async function fetchExpenses() {
      if (!id) return;
      try {
        const res = await fetch(`http://localhost:3001/expense/getExpensesByVendorId/${id}`);
        const data = await res.json();
         console.log('הוצאות מהשרת:', data);  
        setExpenses(data);
      } catch (err) {
        console.error(err);
      }
    }

    fetchExpenses();
  }, [id]);

  // אם לא נמצא ספק - מחזירים הודעה מוקדם, אבל רק אחרי שכל ה-Hooks קראו
  if (!vendor) return <div>לא נמצא ספק</div>;

  const vendorExpenses = expenses.filter((e) => e.vendor_id === vendor?.id);
  console.log('vendorExpenses:', vendorExpenses);
  const expenseCount = vendorExpenses.length;
  const totalExpenses = vendorExpenses.reduce((sum, e) => sum + e.amount, 0);
  console.log('expenseCount:', expenseCount, 'totalExpenses:', totalExpenses);
  const averageExpense = expenseCount > 0 ? parseFloat((totalExpenses / expenseCount).toFixed(2)) : 0;
  const lastExpenseDate = expenseCount > 0 ? vendorExpenses[expenseCount - 1].date : '-';

  const handleDeleteVendor = () => {
    if (window.confirm('האם את בטוחה שברצונך למחוק את הספק?')) {
      setVendors(vendors.filter((v) => v.id !== id));
      navigate('/vendors');
    }
  };

  return (
    <div className="p-6 space-y-6" dir="rtl">
      <h2 className="text-2xl font-bold text-center">פרטי ספק</h2>

      <div className="flex justify-center gap-4 mb-6">
        <Button variant="primary" onClick={() => navigate(`/vendors/${vendor.id}/edit`)}>
          ערוך ספק
        </Button>
        <Button variant="accent" onClick={handleDeleteVendor}>
          מחק ספק
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4 max-w-xl mx-auto text-right">
        <div><strong>שם:</strong> {vendor.name}</div>
        <div><strong>קטגוריה:</strong> {vendor.category}</div>
        <div><strong>טלפון:</strong> {vendor.phone}</div>
        <div><strong>אימייל:</strong> {vendor.email}</div>
        <div><strong>כתובת:</strong> {vendor.address}</div>
      </div>

      <VendorDocuments />

      <div className="max-w-xl mx-auto mt-8 space-y-4">
        <h3 className="text-xl font-semibold">סיכום הוצאות</h3>
        <div><strong>סך הכל הוצאות:</strong> {totalExpenses} ₪</div>
        <div><strong>מספר הוצאות:</strong> {expenseCount}</div>
        <div><strong>ממוצע הוצאה:</strong> {averageExpense} ₪</div>
        <div><strong>תאריך הוצאה אחרונה:</strong> {lastExpenseDate}</div>
      </div>

      {vendorExpenses.length > 0 && (
        <div className="max-w-4xl mx-auto mt-6">
          <h3 className="text-xl font-semibold mb-4">פירוט הוצאות</h3>
          <Table
            columns={[
              { header: 'סכום', accessor: 'amount' },
              { header: 'קטגוריה', accessor: 'category' },
              { header: 'תיאור', accessor: 'description' },
              { header: 'תאריך', accessor: 'date' },
              { header: 'סטטוס', accessor: 'status' },
            ]}
            data={vendorExpenses}
            dir="rtl"
          />
        </div>
      )}
    </div>
  );
}

