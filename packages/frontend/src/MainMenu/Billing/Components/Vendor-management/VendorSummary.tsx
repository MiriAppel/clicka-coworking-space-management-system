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

export interface FileUploaderProps {
  onFilesUploaded?: (files: FileItem[]) => void;
  onPathReady: (path: string) => void;
  email: string;
  documentCategory: string;
}

export const FolderPathGenerator: React.FC<FileUploaderProps> = ({ email, documentCategory, onPathReady }) => {
  useEffect(() => {
    if (email && documentCategory) {
      const path = `ספקים/${email}/${documentCategory}`;
      onPathReady(path);
    }
  }, [email, documentCategory, onPathReady]);

  return null; // אין ממשק חזותי – הכל מאחורי הקלעים
};

export default function VendorSummary({ vendor }: VendorSummaryProps) {
  const navigate = useNavigate();
  const { fetchExpensesByVendorId, expenses, deleteVendor } = useVendorsStore();

  // סטייטים עבור קטגוריה שנבחרה ונתיב התיקייה
  const [fileCategory, setFileCategory] = useState("חשבוניות ספקים");
  const [folderPath, setFolderPath] = useState("");

  // react-hook-form - יצירת instance
  const methods = useForm({
    defaultValues: {
      documentType: DocumentType.INVOICE, // ערך ברירת מחדל מתאים
    }
  });

  // טוען את ההוצאות כשמשתנה ה-ID של הספק
  useEffect(() => {
    fetchExpensesByVendorId(vendor.id);
  }, [vendor.id, fetchExpensesByVendorId]);

  const vendorExpenses = expenses.filter((e) => e.vendor_id === vendor.id);
  const expenseCount = vendorExpenses.length;
  const totalExpenses = vendorExpenses.reduce((sum, e) => sum + e.amount, 0);
  const averageExpense = expenseCount > 0 ? parseFloat((totalExpenses / expenseCount).toFixed(2)) : 0;
  const lastExpenseDate = expenseCount > 0 ? vendorExpenses[expenseCount - 1].date : "-";

  // מחיקת ספק
  const handleDeleteVendor = async () => {
    if (window.confirm("האם למחוק את הספק?")) {
      await deleteVendor(vendor.id);
      navigate("/vendors");
    }
  };

  // מעקב אחרי שינוי ב-documentType של הטופס ועדכון סטייט הקטגוריה (fileCategory)
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

          {/* יצירת נתיב לפי מייל הספק וקטגוריה שנבחרה */}
          <FolderPathGenerator
            email={vendor.email || ""}
            documentCategory={fileCategory}
            onPathReady={(path) => {
              setFolderPath(path);
            }}
          />

          {/* העלאת קבצים רק אם יש גם ספק וגם נתיב */}
          {vendor && folderPath && (
            <div className="mt-6">
              <FileUploader
                folderPath={folderPath}
                onFilesUploaded={(files) => {
                  console.log("קבצים הועלו:", files);
                  // כאן אפשר להוסיף לוגיקה לרענון קבצים או להודעת הצלחה
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

          {/* כפתור למחיקת ספק */}
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
