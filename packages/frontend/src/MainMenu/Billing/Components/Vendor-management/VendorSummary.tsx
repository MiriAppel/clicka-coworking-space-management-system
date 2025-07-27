import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, FormProvider } from "react-hook-form";
import { Table } from "../../../../Common/Components/BaseComponents/Table";
import { useVendorsStore } from "../../../../Stores/Billing/vendorsStore";
import { Vendor, DocumentType } from "shared-types";
import FileUploader, { FileItem } from '../../../../Common/Components/BaseComponents/FileUploader/FileUploader';
import { SelectField } from "../../../../Common/Components/BaseComponents/Select";

// טיפוס לפרופס של הקומפוננטה - כולל אפשרות ל-folderId אם יש
type VendorSummaryProps = {
  vendor: Vendor & { folderId?: string };
};

// טיפוס לפרופס של קומפוננטת יצירת הנתיב - כולל שם הספק ל
export interface FileUploaderProps {
  onFilesUploaded?: (files: FileItem[]) => void;
  onPathReady: (path: string) => void;
  vendorName: string;            
  documentCategory: string;
}

// קומפוננטה שיוצרת את נתיב התיקייה לפי שם הספק וקטגוריית המסמך
export const FolderPathGenerator: React.FC<FileUploaderProps> = ({ vendorName, documentCategory, onPathReady }) => {
  useEffect(() => {
    // אם יש שם ספק וקטגוריה, יוצרים נתיב בתבנית "ספקים/שם הספק/קטגוריה"
    if (vendorName && documentCategory) {
      const path = `ספקים/${vendorName}/${documentCategory}`;
      onPathReady(path); // מעדכנים את הנתיב בקומפוננטה ההורה
    }
  }, [vendorName, documentCategory, onPathReady]);

  return null; // אין ממשק חזותי - כל העבודה היא פנימית בלבד
};

export default function VendorSummary({ vendor }: VendorSummaryProps) {
  const navigate = useNavigate();
  const { fetchExpensesByVendorId, expenses, deleteVendor } = useVendorsStore();

  // סטייט לשמירת קטגוריית הקובץ שנבחרה
  const [fileCategory, setFileCategory] = useState("חשבוניות ספקים");
  // סטייט לשמירת נתיב התיקייה שנוצר
  const [folderPath, setFolderPath] = useState("");

  // יצירת instance של react-hook-form לניהול הטופס
  const methods = useForm({
    defaultValues: {
      documentType: DocumentType.INVOICE, // ברירת מחדל לסוג המסמך
    }
  });

  // טוען הוצאות של הספק לפי ה-ID שלו בכל שינוי של ה-ID
  useEffect(() => {
    fetchExpensesByVendorId(vendor.id);
  }, [vendor.id, fetchExpensesByVendorId]);

  // סינון ההוצאות רק של הספק הנוכחי
  const vendorExpenses = expenses.filter((e) => e.vendor_id === vendor.id);

  // חישובים סטטיסטיים על ההוצאות
  const expenseCount = vendorExpenses.length;
  const totalExpenses = vendorExpenses.reduce((sum, e) => sum + e.amount, 0);
  const averageExpense = expenseCount > 0 ? parseFloat((totalExpenses / expenseCount).toFixed(2)) : 0;
  const lastExpenseDate = expenseCount > 0 ? vendorExpenses[expenseCount - 1].date : "-";

  // פונקציה למחיקת ספק עם אישור משתמש
  const handleDeleteVendor = async () => {
    if (window.confirm("האם למחוק את הספק?")) {
      await deleteVendor(vendor.id);
      navigate("/vendors"); // מעבירים את המשתמש לדף רשימת הספקים
    }
  };

  // מאזין לשינויים בטופס - מעדכן את קטגוריית הקובץ לפי סוג המסמך שנבחר
  useEffect(() => {
    const subscription = methods.watch((value) => {
      if (value.documentType) {
        setFileCategory(value.documentType);
      }
    });
    return () => subscription.unsubscribe();
  }, [methods]);

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit((data) => {
        console.log("Form submitted with data:", data);
      })}>
        <div className="p-4 border-t mt-4 text-sm">
          {/* פרטי הספק */}
          <div className="grid grid-cols-2 gap-4">
            <div><strong>שם:</strong> {vendor.name}</div>
            <div><strong>קטגוריה:</strong> {vendor.category}</div>
            <div><strong>טלפון:</strong> {vendor.phone}</div>
            <div><strong>אימייל:</strong> {vendor.email}</div>
            <div><strong>כתובת:</strong> {vendor.address}</div>
          </div>

          {/* בחירת סוג מסמך */}
          <div className="mt-6">
            <SelectField
              name="documentType"
              label="סוג מסמך"
              options={[
                { value: DocumentType.INVOICE, label: 'חשבונית' },
                { value: DocumentType.RECEIPT, label: 'קבלה' },
                { value: DocumentType.CREDIT_NOTE, label: 'זיכוי' },
                { value: DocumentType.STATEMENT, label: 'דוח' },
                { value: DocumentType.TAX_INVOICE, label: 'חשבונית מס' },
              ]}
            />
          </div>

          {/* יצירת נתיב לפי שם הספק וקטגוריה שנבחרה */}
          <FolderPathGenerator
            vendorName={vendor.name || ""}       
            documentCategory={fileCategory}
            onPathReady={(path) => {
              setFolderPath(path);     /* מעדכנים את נתיב התיקייה בסטייט */
            }}
          />

          {/* העלאת קבצים רק אם יש גם ספק וגם נתיב */}
          {vendor && folderPath && (
            <div className="mt-6">
              <FileUploader
                folderPath={folderPath}
                onFilesUploaded={(files) => {
                  console.log("קבצים הועלו:", files);
                  // ניתן להוסיף כאן לוגיקה נוספת אחרי העלאת הקבצים
                }}
              />
            </div>
          )}

          {/* סיכום הוצאות */}
          <div className="mt-4 space-y-2">
            <div><strong>סך הוצאות:</strong> {totalExpenses} ₪</div>
            <div><strong>מספר הוצאות:</strong> {expenseCount}</div>
            <div><strong>ממוצע הוצאה:</strong> {averageExpense} ₪</div>
            <div><strong>תאריך הוצאה אחרונה:</strong> {lastExpenseDate}</div>
          </div>

          {/* טבלת הוצאות אם קיימת לפחות אחת */}
          {vendorExpenses.length > 0 && (
            <div className="mt-4">
              <Table
                columns={[
                  { header: "סכום", accessor: "amount" },
                  { header: "קטגוריה", accessor: "category" },
                  { header: "תיאור", accessor: "description" },
                  { header: "תאריך", accessor: "date" },
                  { header: "סטטוס", accessor: "status" },
                ]}
                data={vendorExpenses}
                dir="rtl"
              />
            </div>
          )}

          {/* כפתורים לשמירה ומחיקה */}
          <div className="mt-6">
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              שמור
            </button>
            <button
              type="button"
              onClick={handleDeleteVendor}
              className="ml-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              מחק ספק
            </button>
          </div>
        </div>
      </form>
    </FormProvider>
  );
}
