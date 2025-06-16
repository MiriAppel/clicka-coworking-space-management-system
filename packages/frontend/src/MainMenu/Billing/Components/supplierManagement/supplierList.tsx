import { SupplierFilter } from "../../../../../../backend/src/types/supplierFilter";
import { ID } from "../../../../../../backend/src/types/core";
import { Vendor } from "../../../../../../backend/src/types/expense";
export const SupplierList = ()=>{

//functions

// שליפת כל הספקים מהשרת
const fetchSuppliers = async (): Promise<Vendor[]> => {
     return {} as Vendor[];
};

// חיפוש ספקים לפי שם/קטגוריה/סטטוס
const handleSearch = (query: string): void => {};

// סינון ספקים לפי קטגוריה/סטטוס
const handleFilter = (filter: SupplierFilter): void => {};

// מעבר לכרטיס ספק (פרטי ספק)
const handleSelectSupplier = (vendorId: ID): void => {};

// פתיחת טופס הוספת ספק חדש
const handleAddSupplier = (): void => {};

// מחיקת ספק
const handleDeleteSupplier = async (vendorId: ID): Promise<void> => {};

// רענון הרשימה (למשל אחרי הוספה/מחיקה)
const refreshSupplierList = (): void => {};



    return <div>



    </div>
}







