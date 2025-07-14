// ייבוא רכיבים וספריות רלוונטיות
import { useNavigate, Link } from "react-router-dom";
import { Vendor } from "shared-types";
import { Button } from "../../../../Common/Components/BaseComponents/Button";
import React, { useState, useEffect } from "react";
import { deleteVendor } from "../../../../Api/vendor-api";
import { FaTrash, FaPen, FaEye } from "react-icons/fa";
import VendorSummary from "./VendorSummary";

// טיפוס עבור פרופס שמקבל הקומפוננטה
type VendorsListProps = {
  vendors: Vendor[];
  setVendors: React.Dispatch<React.SetStateAction<Vendor[]>>;
};

// פונקציה לשליפת רשימת ספקים מהשרת
async function fetchVendors(): Promise<Vendor[]> {
  const response = await fetch("http://localhost:3001/vendor/", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) throw new Error("שגיאה בשליפת ספקים");
  return response.json();
}

// קומפוננטת רשימת ספקים
export default function VendorsList({ vendors, setVendors }: VendorsListProps) {
  const navigate = useNavigate();
  const [selectedVendorId, setSelectedVendorId] = useState<string | null>(null);

  // סטייט לחיפוש טקסט
  const [searchTerm, setSearchTerm] = useState<string>("");

  // טוען ספקים מהשרת בעת טעינת הקומפוננטה
  useEffect(() => {
    fetchVendors()
      .then(setVendors)
      .catch((error) => {
        console.error("שגיאה בשליפת ספקים:", error);
        setVendors([]);
      });
  }, [setVendors]);

  // פונקציה למחיקת ספק
  const handleDelete = async (vendorId: string) => {
    if (window.confirm("האם למחוק את הספק?")) {
      try {
        const success = await deleteVendor(vendorId);
        if (success) {
          setVendors(vendors.filter((v) => v.id !== vendorId));
          alert("הספק נמחק בהצלחה");
        }
      } catch (error) {
        alert("שגיאה במחיקת ספק");
        console.error("Error:", error);
      }
    }
  };

  // מסנן ספקים לפי שורת החיפוש
  const filteredVendors = vendors.filter((vendor) =>
    [vendor.name, vendor.phone, vendor.email, vendor.address, vendor.category]
      .some((field) => field?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // תצוגת ממשק המשתמש
  return (
    <div className="p-4">
      {/* כותרת עליונה וכפתור להוספת ספק */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">רשימת ספקים</h2>
        <Link to="/vendors/new">
          <Button variant="primary" size="sm">הוסף ספק חדש</Button>
        </Link>
      </div>

      {/* שדה חיפוש */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="חפש לפי שם, טלפון, מייל, כתובת או קטגוריה"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border px-3 py-2 rounded w-full max-w-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
      </div>

      {/* רשימת כרטיסי ספקים */}
      <div className="flex flex-wrap gap-4">
        {filteredVendors.length > 0 ? (
          filteredVendors.map((vendor) => (
            <div
              key={vendor.id}
              className={`p-4 border rounded-lg shadow-md bg-white transition-all duration-300 ${
                selectedVendorId === vendor.id ? "w-full" : "w-64"
              }`}
            >
              {/* פרטי הספק */}
              <p className="font-semibold">שם: {vendor.name}</p>
              <p className="font-semibold">קטגוריה: {vendor.category}</p>
              <p className="font-semibold">טלפון: {vendor.phone}</p>
              <p className="font-semibold">אימייל: {vendor.email}</p>
              <p className="font-semibold">כתובת: {vendor.address}</p>

              {/* כפתורי פעולה: צפייה, עריכה, מחיקה */}
              <div className="flex gap-2 mt-4 justify-center">
                <button
                  onClick={() => setSelectedVendorId(selectedVendorId === vendor.id ? null : vendor.id)}
                  className="text-blue-500 hover:text-blue-700"
                  title="צפייה"
                >
                  <FaEye />
                </button>
                <button
                  onClick={() => navigate(`/vendors/${vendor.id}/edit`)}
                  className="text-yellow-500 hover:text-yellow-700"
                  title="עריכה"
                >
                  <FaPen />
                </button>
                <button
                  onClick={() => handleDelete(vendor.id)}
                  className="text-red-500 hover:text-red-700"
                  title="מחיקה"
                >
                  <FaTrash />
                </button>
              </div>

              {/* תצוגה מורחבת של הספק במקרה של צפייה */}
              {selectedVendorId === vendor.id && (
                <VendorSummary vendor={vendor} />
              )}
            </div>
          ))
        ) : (
          <p>לא נמצאו ספקים</p>
        )}
      </div>
    </div>
  );
}
