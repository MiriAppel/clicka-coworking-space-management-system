import { Vendor, VendorCategory, VendorStatus } from "../../../../../../backend/src/types/expense";
import { FileReference, ID } from "../../../../../../backend/src/types/core";
export const SupplierDetails=()=>{
//functions


// שליפת פרטי ספק
const fetchVendorDetails = async (vendorId: ID): Promise<Vendor> => {
 return {} as Vendor;};

// עדכון סטטוס ספק (למשל: הפעלה/השהיה)
const updateVendorStatus = async (vendorId: ID, status: VendorStatus): Promise<Vendor> => {
 return {} as Vendor;};

// מחיקת ספק
const deleteVendor = async (vendorId: ID): Promise<void> => {};

// רענון נתוני ספק
const refreshVendorDetails = (vendorId: ID): Promise<Vendor> => {
    return fetchVendorDetails(vendorId);
};

// שליפת מסמכים של ספק (אם יש תמיכה במסמכים)
const fetchVendorDocuments = async (vendorId: ID): Promise<FileReference[]> => {
    return [];
};

// שליפת דוחות ביצועי ספק (אם יש דוחות)
const fetchVendorReports = async (vendorId: ID): Promise<any> => {};







    return(
        <div>
            <h1>Supplier Details</h1>
        </div>
    )
}