<<<<<<< HEAD
import { CustomerModel } from "../models/customer.model";
import { supabase } from "../db/supabaseClient";
import { LeadModel } from "../models/lead.model";
import { getLeadById } from "./lead.service";
import { ConvertLeadToCustomerRequest, CustomerStatus, DateISO, ExitReason, FileReference, GetCustomersRequest, ID, PaginatedResponse, RecordExitNoticeRequest, TimelineEventType, UpdateCustomerRequest } from "shared-types";
=======
import { ID, PaginatedResponse } from "../../../../types/core";
import { CustomerModel } from "../models/customer.model";
import { ConvertLeadToCustomerRequest,CustomerStatus, GetCustomersRequest, RecordExitNoticeRequest, UpdateCustomerRequest, CustomerPeriod} from '../../../../types/customer'
import { supabase } from "../db/supabaseClient";
import { baseService } from "./baseService";
import { createObjectCsvStringifier } from "csv-writer";
import { leadService } from "./lead.service";
>>>>>>> origin/main

export class customerService extends baseService <CustomerModel> {

    constructor() {
        super("CustomerModel")
    }

    //מחזיר את כל הסטטוסים של הלקוח
    getAllCustomerStatus = async (): Promise <CustomerStatus[]|null> => {

        return Object.values(CustomerStatus) as CustomerStatus[];

    }

    //לא הבנתי מה היא צריכה לעשות
    getCustomersToNotify = async(id: ID): Promise<GetCustomersRequest[] | null> => {

        return [];
    }
    
    // המרת ליד ללקוח
    convertLeadToCustomer = async (newCustomer: ConvertLeadToCustomerRequest): Promise <CustomerModel> => {

        const serviceLead = new leadService();
        
        const leadData = await serviceLead.getById(newCustomer.leadId);

        if (!leadData) {
            throw new Error('Lead data not found for the provided leadId');
        }
        // המרה של ליד ללקוח
        const customerData: CustomerModel = {
            id:leadData.id,
            name: leadData.name,
            email: leadData.email,
            phone: leadData.phone,
            idNumber: leadData.idNumber,
            businessName: newCustomer.businessName,
            businessType: leadData.businessType,
            status: CustomerStatus.ACTIVE,
            currentWorkspaceType: newCustomer.workspaceType,
            workspaceCount: newCustomer.workspaceCount,
            contractSignDate: newCustomer.contractSignDate,
            contractStartDate: newCustomer.contractStartDate,
            billingStartDate: newCustomer.billingStartDate,
            notes: newCustomer.notes,
            invoiceName: newCustomer.invoiceName,
            contractDocuments: newCustomer.contractDocuments,
            paymentMethodsType: newCustomer.paymentMethodType,
            periods: [],
            contracts: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        //לפני היצירה יש לבדוק שהחלל באמת פנוי צריך לפנות לקבוצה 3

        await this.post(customerData);

        //יש להעביר את פרטי הלקוח והחוזה למערכת החיוב (של Team 4 - Billing) לצורך חישוב תמחור והכנת חיובים ראשוניים.

        // קריאה לשירותי התראות/מייל מתאימים לאחר המרה מוצלחת קשור לקבוצה 1

        return customerData;
    };

    // יצרית הודעת עזיבה של לקוח
    postExitNotice = async (exitNotice: RecordExitNoticeRequest, id: ID): Promise<void> => {

        const updateStatus: UpdateCustomerRequest = {
            status: CustomerStatus.PENDING
        };

        await this.patch(updateStatus as CustomerModel, id);

        const customerLeave: CustomerModel | null = await this.getById(id);

        if (customerLeave){
            // יצירת תקופת עזיבה ללקוח
            const period: CustomerPeriod = {
                id: id,
                customerId: id,
                entryDate: new Date().toISOString(),
                exitDate: new Date().toISOString(),
                exitNoticeDate: exitNotice.exitNoticeDate,
                exitReason: exitNotice.exitReason,
                exitReasonDetails: exitNotice.exitReasonDetails,
                createdAt: customerLeave.createdAt,
                updatedAt: customerLeave.updatedAt
            };
            customerLeave.periods = [period];
        }

        await this.patch(customerLeave ,customerLeave.id);

            //ליצור התראה שהלקוח עוזב - קשור לקבוצה 1

            // לעדכן את מערכת החיוב לגבי סיום השירות או חישוב חיוב סופי
            // קשור לקבוצת billing
    }

    //מחזיר את כל הלקוחות רק של העמוד הראשון
    getCustomersByPage = async (page: number = 1, pageSize: number = 50): Promise<PaginatedResponse<CustomerModel>> => {
    
        const from = (page - 1) * pageSize;
        const to = from + pageSize - 1;

        const { data, error, count } = await supabase
            .from('CustomerModel')
            .select('*', { count: 'exact' }) // count: 'exact' סופר את כל התוצאות
            .range(from, to)
            .order('createdAt', { ascending: false }); // ממיין 

        if (error) {
            console.error('Error fetching customers by page:', error);
            throw new Error('Failed to fetch paginated customers');
        }

        const totalPages = count ? Math.ceil(count / pageSize) : 1;

        return {
            data: data as CustomerModel[],
            meta: {
                currentPage: page,
                totalPages,
                pageSize,
                totalCount: count ?? 0,
                hasNext: page < totalPages,
                hasPrevious: page > 1,
            },
        };

    }
}

const serviceCustomer = new customerService();

    // מחלץ לקובץ csv את כל הלקוחות שעומדים בסינון שמקבלת הפונקציה
export const exportCustomersToFileByFilter = async(filter: Partial <CustomerModel>) :Promise <Buffer|null> => {
        
        const customerToExport = await serviceCustomer.getByFilters(filter);

        if (!customerToExport || customerToExport.length === 0) {
            return null;
        }

        // פונקציה מהספריה csv-writer
        const csvStringifier = createObjectCsvStringifier({
            header: [
                { id: 'id', title: 'ID' },
                { id: 'name', title: 'Name' },
                { id: 'idNumber', title: 'ID Number' },
                { id: 'businessName', title: 'Business Name' },
                { id: 'businessType', title: 'Business Type' },
                { id: 'currentWorkspaceType', title: 'Current Workspace Type' },
                { id: 'workspaceCount', title: 'Workspace Count' },
                { id: 'contractSignDate', title: 'Contract Sign Date' },
                { id: 'billingStartDate', title: 'Billing Start Date' },
                { id: 'notes', title: 'Notes' },
                { id: 'invoiceName', title: 'InvoiceName' },
                { id: 'contractDocuments', title: 'Contract Documents' },
                { id: 'paymentMethodsType', title: 'Payment Methods Type' },
                { id: 'notes', title: 'Notes' },
                { id: 'updatedAt', title: 'Updated At'},
                { id: 'contracts', title: 'Contracts' },
                { id: 'phone', title: 'Phone' },
                { id: 'status', title: 'Status' },
                { id: 'createdAt', title: 'Created At' },
            ],
        });

        const csvHeader = csvStringifier.getHeaderString();
        const csvBody = csvStringifier.stringifyRecords(customerToExport);
        const csvFull = csvHeader + csvBody;

        return Buffer.from(csvFull, 'utf-8');

}

// לשאול את שולמית

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

<<<<<<< HEAD
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


=======
>>>>>>> origin/main

// export const getCustomerHistory = async (customerId: ID): Promise<CustomerHistory[]> => {
//     // אמור לשלוף את ההיסטוריה של הלקוח עם ה-customerId הנתון
//     return []; // להחזיר מערך של היסטוריית לקוח
// }

<<<<<<< HEAD
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
=======
>>>>>>> origin/main









