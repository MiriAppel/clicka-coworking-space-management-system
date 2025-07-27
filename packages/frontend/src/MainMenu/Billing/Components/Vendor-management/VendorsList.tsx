import { useNavigate, Link } from "react-router-dom";
import { Vendor } from "shared-types";
import { Button } from "../../../../Common/Components/BaseComponents/Button";
import { Table } from "../../../../Common/Components/BaseComponents/Table";
import React from "react";
import { deleteVendor } from "../../../../Api/vendor-api";

// טיפוס הפרופס: vendors - מערך ספקים, setVendors - פונקציה לעדכון רשימת הספקים
type VendorsListProps = {
  vendors: Vendor[];
  setVendors: React.Dispatch<React.SetStateAction<Vendor[]>>;
};
// פונקציה אסינכרונית לשליפת ספקים מה-API
async function fetchVendors(): Promise<Vendor[]> {
  // קריאת GET לכתובת ה-API לקבלת רשימת ספקים
  const response = await fetch("http://localhost:3001/vendor/", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  // אם הבקשה נכשלה - זריקת שגיאה
  if (!response.ok) {
    throw new Error("Failed to fetch vendors");
  }
  // החזרת המידע כ-JSON
  return response.json();
}
// קומפוננטת רשימת ספקים
export default function VendorsList({ vendors, setVendors }: VendorsListProps) {
  // יצירת ניווט בין עמודים
  const navigate = useNavigate();
  // טעינת רשימת ספקים כאשר הקומפוננטה נטענת
  React.useEffect(() => {
    fetchVendors()
      .then(setVendors) // אם הצליח - עדכון הסטייט
      .catch((error) => {
        console.error("Error fetching vendors:", error);
        setVendors([]); // במקרה של שגיאה - ניקוי הרשימה או טיפול מותאם
      });
  }, [setVendors]);
  const handleDelete = async (vendorId: string) => {
  // שואל את המשתמש האם הוא בטוח שברצונו למחוק
  if (window.confirm("האם למחוק?")) {
    try {
      // קורא לפונקציה שמוחקת את הספק מהשרת
      const success = await deleteVendor(vendorId);
      // אם המחיקה הצליחה
      if (success) {
        // מעדכן את הסטייט ומסיר את הספק מהרשימה המקומית ב-UI
        setVendors(vendors.filter((v) => v.id !== vendorId));
        // מציג הודעת הצלחה למשתמש
        alert("הספק נמחק בהצלחה");
      }
    } catch (error) {
      // במקרה של שגיאה במחיקה בשרת, מציג למשתמש הודעת שגיאה
      alert("אירעה שגיאה במחיקת הספק");
      // מדפיס את השגיאה בקונסול לעזרה בדיבוג
      console.error("Error deleting vendor:", error);
    }
  }
};
  return (
    // מעטפת כללית עם ריווח פנימי
    <div className="p-4">
      {/* שורה עליונה עם כותרת וכפתור הוספה */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">רשימת ספקים</h2>
        {/* קישור לעמוד יצירת ספק חדש */}
        <Link to="/vendors/new">
          <Button variant="primary" size="sm">
            הוסף ספק חדש
          </Button>
        </Link>
      </div>
      {/* טבלת הספקים */}
      <Table
        data={vendors} // העברת המידע לטבלה
        columns={[ // הגדרת עמודות הטבלה
          { header: "שם", accessor: "name" },
          { header: "קטגוריה", accessor: "category" },
          { header: "טלפון", accessor: "phone" },
          { header: "אימייל", accessor: "email" },
          { header: "כתובת", accessor: "address" },
        ]}
        dir="rtl" // הגדרת כיוון מימין לשמאל
        // בעת לחיצה על "עדכון" - ניווט לעמוד עריכה
        onUpdate={(row) => navigate(`/vendors/${row.id}/edit`)}
        // בעת לחיצה על "מחיקה" - קריאה לפונקציית מחיקה
        onDelete={(row) => handleDelete(row.id)}
        // הוספת כפתור "לצפייה" בכל שורה
        renderActions={(row) => (
          <>
            {console.log('צפייה על ספק:', row)}
            <Link to={`/vendors/${row.id}`}>
              <Button size="sm" className="text-blue-600 hover:underline">
                לצפייה
              </Button>
            </Link>
          </>
        )}
      />

    </div>
  );
} 
