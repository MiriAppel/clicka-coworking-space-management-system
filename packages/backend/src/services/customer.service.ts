import { DateISO, DateRangeFilter, FileReference, ID, PaginatedResponse } from "../types/core";
import { CustomerModel, TimelineEventModel } from "../models/customer.model";
import{AddContractDocumentRequest, Contract, ContractStatus, ConvertLeadToCustomerRequest, Customer, CustomerFilter, CustomerStatus, CustomerTimeline, GetCustomersRequest, RecordExitNoticeRequest, TimelineEvent, UpdateCustomerRequest} from '../types/customer'

export const getAllCustomers = async (): Promise<CustomerModel[]> => {
    //אמור לשלוף את כל הלקוחות
    return []; // להחזיר מערך של לקוחות
}

export const getCustomerById = async (id: string): Promise<GetCustomersRequest | null> =>{
    //שולף לקוח לפי ID
return null;
}

export const getCustomerByName = async (name:string):Promise<GetCustomersRequest | null>=>{
    //שולף לקוח לפי שם
return null;
}

export const getCustomerByEmail = async (email:string):Promise<GetCustomersRequest|null>=>{
    //שולף לקוח לפי אימייל
    return null;
}

export const getCustomerByPhone = async (phone:string):Promise<GetCustomersRequest|null>=>{
    //שולף לקוח לפי טלפון
    return null;
}

export const getCustomerByStatus = async (status:CustomerStatus):Promise<GetCustomersRequest[]|null>=>{
    //שליפת לקוחות לפי סטטוס
    return [];
}

export const getByDateJoin= async (dateFrom:Date,dateEnd:Date):Promise<GetCustomersRequest[]|null>=>{
    //חיפוש לקוחות לפי תאריך הצטרפות(מ- עד)
    return null;
}

export const getHistoryChanges = async (id:ID) :Promise<CustomerModel|null>=>{
    //קבלת הסטוריית שינויים של משתמש לפי ID
return null;
}
export const getStatusChanges = async (id:ID):Promise<CustomerStatus[]|null>=>{
    //מחזיר את הסטוריית הסטטוסים של משתמש לפי ID
    return null;
}
export const getAllStatus = async () : Promise<CustomerStatus[]|null>=>{
    //קבלת מצבי סטטוס אפשריים
    return null;
}
export const getCustomersToNotify=async(id:ID):Promise<GetCustomersRequest[]|null>=>{
    //מחזיר את כל הלקוחות שיש לעדכן אותם על שינוי בסטטוס שלהם
    return null;
}

export const putCustomer = async (id:ID):Promise<void>=>{
//עדכון פרטי לקוח
}


export const postExitNotice = async (exitNotice:RecordExitNoticeRequest):Promise<void>=>{
    //הודעת עזיבה
}
export const convertLeadToCustomer =async(newCustomer:ConvertLeadToCustomerRequest):Promise<CustomerModel|null>=>{
    //קריאה לפונקציה getLeadById
    //המרה של ליד ללקוח
    //אין אפשרות של החזרת NULL זה רק בשביל החתימה
    return null;
}
export const postContractDocument=async (document:AddContractDocumentRequest):Promise<void>=>{
    //הוספת מסמך לחוזה
}
export const deleteContractDocument= async(id:ID):Promise<void>=>{//איזה מסמך?
    //מחיקת מסמך מהחוזה
}
export const postNewContract = async(data: Contract):Promise<void>=>{
    //יצירת חוזה חדש
}

export const exportToFile = async(req:GetCustomersRequest) :Promise<Buffer|null>=>{
    //ייצוא תוצאות חיפוש לקובץ
    return null;
}
export const patchStatus = async(id:ID):Promise<void>=>{
    //עדכון הסטטוס
}
export const patchCustomer=async(id:ID, data: UpdateCustomerRequest):Promise<void>=>{
    //מעדכן חלק מפרטי הלקוח
}


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
        modifications: [],
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
        modifications: [],
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
// export const getCustomerHistory = async (customerId: ID): Promise<CustomerHistory[]> => {
//     // אמור לשלוף את ההיסטוריה של הלקוח עם ה-customerId הנתון
//     return []; // להחזיר מערך של היסטוריית לקוח
// }

export const getCustomersByPage = async (page: number = 1, pageSize: number = 50): Promise<PaginatedResponse<CustomerModel>> => {
    // אמור לשלוף 50 לקוחות בעמוד הנתון
    return {
        data: [],
        meta: {
            currentPage: page,
            totalPages: 1,
            pageSize: pageSize,
            totalCount: 0,
            hasNext: false,
            hasPrevious: false,
        }
    };

}

export const getCustomerTimeline = async (customerId: ID): Promise<CustomerTimeline> => {
    return {
        customerId: customerId,
        events: [],
        totalEvents: 0,
    };
}

export const addTimelineEvent = async (data: TimelineEvent): Promise<void> => {
    // אמור להוסיף אירוע לאינטראקציות של לקוח
    // האירוע יכול לכלול סוג, תאריך ותיאור
    // להחזיר את האירוע שנוסף
}

export const exportTimeline = async (customerId: ID, filters?:CustomerFilter ): Promise<FileReference> => {
    // אמור לייצא את היסטוריית האירועים של לקוח לקובץ
    // להחזיר קישור לקובץ המיוצא
    return {
        id: "file-id",
        name: "timeline-export.json",
        path: `/exports/${customerId}/timeline-export.json`,
        mimeType: "application/json",
        size: 0, // גודל הקובץ, ניתן לחשב לאחר הייצוא   
        url: `https://example.com/exports/${customerId}/timeline-export.json`,
        createdAt: new Date().toISOString() as DateISO,
        updatedAt: new Date().toISOString() as DateISO,
    };

}


