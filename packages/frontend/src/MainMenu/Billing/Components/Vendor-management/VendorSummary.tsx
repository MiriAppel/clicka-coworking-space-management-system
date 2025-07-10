import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Expense, ExpenseCategory, ExpenseStatus, Vendor} from 'shared-types';
import { Button } from '../../../../Common/Components/BaseComponents/Button';
import { Table } from '../../../../Common/Components/BaseComponents/Table';
//import VendorDocuments from './VendorDocuments';

// טיפוס הפרופס - מערך ספקים ופונקציה לעדכון
type VendorSummaryProps = {
  vendors: Vendor[];
  setVendors: React.Dispatch<React.SetStateAction<Vendor[]>>;
};

// קומפוננטת סיכום ספק עם פרטים והוצאות
export default function VendorSummary({ vendors, setVendors }: VendorSummaryProps) {
  // שולף את ה-id של הספק מהנתיב (URL)
  const { id } = useParams();

  // מחפש את הספק המתאים במערך ספקים לפי מזהה
  const vendor = vendors.find((v) => v.id === id);

  // hook לניווט בין מסכים
  const navigate = useNavigate();

  // מצב פנימי לאחסון סיכום (כרגע לא בשימוש בקוד)
  const [summary, setSummary] = useState<null | {
    totalExpenses: number;
    expenseCount: number;
    lastExpenseDate: string | null;
    averageExpense: number;
    onTimePayments: number;
    latePayments: number;
    averagePaymentDays: number;
  }>(null);

  // אם לא נמצא ספק, מציג הודעה מתאימה
  if (!vendor) return <div>לא נמצא ספק</div>;

  // דוגמא לנתוני הוצאות קשורות לספק - במערכת אמיתית הנתונים יגיעו מהשרת
  const expenses: Expense[] = [
    {
      id: '1',
      vendor_id: vendor.id,
      vendor_name: vendor.name,
      category: ExpenseCategory.CLEANING,
      description: 'שירות חודשי',
      amount: 1200,
      date: '2024-06-01',
      status: ExpenseStatus.PAID,
      createdAt: '2024-06-01',
      updatedAt: '2024-06-02',
    },
    // ניתן להוסיף עוד הוצאות כאן בעת הצורך
  ];

  // סינון ההוצאות שמשויכות לספק הנבחר
  const vendorExpenses = expenses.filter((e) => e.vendor_id === vendor.id);

  // ספירת כמות ההוצאות
  const expenseCount = vendorExpenses.length;

  // סכום כל ההוצאות של הספק
  const totalExpenses = vendorExpenses.reduce((sum, e) => sum + e.amount, 0);

  // חישוב ממוצע הוצאה או 0 אם אין הוצאות
  const averageExpense = expenseCount > 0 ? parseFloat((totalExpenses / expenseCount).toFixed(2)) : 0;

  // תאריך ההוצאה האחרונה או סימן "-" אם אין הוצאות
  const lastExpenseDate = expenseCount > 0 ? vendorExpenses[expenseCount - 1].date : '-';

  // פונקציה למחיקת ספק עם אישור מהמשתמש וניווט חזרה לרשימת הספקים
  const handleDeleteVendor = () => {
    if (window.confirm('האם את בטוחה שברצונך למחוק את הספק?')) {
      setVendors(vendors.filter((v) => v.id !== id));
      navigate('/vendors');
    }
  };

  return (
    <div className="p-6 space-y-6" dir="rtl">
      {/* כותרת מרכזית */}
      <h2 className="text-2xl font-bold text-center">פרטי ספק</h2>

      {/* כפתורי עריכה ומחיקה, ממוקמים במרכז עם ריווח */}
      <div className="flex justify-center gap-4 mb-6">
        <Button variant="primary" onClick={() => navigate(`/vendors/${vendor.id}/edit`)}>
          ערוך ספק
        </Button>
        <Button variant="accent" onClick={handleDeleteVendor}>
          מחק ספק
        </Button>
      </div>

      {/* פרטי הספק מוצגים ברשת Grid של 2 עמודות, טקסט מיושר לימין */}
      <div className="grid grid-cols-2 gap-4 max-w-xl mx-auto text-right">
        <div><strong>שם:</strong> {vendor.name}</div>
        <div><strong>קטגוריה:</strong> {vendor.category}</div>
        <div><strong>טלפון:</strong> {vendor.phone}</div>
        <div><strong>אימייל:</strong> {vendor.email}</div>
        <div><strong>כתובת:</strong> {vendor.address}</div>
      </div>

      {/* קומפוננטת מסמכים של הספק */}
      {/* <VendorDocuments /> */}

      {/* סיכום כללי של הוצאות הספק */}
      <div className="max-w-xl mx-auto mt-8 space-y-4">
        <h3 className="text-xl font-semibold">סיכום הוצאות</h3>
        <div><strong>סך הכל הוצאות:</strong> {totalExpenses} ₪</div>
        <div><strong>מספר הוצאות:</strong> {expenseCount}</div>
        <div><strong>ממוצע הוצאה:</strong> {averageExpense} ₪</div>
        <div><strong>תאריך הוצאה אחרונה:</strong> {lastExpenseDate}</div>
      </div>

      {/* אם יש הוצאות, מציג טבלה עם פירוט ההוצאות */}
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
