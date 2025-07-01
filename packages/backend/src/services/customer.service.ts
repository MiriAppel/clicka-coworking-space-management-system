import { CustomerModel } from "../models/customer.model";
import { baseService } from "./baseService";
import { serviceCustomerPeriod } from "./customerPeriod.service";
import {
    CreateCustomerRequest,
    CustomerPeriod,
    CustomerStatus,
    GetCustomersRequest,
    ID,
    PaginatedResponse,
    PaymentMethodType,
    RecordExitNoticeRequest,
    UpdateCustomerRequest,
} from "shared-types";
import { supabase } from '../db/supabaseClient'
import { error } from "node:console";
import { CustomerPeriodModel } from "../models/customerPeriod.model";

export class customerService extends baseService<CustomerModel> {
    constructor() {
        super("customer");
    }

    getAllCustomers = async (): Promise<CustomerModel[] | null> => {
        const customers = await this.getAll();
        return CustomerModel.fromDatabaseFormatArray(customers) // המרה לסוג UserModel
    }
    //מחזיר את כל הסטטוסים של הלקוח
    getAllCustomerStatus = async (): Promise<CustomerStatus[] | null> => {
        return Object.values(CustomerStatus) as CustomerStatus[];
    };

    //לא הבנתי מה היא צריכה לעשות
    getCustomersToNotify = async (
        id: ID
    ): Promise<GetCustomersRequest[] | null> => {
        return [];
    };

    // המרת ליד ללקוח
    convertLeadToCustomer = async (
        newCustomer: CreateCustomerRequest,
        // paymentMethodsType: PaymentMethodType,
    ): Promise<CustomerModel> => {
        console.log("in servise");
        console.log(newCustomer);


        // המרה של ליד ללקוח
        const customerData: CustomerModel = {
            name: newCustomer.name,
            email: newCustomer.email,
            phone: newCustomer.phone,
            idNumber: newCustomer.idNumber,
            businessName: newCustomer.businessName,
            businessType: newCustomer.businessType,
            status: CustomerStatus.ACTIVE,
            currentWorkspaceType: newCustomer.workspaceType,
            workspaceCount: newCustomer.workspaceCount,
            contractSignDate: newCustomer.contractSignDate,
            contractStartDate: newCustomer.contractStartDate,
            billingStartDate: newCustomer.billingStartDate,
            notes: newCustomer.notes,
            invoiceName: newCustomer.invoiceName,
            // paymentMethodsType: newCustomer.,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            paymentMethods: [],
            toDatabaseFormat() {
                return {
                    name: this.name,
                    email: this.email,
                    phone: this.phone,
                    id_number: this.idNumber,
                    business_name: this.businessName,
                    business_type: this.businessType,
                    status: this.status,
                    current_workspace_type: this.currentWorkspaceType,
                    workspace_count: this.workspaceCount,
                    contract_sign_date: this.contractSignDate,
                    contract_start_date: this.contractStartDate,
                    billing_start_date: this.billingStartDate,
                    notes: this.notes,
                    invoice_name: this.invoiceName,
                    // payment_methods_type: this.paymentMethodsType,
                    created_at: this.createdAt,
                    updated_at: this.updatedAt,
                };
            },
        };

        //לפני היצירה יש לבדוק שהחלל באמת פנוי צריך לפנות לקבוצה 3
        console.log("in servise");

        console.log(customerData);

        await this.post(customerData);
        //יש להעביר את פרטי הלקוח והחוזה למערכת החיוב (של Team 4 - Billing) לצורך חישוב תמחור והכנת חיובים ראשוניים.

        // קריאה לשירותי התראות/מייל מתאימים לאחר המרה מוצלחת קשור לקבוצה 1

        return customerData;
    };

    updateCustomer = async (dataToUpdate: Partial<CustomerModel>, id: ID) => {
        this.patch(CustomerModel.partialToDatabaseFormat(dataToUpdate), id)
    }

    // יצרית הודעת עזיבה של לקוח
    postExitNotice = async (
        exitNotice: RecordExitNoticeRequest,
        id: ID
    ): Promise<void> => {
        const updateStatus: UpdateCustomerRequest = {
            status: CustomerStatus.PENDING,
        };

        await this.patch(updateStatus as CustomerModel, id);

        const customerLeave: CustomerModel | null = await this.getById(id);

        if (customerLeave) {
            // יצירת תקופת עזיבה ללקוח
            const period: CustomerPeriodModel = {
                customerId: id,
                entryDate: customerLeave.createdAt || new Date().toISOString(),
                exitDate: exitNotice.plannedExitDate,
                exitNoticeDate: exitNotice.exitNoticeDate,
                exitReason: exitNotice.exitReason,
                exitReasonDetails: exitNotice.exitReasonDetails,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                toDatabaseFormat() {
                    return {
                        customer_id: this.customerId,
                        entry_date: this.entryDate,
                        exit_date: this.exitDate,
                        exit_notice_date: this.exitNoticeDate,
                        exit_reason: this.exitReason,
                        exit_reason_details: this.exitReasonDetails,
                        created_at: this.createdAt,
                        updated_at: this.updatedAt
                    };
                }
            };
            try {
                await serviceCustomerPeriod.post(period);

            } catch (error) {
                console.error("in Period ", error)
            }
        }

        if (customerLeave && customerLeave.id) {
            await this.patch(customerLeave, customerLeave.id);
        } else {
            throw new Error("Customer ID is undefined");
        }

        //ליצור התראה שהלקוח עוזב - קשור לקבוצה 1

        // לעדכן את מערכת החיוב לגבי סיום השירות או חישוב חיוב סופי
        // קשור לקבוצת billing
    };

    //מחזיר את כל הלקוחות רק של העמוד הראשון
    getCustomersByPage = async (
        page: number = 1,
        pageSize: number = 50
    ): Promise<PaginatedResponse<CustomerModel>> => {
        const from = (page - 1) * pageSize;
        const to = from + pageSize - 1;

        const { data, error, count } = await supabase
            .from("customer")
            .select("*", { count: "exact" }) // count: 'exact' סופר את כל התוצאות
            .range(from, to)
            .order("created_at", { ascending: false }); // ממיין

        if (error) {
            console.error("Error fetching customers by page:", error);
            throw new Error("Failed to fetch paginated customers");
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
    };
}

const serviceCustomer = new customerService();

// מחלץ לקובץ csv את כל הלקוחות שעומדים בסינון שמקבלת הפונקציה
// export const exportCustomersToFileByFilter = async (
//     filter: Partial<CustomerModel>
// ): Promise<Buffer | null> => {
//     const customerToExport = await serviceCustomer.getByFilters(filter);

//     if (!customerToExport || customerToExport.length === 0) {
//         return null;
//     }

//     // פונקציה מהספריה csv-writer
//     const csvStringifier = createObjectCsvStringifier({
//         header: [
//             { id: "id", title: "ID" },
//             { id: "name", title: "Name" },
//             { id: "idNumber", title: "ID Number" },
//             { id: "businessName", title: "Business Name" },
//             { id: "businessType", title: "Business Type" },
//             { id: "currentWorkspaceType", title: "Current Workspace Type" },
//             { id: "workspaceCount", title: "Workspace Count" },
//             { id: "contractSignDate", title: "Contract Sign Date" },
//             { id: "billingStartDate", title: "Billing Start Date" },
//             { id: "invoiceName", title: "InvoiceName" },
//             { id: "contractDocuments", title: "Contract Documents" },
//             { id: "paymentMethodsType", title: "Payment Methods Type" },
//             { id: "notes", title: "Notes" },
//             { id: "updatedAt", title: "Updated At" },
//             { id: "contracts", title: "Contracts" },
//             { id: "phone", title: "Phone" },
//             { id: "status", title: "Status" },
//             { id: "createdAt", title: "Created At" },
//         ],
//     });

//     const csvHeader = csvStringifier.getHeaderString();
//     const csvBody = csvStringifier.stringifyRecords(customerToExport);
//     const csvFull = csvHeader + csvBody;

//     return Buffer.from(csvFull, "utf-8");
// };

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
