import { ID } from "../../../../../../backend/src/types/core";

export const ContractList = () => {

//functions


// שליפת כל החוזים של ספק מסוים
const fetchContractsByVendor = async (vendorId: ID): Promise<any[]> => {
//any בקובץ האפיון אין ממשק -חוזה ולכן הםונקציה מחזירה 
 return {} as any[];
};

// פתיחת טופס הוספת חוזה חדש
const handleAddContract = (): void => {};

// פתיחת טופס עריכת חוזה קיים
const handleEditContract = (contractId: ID): void => {};

// מחיקת חוזה
const handleDeleteContract = async (contractId: ID): Promise<void> => {};

// רענון רשימת החוזים
const refreshContractList = (vendorId: ID): Promise<any[]> => {
    return fetchContractsByVendor(vendorId);
};





    return(
        <div>
            <h1>Contract List</h1>
        </div>
    )
}