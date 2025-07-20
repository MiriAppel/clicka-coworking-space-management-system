// ייבוא ספריות וכלים
import { z } from "zod";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// ייבוא קומפוננטות UI מותאמות אישית
import { InputField } from "../../../../Common/Components/BaseComponents/Input";
import { SelectField } from "../../../../Common/Components/BaseComponents/Select";
import { Button } from "../../../../Common/Components/BaseComponents/Button";
import { Form } from "../../../../Common/Components/BaseComponents/Form";
import { PaymentMethod } from "shared-types";
import { Vendor, VendorCategory } from "shared-types";

// טיפוס פרופס: מערך ספקים ופונקציית עדכון שלהם
type VendorFormProps = {
  vendors: Vendor[];
  setVendors: React.Dispatch<React.SetStateAction<Vendor[]>>;
};

// סכמת ולידציה עם zod לכל השדות
const schema = z.object({
  // שם הספק - חובה
  name: z.string().nonempty("חובה למלא שם"),
  // קטגוריה מתוך enum - חובה
  category: z.nativeEnum(VendorCategory, {
    errorMap: () => ({ message: "חובה לבחור קטגוריה" }),
  }),
  // טלפון - חובה עם בדיקת פורמט
  phone: z.string().nonempty("חובה למלא טלפון").refine((val) => /^0\d{8,9}$/.test(val), {
    message: "מספר טלפון לא תקין",
  }),
  // אימייל - חובה ובדיקה תקינות
  email: z.string().email("אימייל לא תקין").nonempty("חובה למלא אימייל"),
  // כתובת - חובה
  address: z.string().nonempty("חובה למלא כתובת"),
  // איש קשר - חובה
  contact_name: z.string().nonempty("חובה למלא איש קשר"),
  // אתר - אופציונלי
  website: z.string().optional(),
  // ח.פ - אופציונלי
  taxId: z.string().optional(),
  // אמצעי תשלום מועדף - אופציונלי
  preferred_payment_method: z.string().optional(),

  notes: z.string().optional(),
});

// קומפוננטת הטופס
export const VendorForm = ({ vendors, setVendors }: VendorFormProps) => {
  // שליפת מזהה ספק מה-URL
  const { id } = useParams();
  const navigate = useNavigate();

  // חיפוש ספק קיים לעריכה
  const editingVendor = vendors.find((v) => v.id === id);

  // אתחול ניהול טופס עם סכמת Zod
  const methods = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    mode: "onSubmit",
  });

  // טעינת ערכים קיימים אם מדובר בעריכה
  useEffect(() => {
    if (editingVendor) {
      methods.reset({
        name: editingVendor.name,
        category: editingVendor.category,
        phone: editingVendor.phone || "",
        email: editingVendor.email || "",
        address: editingVendor.address || "",
        contact_name: editingVendor.contact_name || "",
        website: editingVendor.website || "",
        taxId: editingVendor.tax_id || "",
        preferred_payment_method: editingVendor.preferred_payment_method,
        notes: editingVendor.notes || "",
      });
    }
  }, [editingVendor, methods]);
  function mapToPaymentMethod(value?: string): PaymentMethod | undefined {
    switch (value) {
      case "CREDIT_CARD":
        return PaymentMethod.CREDIT_CARD;
      case "BANK_TRANSFER":
        return PaymentMethod.BANK_TRANSFER;
      case "CASH":
        return PaymentMethod.CASH;
      case "CHECK":
        return PaymentMethod.CHECK;
      case "OTHER":
        return PaymentMethod.OTHER;
      default:
        return undefined;
    }
  }
  // שליחת טופס
  const handleSubmit = async (data: z.infer<typeof schema>) => {
    try {
      const formattedData = {
        ...data,
        preferred_payment_method: mapToPaymentMethod(data.preferred_payment_method),
      };

      if (editingVendor) {
        // עדכון ספק קיים
        const updatedVendor: Vendor = {
          ...editingVendor,
          ...formattedData,
          updatedAt: new Date().toISOString(),
        };
        setVendors((prev) => prev.map((v) => (v.id === id ? updatedVendor : v)));
        alert("הספק עודכן בהצלחה");
      } else {
        // יצירת ספק חדש
        const response = await fetch("http://localhost:3001/vendor/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formattedData), // כאן אנחנו משתמשים במשתנה שהגדרנו
        });

        if (!response.ok) throw new Error("שגיאה בהוספת ספק");

        const newVendor = await response.json();
        setVendors([...vendors, newVendor]);
        alert("הספק נוסף בהצלחה");
      }

      navigate("/vendors");
    } catch (error) {
      console.error("שגיאה:", error);
      alert("אירעה שגיאה. נסה שוב.");
    }
  };

  return (
    <div>
      {/* כותרת הטופס */}
      <h1 className="text-3xl font-bold text-center text-blue-600 my-4">
        {editingVendor ? "עריכת ספק" : "הוספת ספק"}
      </h1>

      {/* טופס */}
      <Form
        label={editingVendor ? "ערוך ספק" : "הוסף ספק חדש"}
        schema={schema}
        onSubmit={handleSubmit}
        methods={methods}
        dir="rtl"
        className="mx-auto mt-10"
      >
        <InputField name="name" label="שם" required />
        <SelectField
          name="category"
          label="קטגוריה"
          required
          options={[
            { value: VendorCategory.Services, label: "שירותים" },
            { value: VendorCategory.Equipment, label: "ציוד" },
            { value: VendorCategory.Maintenance, label: "תַחזוּקָה" },
            { value: VendorCategory.Other, label: "אחר" },
          ]}
        />
        <InputField name="phone" label="טלפון" required />
        <InputField name="email" label="אימייל" required />
        <InputField name="address" label="כתובת" required />
        <InputField name="contact_name" label="איש קשר" required />
        <InputField name="website" label="אתר אינטרנט" />
        <InputField name="taxId" label="ח.פ" />
        <SelectField
          name="preferred_payment_method"
          label="אמצעי תשלום מועדף"
          options={[
            { value: PaymentMethod.CREDIT_CARD, label: "כרטיס אשראי" },
            { value: PaymentMethod.BANK_TRANSFER, label: "העברה בנקאית" },
            { value: PaymentMethod.CASH, label: "מזומן" },
            { value: PaymentMethod.CHECK, label: "צ'ק" },
            { value: PaymentMethod.OTHER, label: "אחר" },
          ]}
        />

        <InputField name="notes" label="הערות" />

        <Button variant="primary" size="sm" type="submit">
          שמור
        </Button>
      </Form>
    </div>
  );
};
