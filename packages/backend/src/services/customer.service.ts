import { CustomerModel } from "../models/customer.model";
import{ ConvertLeadToCustomerRequest,CustomerStatus, GetCustomersRequest, RecordExitNoticeRequest, UpdateCustomerRequest, CustomerPeriod, CreateCustomerRequest} from '../../../../types/customer'
import { supabase } from "../db/supabaseClient";
import { baseService } from "./baseService";
import { createObjectCsvStringifier } from "csv-writer";
import { leadService } from "./lead.service";
import { PaymentMethodType } from "../../../../types/billing";

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
    convertLeadToCustomer = async (newCustomer: CreateCustomerRequest, leadId: ID, paymentMethodsType: PaymentMethodType, businessName: string): Promise <CustomerModel> => {

        const serviceLead = new leadService();
        
        const leadData = await serviceLead.getById(leadId);

        if (!leadData) {
            throw new Error('Lead data not found for the provided leadId');
        }
        // המרה של ליד ללקוח
        const customerData: CustomerModel = {
            id: leadId,
            name: newCustomer.name,
            email: newCustomer.email,
            phone: newCustomer.phone,
            idNumber: newCustomer.idNumber,
            businessName: businessName,
            businessType: newCustomer.businessType,
            status: CustomerStatus.ACTIVE,
            currentWorkspaceType: newCustomer.workspaceType,
            workspaceCount: newCustomer.workspaceCount,
            contractSignDate: newCustomer.contractSignDate,
            contractStartDate: newCustomer.contractStartDate,
            billingStartDate: newCustomer.billingStartDate,
            notes: newCustomer.notes,
            invoiceName: "",
            contractDocuments: newCustomer.contractDocuments,
            paymentMethodsType: paymentMethodsType,
            periods: [],
            contracts: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            paymentMethods: []
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



// export const getCustomerHistory = async (customerId: ID): Promise<CustomerHistory[]> => {
//     // אמור לשלוף את ההיסטוריה של הלקוח עם ה-customerId הנתון
//     return []; // להחזיר מערך של היסטוריית לקוח
// }









