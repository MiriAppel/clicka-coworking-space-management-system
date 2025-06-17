import { ID } from "../../../../../../backend/src/types/core";
import { useSupplierStore } from "../../../../Stores/Billing/supplierStore";

export const ContractList = () => {
const{fetchContractsByVendor,handleDeleteContract}=useSupplierStore();
//functions

//in the store


// פתיחת טופס הוספת חוזה חדש
const handleAddContract = (): void => {};

// פתיחת טופס עריכת חוזה קיים
const handleEditContract = (contractId: ID): void => {};

// רענון רשימת החוזים
const refreshContractList = (vendorId: ID): Promise<any> => {
    return fetchContractsByVendor(vendorId);
};





    return(
        <div>
            <h1>Contract List</h1>
        </div>
    )
}