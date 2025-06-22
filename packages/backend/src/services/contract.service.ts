import { Contract, ContractStatus, DateISO, FileReference, ID } from "shared-types";


 export const getAllContracts = async (): Promise<Contract[]> => {
    // אמור לשלוף את כל החוזים
    return []; // להחזיר מערך של חוזים
}
export const updateContractTerms = async (contactId: ID, terms: any): Promise<Contract> => {
    // אמור לעדכן את התנאים של החוזה עבור ה-contactId הנתון
    // הנח שהחוזה הוא אובייקט עם מזהה, תנאים, תאריכים, סטטוס וכו'

    const contract: Contract = {
        id: contactId,
        terms: terms,
        startDate: new Date().toISOString() as DateISO,
        endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString() as DateISO,
        customerId: "customer-id", // הנח שהחוזה שייך ללקוח עם מזהה זה
        status: ContractStatus.ACTIVE, // הנח שהחוזה פעיל
        signDate: undefined, // הנח שהחוזה לא נחתם עדיין
        documents: [], // הנח שאין מסמכים כרגע
        version: 1, // הנח שהחוזה הוא גרסה 1
        createdAt: new Date().toISOString() as DateISO,
        updatedAt: new Date().toISOString() as DateISO,
        signedBy: undefined, // הנח שהחוזה לא נחתם על ידי אף אחד
        witnessedBy: undefined // הנח שהחוזה לא נחתם על ידי עדים
    };
    return contract ; // להחזיר את החוזה המעודכן
}
export const getContractById = async (contactId: ID): Promise<Contract> => {
    // אמור לקבל את החוזה עבור ה-contactId הנתון
    const contract: Contract = {
        id: contactId,
        startDate: new Date().toISOString() as DateISO,
        endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString() as DateISO,
        customerId: "customer-id", // הנח שהחוזה שייך ללקוח עם מזהה זה
        status: ContractStatus.ACTIVE, // הנח שהחוזה פעיל
        signDate: undefined, // הנח שהחוזה לא נחתם עדיין
        documents: [], // הנח שאין מסמכים כרגע
        version: 1, // הנח שהחוזה הוא גרסה 1
        createdAt: new Date().toISOString() as DateISO,
        updatedAt: new Date().toISOString() as DateISO,
        signedBy: undefined, // הנח שהחוזה לא נחתם על ידי אף אחד
        witnessedBy: undefined // הנח שהחוזה לא נחתם על ידי עדים
    };
    return contract; // להחזיר את החוזה
}
export const getAllContractsByCustomerId = async (customerId: ID): Promise<Contract[]> => {
    // אמור לשלוף את כל החוזים עבור הלקוח עם ה-customerId הנתון
    return []; // להחזיר מערך של חוזים
}
export const getContractsEndingSoon = async (days: number = 30): Promise<Contract[]> => {
    // אמור לשלוף את החוזים שהתוקף שלהם מסתיים בעוד 30 יום
    return []; // להחזיר מערך של חוזים
}

// export const postContractDocument = async (document: AddContractDocumentRequest, id: ID): Promise<void> => {
    
//     const contract: ContractModel = {

//         customerId: id,
//         version: 1,
//         status: ContractStatus.DRAFT,
//         signDate: undefined,
//         startDate: undefined,
//         endDate: undefined,
//         terms: undefined,
//         documents: [],
//         signedBy: undefined,
//         witnessedBy: undefined,
//         createdAt: new Date().toISOString(),
//         updatedAt: new Date().toISOString()
//     }
// }

export const postContractDocument = async (documentToAdd: FileReference, id: ID): Promise<void> => {
    const contract = await getContractById(id);
    contract.documents.push(documentToAdd);
}

export const deleteContractDocument= async(id:ID):Promise<void>=>{//איזה מסמך?
    //מחיקת מסמך מהחוזה
}
export const postNewContract = async(data: Contract):Promise<void>=>{
    //יצירת חוזה חדש
}
