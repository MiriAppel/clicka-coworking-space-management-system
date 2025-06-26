// ייבוא ספריות וכלים
import { z } from "zod";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Vendor, VendorCategory } from "shared-types";

// ייבוא קומפוננטות UI מותאמות אישית
import { InputField } from "../../../../Common/Components/BaseComponents/Input";
import { SelectField } from "../../../../Common/Components/BaseComponents/Select";
import { Button } from "../../../../Common/Components/BaseComponents/Button";
import { Form } from "../../../../Common/Components/BaseComponents/Form";

// טיפוס פרופס לקומפוננטה: רשימת ספקים ופונקציית עדכון שלהם
type VendorFormProps = {
  vendors: Vendor[];
  setVendors: React.Dispatch<React.SetStateAction<Vendor[]>>;
};

// הגדרת סכמת ולידציה עם zod
const schema = z.object({
  // שדה שם - מחרוזת לא ריקה
  name: z.string().nonempty("חובה למלא שם"),
  // שדה קטגוריה - בחירה מתוך enum
  category: z.nativeEnum(VendorCategory, {
    errorMap: () => ({ message: "חובה לבחור קטגוריה" }),
  }),
  // שדה טלפון - מחרוזת עם בדיקת Regex למספר תקין
  phone: z
    .string()
    .nonempty("חובה למלא טלפון")
    .refine((val) => /^0\d{8,9}$/.test(val), {
      message: "מספר טלפון לא תקין",
    }),
  // שדה אימייל - מחרוזת עם בדיקת אימייל תקין
  email: z.string().email("אימייל לא תקין").nonempty("חובה למלא אימייל"),
  // שדה כתובת - מחרוזת לא ריקה
  address: z.string().nonempty("חובה למלא כתובת"),
});

// קומפוננטת טופס הספק
export const VendorForm = ({ vendors, setVendors }: VendorFormProps) => {
  // קריאה לפרמטר id מהכתובת לצורך עריכה
  const { id } = useParams();
  // ניווט בין דפים
  const navigate = useNavigate();

  // מציאת ספק לעריכה לפי ה-id מהכתובת
  const editingVendor = vendors.find((v) => v.id === id);

  // אתחול ניהול הטופס עם react-hook-form וקישור לסכמת zod
  const methods = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    mode: "onSubmit", // ביצוע ולידציה רק בעת שליחה
  });

  // אפקט להרצת איפוס שדות אם אנחנו בעריכה
  useEffect(() => {
    if (editingVendor) {
      // איפוס הערכים לטופס עם ערכי הספק הקיים
      methods.reset({
        name: editingVendor.name,
        category: editingVendor.category,
        phone: editingVendor.phone || "",
        email: editingVendor.email || "",
        address: editingVendor.address || "",
      });
    }
  }, [editingVendor, methods]);

  // פונקציית טיפול בשליחה של הטופס
  const handleSubmit = (data: z.infer<typeof schema>) => {
    if (editingVendor) {
      // אם מדובר בעריכה, מעדכנים את הספק הקיים
      const updatedVendor: Vendor = {
        ...editingVendor,
        ...data,
        updatedAt: new Date().toISOString(), // עדכון זמן שינוי
      };
      // מעדכנים את מערך הספקים עם הספק החדש
      setVendors((prev) =>
        prev.map((v) => (v.id === id ? updatedVendor : v))
      );
      alert("הספק עודכן בהצלחה");
    } else {
      // אם זה הוספת ספק חדש
      const newVendor: Vendor = {
        ...data,
        id: (vendors.length + 1).toString(), // יצירת מזהה חדש (פשטני)
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      // הוספת הספק החדש למערך
      setVendors([...vendors, newVendor]);
      alert("הספק נוסף בהצלחה");
    }

    // ניווט חזרה לרשימת הספקים
    navigate("/vendors");
  };

  // מבנה התצוגה של הטופס
  return (
    <div>
      {/* כותרת מרכזית */}
      <h1 className="text-3xl font-bold text-center text-blue-600 my-4">
        {editingVendor ? "עריכת ספק" : "הוספת ספק"}
      </h1>
      {/* קומפוננטת טופס מותאמת אישית - מקבלת פרופס לניהול טופס */}
      <Form
        label={editingVendor ? "ערוך ספק" : "הוסף ספק חדש"}
        schema={schema} // הסכמת ולידציה להצגה שגיאות
        onSubmit={handleSubmit} // פונקציית טיפול בשליחה
        methods={methods} // כלים של react-hook-form
        dir="rtl" // כיוון כתיבה מימין לשמאל
        className="mx-auto mt-10"
      >
        {/* שדות הטופס */}
        <InputField name="name" label="שם" required />
        <SelectField
          name="category"
          label="קטגוריה"
          required
          options={[
            { value: VendorCategory.Services, label: "שירותים" },
            { value: VendorCategory.Equipment, label: "ציוד" },
          ]}
        />
        <InputField name="phone" label="טלפון" required />
        <InputField name="email" label="אימייל" required />
        <InputField name="address" label="כתובת" required />

        {/* כפתור שמירה */}
        <Button variant="primary" size="sm" type="submit">
          שמור
        </Button>
      </Form>
    </div>
  );
};
