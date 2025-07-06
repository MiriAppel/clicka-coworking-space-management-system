import { useNavigate, Link } from "react-router-dom";
import { Vendor, VendorCategory } from "shared-types";

import { Button } from "../../../../Common/Components/BaseComponents/Button";
import { Table } from "../../../../Common/Components/BaseComponents/Table";

// טיפוס הפרופס: מערך ספקים ופונקציה לעדכון
type VendorsListProps = {
  vendors: Vendor[];
  setVendors: React.Dispatch<React.SetStateAction<Vendor[]>>;
};

// קומפוננטת רשימת ספקים
export default function VendorsList({ vendors, setVendors }: VendorsListProps) {
  // שימוש ב-hook לניווט בין מסכים
  const navigate = useNavigate();

  // פונקציה למחיקת ספק מתוך הרשימה
  const handleDelete = (vendorId: string) => {
    // אישור מהמשתמש לפני המחיקה
    if (window.confirm("האם למחוק?")) {
      // עדכון רשימת הספקים - מחיקת הספק לפי מזהה
      setVendors(vendors.filter((v) => v.id !== vendorId));
    }
  };

  return (
    <div className="p-4">
      {/* כותרת וכפתור הוספת ספק חדש בצד ימין */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">רשימת ספקים</h2>
        <Link to="/vendors/new">
          <Button variant="primary" size="sm">הוסף ספק חדש</Button>
        </Link>
      </div>

      {/* טבלת הספקים */}
      <Table
        data={vendors} // נתוני הספקים שיוצגו בטבלה
        columns={[ // הגדרת עמודות הטבלה
          { header: "שם", accessor: "name" },
          { header: "קטגוריה", accessor: "category" },
          { header: "טלפון", accessor: "phone" },
          { header: "אימייל", accessor: "email" },
          { header: "כתובת", accessor: "address" },
        ]}
        dir="rtl" // כיוון קריאה מימין לשמאל
        // פונקציית עדכון - ניווט לעמוד העריכה של הספק הנבחר
        onUpdate={(row) => navigate(`/vendors/${row.id}/edit`)}
        // פונקציית מחיקה - מחיקת הספק הנבחר
        onDelete={(row) => handleDelete(row.id)}
        // פונקציית רינדור לפעולות נוספות בטור, כאן כפתור צפייה בפרטי הספק
        renderActions={(row) => (
          <Link to={`/vendors/${row.id}`}>
            <Button size="sm" className="text-blue-600 hover:underline">
              לצפייה
            </Button>
          </Link>
        )}
      />
    </div>
  );
}
