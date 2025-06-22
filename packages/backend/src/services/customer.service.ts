import { CustomerModel } from "../models/customer.model";
import { supabase } from "../db/supabaseClient";
import { LeadModel } from "../models/lead.model";
import { getLeadById } from "./lead.service";
import { ConvertLeadToCustomerRequest, CustomerStatus, DateISO, ExitReason, FileReference, GetCustomersRequest, ID, PaginatedResponse, RecordExitNoticeRequest, TimelineEventType, UpdateCustomerRequest } from "shared-types";


export const getAllCustomers = async (): Promise<CustomerModel[]> => {

    const { data , error } = await supabase
        .from('customers')
        .select('*');

    if (error) {
        console.error('Error fetching customers:', error);
        throw new Error('Failed to fetch customers');   
    }

    if(!data) {
        console.error('No customers found');
        throw new Error('No customers found');
    }

    return data;
}

export const getCustomerById = async (id: string): Promise<GetCustomersRequest | null> =>{

    const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error fetching customer by ID:', error);
        throw new Error('Failed to fetch customer by ID');
    }

    if (!data) {
        console.warn(`No customer found with ID: ${id}`);
        return null; 
    }

    return data as GetCustomersRequest; 
}

export const getCustomerByName = async (name:string):Promise<GetCustomersRequest[] | null>=>{

    const { data, error } = await supabase
        .from('customers')
        .select('*')
        .ilike('name', `%${name}%`) // מחפש לפי שם בלי להתייחס ךאותויות גדולות/קטנות וכל מה שכלול בשם
        .order('name', { ascending: true }) // מחזיר את זה ממוין לפי שם

    if (error) {
        console.error('Error fetching customer by name:', error);
        throw new Error('Failed to fetch customer by name');
    }

    if (!data) {
        console.warn(`No customer found with name: ${name}`);
        return null;
    }

    return data as GetCustomersRequest[];
}

export const getCustomerByEmail = async (email:string):Promise<GetCustomersRequest|null>=>{
    
    const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('email', email)
        .single();

    if (error) {
        console.error('Error fetching customer by email:', error);
        throw new Error('Failed to fetch customer by email');
    }

    if (!data) {
        console.warn(`No customer found with email: ${email}`);
        return null; 
    }

    return data as GetCustomersRequest;
}

export const getCustomerByPhone = async (phone:string):Promise<GetCustomersRequest|null>=>{
    
    const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('phone', phone)
        .single();

    if (error) {
        console.error('Error fetching customer by phone:', error);
        throw new Error('Failed to fetch customer by phone');
    }   

    if (!data) {
        console.warn(`No customer found with phone: ${phone}`);
        return null;
    }

    return data as GetCustomersRequest;
}

export const getCustomerByStatus = async (status:CustomerStatus):Promise<GetCustomersRequest[]|null> => {

    const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('status', status);

    if (error) {
        console.error('Error fetching customers by status:', error);
        throw new Error('Failed to fetch customers by status');
    }

    if (!data || data.length === 0) {
        console.warn(`No customers found with status: ${status}`);
        return null; 
    }

    return data as GetCustomersRequest[];
}

export const getByDateJoin= async (dateFrom:Date, dateEnd:Date):Promise<GetCustomersRequest[]|null>=>{

    const { data, error } = await supabase
        .from('customers')
        .select('*')
        .gte('date_joined', dateFrom.toISOString())
        .lte('date_joined', dateEnd.toISOString());

    if (error) {
        console.error('Error fetching customers by join date:', error);
        throw new Error('Failed to fetch customers by join date');
    }

    if (!data || data.length === 0) {
        console.warn(`No customers found between ${dateFrom} and ${dateEnd}`);
        return null; 
    }

    return data as GetCustomersRequest[];
}

// export const getStatusChanges = async (id:ID): Promise<CustomerStatus[] | null> => {
   
//     const customer: GetCustomersRequest | null = await getCustomerById(id);

//     if (customer && customer.status) {
//         const statuses: CustomerStatus[] = customer.status;
//         return statuses;
//     } else {
//         console.warn(`No status changes found for customer with ID: ${id}`);
//         return null; 
//     }
// }

export const getAllStatus = async (): Promise<CustomerStatus[]|null> => {

    return Object.values(CustomerStatus) as CustomerStatus[];
}

export const getCustomersToNotify = async(id: ID): Promise<GetCustomersRequest[] | null> => {

    return [];
}

export const putCustomer = async (id: ID, customerToUpdate: CustomerModel): Promise<void>=>{

    const { data, error } = await supabase
        .from('customer')
        .update(customerToUpdate)
        .eq('id',id)

    if (error) {
        console.error('Error updating customer:', error);
        throw new Error('Failed to update customer');
    }

}

export const getExitReasonDisplay = async (reason: ExitReason): Promise<string> => {

    switch (reason) {
        case ExitReason.RELOCATION: return "מעבר דירה";
        case ExitReason.BUSINESS_CLOSED: return "סגירת עסק";
        case ExitReason.PRICE: return "מחיר";
        case ExitReason.WORK_FROM_HOME: return "עבודה מהבית";
        case ExitReason.SPACE_NEEDS: return "צרכי חלל";
        case ExitReason.DISSATISFACTION: return "חוסר שביעות רצון";
        case ExitReason.OTHER: return "אחר";
        default: return reason;
    }
}

export const postExitNotice = async (exitNotice: RecordExitNoticeRequest): Promise<void> => {

   //עדכון הסטטוס 
   patchStatus(exitNotice.customerId, CustomerStatus.NOTICE_GIVEN);

   const { data, error } = await supabase
        .from('exit_noticesModel')
        .insert(exitNotice)

    if (error) {
        console.error('Insert failed:', error);
    } else {
        console.log('Insert successful:', data);
    }

    const timeline: TimelineEventType = {

        type: TimelineEventType.STATUS_CHANGE,
        date: exitNotice.exitNoticeDate,
        title: `הודעת עזיבה התקבלה (${getExitReasonDisplay(exitNotice.exitReason)})`, // כותרת יותר אינפורמטיבית
        description: `תאריך הודעה: ${exitNotice.exitNoticeDate}, תאריך עזיבה מתוכנן: ${exitNotice.plannedExitDate}` +
                 (exitNotice.exitReasonDetails ? ` - פרטים נוספים: ${exitNotice.exitReasonDetails}` : ''),   
        relatedId: exitNotice.customerId

    };

    await addTimelineEvent(timeline);

    //ליצור התראה שהלקוח עוזה - קשור לקבוצה 1

    // לעדכן את מערכת החיוב לגבי סיום השירות או חישוב חיוב סופי
    // קשור לקבוצת billing

}


export const convertLeadToCustomer =async(newCustomer: ConvertLeadToCustomerRequest): Promise<CustomerModel> => {

    // const lead: LeadModel = await getLeadById(newCustomer.leadId);
    const leadData = await getLeadById(newCustomer.leadId);
    if (!leadData) {
        throw new Error("Lead not found");
    }
    const lead: LeadModel = leadData;

    // המרה של ליד ללקוח
    const customerData: CustomerModel = {
        name: lead.name,
        email: lead?.email,
        phone: lead?.phone,
        idNumber: lead?.idNumber,
        businessName: newCustomer.businessName,
        businessType: lead?.businessType,
        status: CustomerStatus.ACTIVE,
        currentWorkspaceType: newCustomer.workspaceType,
        workspaceCount: newCustomer.workspaceCount,
        contractSignDate: newCustomer.contractSignDate,
        contractStartDate: newCustomer.contractStartDate,
        billingStartDate: newCustomer.billingStartDate,
        notes: newCustomer.notes,
        invoiceName: newCustomer.invoiceName,
        contractDocuments: newCustomer.contractDocuments,
        paymentMethodsType: newCustomer.paymentMethod ? [newCustomer.paymentMethod] : [],
        periods: [],
        contracts: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    customerData.
    

    //לפני היצירה יש לבדוק שהחלל באמת פנוי צריך לפנות לקבוצה 3

    // יצירת לקוח במסד הנתונים
    const { data, error } = await supabase
        .from('customers')
        .insert([customerData])
        .single();

    if (error) {
        console.error('Error converting lead to customer:', error);
        throw new Error('Failed to convert lead to customer');
    }

    //יש להעביר את פרטי הלקוח והחוזה למערכת החיוב (של Team 4 - Billing) לצורך חישוב תמחור והכנת חיובים ראשוניים.

    // קריאה לשירותי התראות/מייל מתאימים לאחר המרה מוצלחת קשור לקבוצה 1

    // עדכון סטטוס הליד ל-CONVERTED
    await updateLeadStatus(lead.id, 'CONVERTED');

    const timeline: TimelineEventType = {

        type: TimelineEventType.CONVERSION,
        date: new Date().toISOString(),
        title: 'ליד הומר ללקוח',
        description: `ליד ${lead.id} הומר ללקוח חדש ${customerData.id}.`,
        relatedId: lead.id
    };

    await addTimelineEvent(timeline);

    return data as CustomerModel;
}



export const exportToFile = async(req:GetCustomersRequest) :Promise<Buffer|null>=>{
    //ייצוא תוצאות חיפוש לקובץ
    return null;
}
export const patchStatus = async(id:ID, statusToUpdate: CustomerStatus):Promise<void>=>{
    //עדכון הסטטוס
}
export const patchCustomer=async(id:ID, data: UpdateCustomerRequest):Promise<void>=>{
    //מעדכן חלק מפרטי הלקוח
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

export const addTimelineEvent = async (data: TimelineEventType): Promise<void> => {
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



function updateLeadStatus(id: string | undefined, arg1: string) {
    throw new Error("Function not implemented.");
}


export const filterCustomers = async (filter: any): Promise<any> => {



}

