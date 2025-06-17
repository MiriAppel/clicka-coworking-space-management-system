import { DateISO, DateRangeFilter, FileReference, ID, PaginatedResponse } from "../../../../types/core";
import { CustomerModel } from "../models/customer.model";
import{ Contract, ContractStatus, ConvertLeadToCustomerRequest, Customer, CustomerStatus, ExitReason, GetCustomersRequest, RecordExitNoticeRequest, TimelineEventType, UpdateCustomerRequest, CustomerPeriod} from '../../../../types/customer'
import { supabase } from "../db/supabaseClient";
import { LeadModel } from "../models/lead.model";
import { getLeadById } from "./lead.service";
import { baseService } from "./baseService";



export class customerService extends baseService <CustomerModel> {

    constructor() {
        super("CustomerModel")
    }

    //מחזיר את כל הסטטוסים של הלקוח
    const getAllCustomerStatus = async (): Promise <CustomerStatus[]|null> => {

        return Object.values(CustomerStatus) as CustomerStatus[];

    }

    const getCustomersToNotify = async(id: ID): Promise<GetCustomersRequest[] | null> => {

        return [];

    }
    
    // המרת ליד ללקוח
    const convertLeadToCustomer =async(newCustomer: ConvertLeadToCustomerRequest): Promise<CustomerModel> => {

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
            paymentMethods: newCustomer.paymentMethod ? [newCustomer.paymentMethod] : [],
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

        const timeline: TimelineEvent = {

            type: TimelineEventType.CONVERSION,
            date: new Date().toISOString(),
            title: 'ליד הומר ללקוח',
            description: `ליד ${lead.id} הומר ללקוח חדש ${customerData.id}.`,
            relatedId: lead.id
        };

        await addTimelineEvent(timeline);

        return data as CustomerModel;
    }
    const postExitNotice = async (exitNotice: RecordExitNoticeRequest): Promise<void> => {

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

        const timeline: TimelineEvent = {

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

    const exportToFile = async(req:GetCustomersRequest) :Promise<Buffer|null>=>{
         //ייצוא תוצאות חיפוש לקובץ
        return null;
    }

    const getCustomersByPage = async (page: number = 1, pageSize: number = 50): Promise<PaginatedResponse<CustomerModel>> => {
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

    const getByDateJoin= async (dateFrom:Date, dateEnd:Date):Promise<GetCustomersRequest[]|null>=>{

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


    //ועוד הפונקציות שאין בbase-service והם מיוחדיות רק לcustomer

    
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



// export const getCustomerHistory = async (customerId: ID): Promise<CustomerHistory[]> => {
//     // אמור לשלוף את ההיסטוריה של הלקוח עם ה-customerId הנתון
//     return []; // להחזיר מערך של היסטוריית לקוח
// }



// export const getCustomerTimeline = async (customerId: ID): Promise<CustomerTimeline> => {
//     return {
//         customerId: customerId,
//         events: [],
//         totalEvents: 0,
//     };
// }

// export const addTimelineEvent = async (data: TimelineEvent): Promise<void> => {
//     // אמור להוסיף אירוע לאינטראקציות של לקוח
//     // האירוע יכול לכלול סוג, תאריך ותיאור
//     // להחזיר את האירוע שנוסף
// }

// export const exportTimeline = async (customerId: ID, filters?:CustomerFilter ): Promise<FileReference> => {
//     // אמור לייצא את היסטוריית האירועים של לקוח לקובץ
//     // להחזיר קישור לקובץ המיוצא
//     return {
//         id: "file-id",
//         name: "timeline-export.json",
//         path: `/exports/${customerId}/timeline-export.json`,
//         mimeType: "application/json",
//         size: 0, // גודל הקובץ, ניתן לחשב לאחר הייצוא   
//         url: `https://example.com/exports/${customerId}/timeline-export.json`,
//         createdAt: new Date().toISOString() as DateISO,
//         updatedAt: new Date().toISOString() as DateISO,
//     };

// }





