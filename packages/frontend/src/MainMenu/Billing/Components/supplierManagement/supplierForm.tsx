import { Vendor, CreateVendorRequest, UpdateVendorRequest, VendorCategory, VendorStatus } from "../../../../../../backend/src/types/expense";
import { ValidationResult } from "../../../../../../backend/src/types/validationResult";
import { ID } from "../../../../../../backend/src/types/core";
import { useSupplierStore } from "../../../../Stores/Billing/supplierStore";
export const SupplierForm = () => {
    const { fetchVendorDetails, handleFieldChange, validateVendorForm,
        handleCreateVendor, handleUpdateVendor
    } = useSupplierStore();
    //functions
    //in the store


    // איפוס הטופס
    const resetForm = (): void => { };

    // סגירת הטופס (ביטול/סיום)
    const handleCloseForm = (): void => { };


    return <div>
        <h1>Supplier Form</h1>
        {/* Form implementation will go here */}
    </div>;
}