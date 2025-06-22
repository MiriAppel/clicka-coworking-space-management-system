import { Vendor, VendorCategory, VendorStatus } from "../../../../../../../types/expense";
import { FileReference, ID } from "../../../../../../../types/core";
import { useSupplierStore } from "../../../../Stores/Billing/supplierStore";
export const SupplierDetails = () => {
    const { fetchVendorDetails, updateVendorStatus, deleteVendor,
        fetchVendorDocuments, fetchVendorReports
    } = useSupplierStore();
    //functions

    //in the store


    // רענון נתוני ספק
    const refreshVendorDetails = (vendorId: ID) => {
        return fetchVendorDetails(vendorId);
    };

    







    return (
        <div>
            <h1>Supplier Details</h1>
        </div>
    )
}