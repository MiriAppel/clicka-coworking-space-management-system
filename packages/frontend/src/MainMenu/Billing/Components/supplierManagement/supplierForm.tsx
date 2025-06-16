import { Vendor, CreateVendorRequest, UpdateVendorRequest, VendorCategory, VendorStatus } from "../../../../../../backend/src/types/expense";
import { ValidationResult } from "../../../../../../backend/src/types/validationResult";
import { ID } from "../../../../../../backend/src/types/core";
export const SupplierForm =()=>{

//functions

// שליפת פרטי ספק לעריכה (אם במצב עריכה)
const fetchVendorDetails = async (vendorId: ID): Promise<Vendor> => {
 return {} as Vendor;};

// טיפול בשינוי ערך שדה בטופס
const handleFieldChange = (field: keyof CreateVendorRequest | keyof UpdateVendorRequest, value: any): void => {};

// ולידציה של הטופס לפני שליחה
const validateVendorForm = (data: CreateVendorRequest | UpdateVendorRequest): ValidationResult => {
 return {} as ValidationResult;};

// שליחת טופס יצירת ספק חדש
const handleCreateVendor = async (data: CreateVendorRequest): Promise<Vendor> => {
 return {} as Vendor;
};

// שליחת טופס עדכון ספק קיים
const handleUpdateVendor = async (vendorId: ID, data: UpdateVendorRequest): Promise<Vendor> => {
    return {} as Vendor;
};

// איפוס הטופס
const resetForm = (): void => {};

// סגירת הטופס (ביטול/סיום)
const handleCloseForm = (): void => {};












    return <div>
        <h1>Supplier Form</h1>
        {/* Form implementation will go here */}
    </div>;
}