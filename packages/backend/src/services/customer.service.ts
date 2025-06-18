import { ID, PaginatedResponse } from "../../../../types/core";
import { CustomerModel } from "../models/customer.model";
import{ ConvertLeadToCustomerRequest,CustomerStatus, GetCustomersRequest, RecordExitNoticeRequest, UpdateCustomerRequest, CustomerPeriod} from '../../../../types/customer'
import { supabase } from "../db/supabaseClient";
import { getLeadById } from "./lead.service";
import { baseService } from "./baseService";

export class customerService extends baseService <CustomerModel> {

    constructor() {
        super("CustomerModel")
    }

    //מחזיר את כל הסטטוסים של הלקוח
    getAllCustomerStatus = async (): Promise <CustomerStatus[]|null> => {

        return Object.values(CustomerStatus) as CustomerStatus[];

    }

    getCustomersToNotify = async(id: ID): Promise<GetCustomersRequest[] | null> => {

        return [];
    }
    
    // המרת ליד ללקוח
    convertLeadToCustomer = async (newCustomer: ConvertLeadToCustomerRequest): Promise <CustomerModel> => {

        const leadData = await getLeadById(newCustomer.leadId);

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

        this.post(customerData);

        //יש להעביר את פרטי הלקוח והחוזה למערכת החיוב (של Team 4 - Billing) לצורך חישוב תמחור והכנת חיובים ראשוניים.

        // קריאה לשירותי התראות/מייל מתאימים לאחר המרה מוצלחת קשור לקבוצה 1

        return customerData;
    };

    // יצרית הודעת עזיבה של לקוח
    postExitNotice = async (exitNotice: RecordExitNoticeRequest, id: ID): Promise<void> => {

        const updateStatus: UpdateCustomerRequest = {
            status: CustomerStatus.PENDING
        };

        this.patch(updateStatus as CustomerModel, id);

        const customerLeav: CustomerModel | null = await this.getById(id);

        if (customerLeav){
            // יצירת תקופת עזיבה ללקוח
            const period: CustomerPeriod = {
                id: id,
                customerId: id,
                exitDate: new Date().toISOString(),
                exitNoticeDate: exitNotice.exitNoticeDate,
                exitReason: exitNotice.exitReason,
                exitReasonDetails: exitNotice.exitReasonDetails,
                createdAt: customerLeav.createdAt,
                updatedAt: customerLeav.updatedAt
            };
            customerLeav.periods = [period];
        }

            //ליצור התראה שהלקוח עוזב - קשור לקבוצה 1

            // לעדכן את מערכת החיוב לגבי סיום השירות או חישוב חיוב סופי
            // קשור לקבוצת billing
    }

    exportToFile = async(req:GetCustomersRequest) :Promise<Buffer|null>=>{
         //ייצוא תוצאות חיפוש לקובץ
        return null;
    }

    getCustomersByPage = async (page: number = 1, pageSize: number = 50): Promise<PaginatedResponse<CustomerModel>> => {
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

    getByDateJoin= async (dateFrom:Date, dateEnd:Date):Promise<GetCustomersRequest[]|null>=>{

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










