import { DateISO, DateRangeFilter, FileReference, ID, PaginatedResponse } from "../types/core";
import { CustomerModel, TimelineEventModel } from "../models/customer.model";
import{AddContractDocumentRequest, ConvertLeadToCustomerRequest, Customer, CustomerStatus, CustomerTimeline, GetCustomersRequest, RecordExitNoticeRequest} from '../types/customer'

export const getAllCustomers = async (): Promise<CustomerModel[]> => {
    //אמור לשלוף את כל הלקוחות
    return []; // להחזיר מערך של לקוחות
}

export const getCustomerById = async (id: string): Promise<CustomerModel | null> =>{
    //שולף לקוח לפי ID
return null;
}

export const getCustomerByName = async (name:string):Promise<CustomerModel | null>=>{
    //שולף לקוח לפי שם
return null;
}

export const getCustomerByEmail = async (email:string):Promise<CustomerModel|null>=>{
    //שולף לקוח לפי אימייל
    return null;
}

export const getCustomerByPhone = async (phone:string):Promise<CustomerModel|null>=>{
    //שולף לקוח לפי טלפון
    return null;
}

export const getCustomerByStatus = async (status:CustomerStatus):Promise<CustomerModel[]|null>=>{
    //שליפת לקוחות לפי סטטוס
    return [];
}

export const getByDateJoin= async (dateFrom:Date,dateEnd:Date):Promise<CustomerModel[]|null>=>{
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
export const getCustomersToNotify=async(id:ID):Promise<CustomerModel[]|null>=>{
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
export const postNewContract = async(id:ID):Promise<void>=>{
    //יצירת חוזה חדש
}

export const exportToFile = async(req:GetCustomersRequest) :Promise<Buffer|null>=>{
    //ייצוא תוצאות חיפוש לקובץ
    return null;
}
export const patchStatus = async(id:ID):Promise<void>=>{
    //עדכון הסטטוס
}
export const patchCustomer=async(id:ID):Promise<void>=>{
    //מעדכן חלק מפרטי הלקוח
}


//  export const getAllContracts = async (): Promise<ContractModel[]> => {
//     // אמור לשלוף את כל החוזים
//     return []; // להחזיר מערך של חוזים
// }
// export const updateContractTerms = async (contactId: ID, terms: any): Promise<ContractModel> => {
//     // אמור לעדכן את תנאי החוזה עבור החוזה עם ה-contactId הנתון
//     return; // להחזיר את החוזה המעודכן
// }
// export const getContractById = async (contactId: ID): Promise<ContractModel> => {
//     // אמור לקבל את החוזה עבור ה-contactId הנתון
//     return; // להחזיר את החוזה
// }
// export const getAllContractsByCustomerId = async (customerId: ID): Promise<ContractModel[]> => {
//     // אמור לשלוף את כל החוזים עבור הלקוח עם ה-customerId הנתון
//     return []; // להחזיר מערך של חוזים
// }
// export const getContractsEndingSoon = async (days: number = 30): Promise<ContractModel[]> => {
//     // אמור לשלוף את החוזים שהתוקף שלהם מסתיים בעוד 30 יום
//     return []; // להחזיר מערך של חוזים
// }
// export const getCustomerHistory = async (customerId: ID): Promise<CustomerHistoryModel[]> => {
//     // אמור לשלוף את ההיסטוריה של הלקוח עם ה-customerId הנתון
//     return []; // להחזיר מערך של היסטוריית לקוח
// }

export const getCustomersByPage = async (page: number = 1, pageSize: number = 50): Promise<PaginatedResponse<CustomerModel>> => {
    // אמור לשלוף 50 לקוחות בעמוד הנתון
    return {
        items: [], // להחזיר מערך של לקוחות
        total: 0, // להחזיר את המספר הכולל של הלקוחות
        page: page,
        pageSize: pageSize
    };
}

export const getCustomerTimeline = async (customerId: ID, fromDate?: DateISO, toDate?: DateISO, page?: number, limit?: number): Promise<CustomerTimeline> => {
    // אמור לשלוף את כל האינטראקציות של לקוח לפי מזהה
    // אפשר להוסיף פילטרים לפי תאריך, עמוד ומגבלה
    // להחזיר את האינטראקציות של הלקוח
    const timeLine: CustomerTimeline = {
        customerId,
        events: []
    };
    return timeLine;
}

export const addTimelineEvent = async (customerId: ID, event: { type: string; date: DateISO; description?: string }): Promise<void> => {
    // אמור להוסיף אירוע לאינטראקציות של לקוח
    // האירוע יכול לכלול סוג, תאריך ותיאור
    // להחזיר את האירוע שנוסף
}

export const exportTimeline = async (customerId: ID, filters?: TimelineFilters): Promise<FileReference> => {
    // אמור לייצא את האינטראקציות של לקוח לקובץ CSV
    // אפשר להוסיף פילטרים כמו תאריך, סוג אינטראקציה וכו'
    // להחזיר את המידע של הקובץ שנוצר
    // דוגמה למידע של קובץ שנוצר
    const file: FileReference = {
        id: "file-id",
        name: "timeline-export.csv",
        path: "/exports/timeline-export.csv",
        mimeType: "application/csv",
        size: 1024,
        url: "https://example.com/exports/timeline-export.csv",
        googleDriveId: undefined,
        createdAt: new Date().toISOString() as DateISO,
        updatedAt: new Date().toISOString() as DateISO
    }
    return  file
}


