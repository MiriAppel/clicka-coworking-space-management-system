import { CustomerModel } from "../models/customer.model";
import { baseService } from "./baseService";
import { serviceCustomerPeriod } from "./customerPeriod.service";
import {
    ContractStatus,
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
import { supabase } from "../db/supabaseClient";
import { CustomerPeriodModel } from "../models/customerPeriod.model";
import { ContractModel } from "../models/contract.model";
import { contractService } from '../services/contract.service';


export class customerService extends baseService<CustomerModel> {
  constructor() {
    super("customer");
  }

  getAllCustomers = async (): Promise<CustomerModel[] | null> => {
    const customers = await this.getAll();
    return CustomerModel.fromDatabaseFormatArray(customers); // המרה לסוג UserModel
  };
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

  createCustomer = async (
    newCustomer: CreateCustomerRequest
  ): Promise<CustomerModel> => {
    console.log("in servise");
    console.log(newCustomer);

        //מה לעשות עם זה: paymentMethods!!

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
            paymentMethodType: newCustomer.paymentMethodType,
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
                    payment_methods_type: this.paymentMethodType,
                    created_at: this.createdAt,
                    updated_at: this.updatedAt,
                };
            },
        };

        //לפני היצירה יש לבדוק שהחלל באמת פנוי צריך לפנות לקבוצה 3
        console.log("in servise");

        console.log(customerData);

        const customer = await this.post(customerData);

        const newContract: ContractModel = {
            customerId: customer.id!,
            version: 1,
            status: ContractStatus.DRAFT,
            signDate: newCustomer.contractSignDate,
            startDate: newCustomer.contractStartDate,
            //   endDate?: string;
            //   terms?: ContractTerms;
            documents: newCustomer.contractDocuments || [],
            //   signedBy?: string;
            //   witnessedBy?: string;
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            toDatabaseFormat() {
                return {
                    customer_id: this.customerId,
                    version: this.version,
                    status: this.status,
                    sign_date: this.signDate,
                    start_date: this.startDate,
                    end_date: this.endDate,
                    terms: this.terms,
                    documents: this.documents,
                    signed_by: this.signedBy,
                    witnessed_by: this.witnessedBy,
                    created_at: this.createdAt,
                    updated_at: this.updatedAt
                };
            }
        }
        const serviceContract = new contractService();

        const contract = await serviceContract.post(newContract)

        console.log("in service");
        console.log(contract);


        // קריאה לשירותי התראות/מייל מתאימים לאחר המרה מוצלחת קשור לקבוצה 1

        return customerData;
    };

    updateCustomer = async (dataToUpdate: Partial<CustomerModel>, id: ID) => {
        dataToUpdate.updatedAt = new Date().toISOString();

        try {
            await this.patch(CustomerModel.partialToDatabaseFormat(dataToUpdate), id); // תפס את השגיאה
        } catch (error) {
            console.error("שגיאה בעדכון הלקוח:", error);
            throw error; // זרוק את השגיאה הלאה
        }
    }

  // יצרית הודעת עזיבה של לקוח
  postExitNotice = async (
    exitNotice: RecordExitNoticeRequest,
    id: ID
  ): Promise<void> => {
    const updateStatus: UpdateCustomerRequest = {
      status: CustomerStatus.PENDING,
    };

    await this.updateCustomer(updateStatus as CustomerModel, id);

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
            updated_at: this.updatedAt,
          };
        },
      };
      try {
        await serviceCustomerPeriod.post(period);
      } catch (error) {
        console.error("in Period ", error);
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

  getCustomersByText = async (text: string): Promise<CustomerModel[]> => {
  const searchFields = ["name", "phone", "business_name", "business_type", "email"];
  
  const filters = searchFields
    .map((field) => `${field}.ilike.%${text}%`)
    .join(",");
  
  console.log("Filters:", filters);
  
  const { data, error } = await supabase
    .from("customer")
    .select("*")
    .or(filters);
  
  if (error) {
    console.error("שגיאה:", error);
    return [];
  }
  
  return data as CustomerModel[];
};


    //מחזיר את כל הלקוחות רק של העמוד הראשון
    getCustomersByPage = async (filters: {
        page?: number;
        limit?: number;
    }): Promise<CustomerModel[]> => {
        console.log("Service getCustomersByPage called with:", filters);

        const { page, limit } = filters;

        const pageNum = Number(filters.page);
        const limitNum = Number(filters.limit);

        if (!Number.isInteger(pageNum) || !Number.isInteger(limitNum)) {
            throw new Error("Invalid filters provided for pagination");
        }

        const from = (pageNum - 1) * limitNum;
        const to = from + limitNum - 1;

        const { data, error } = await supabase
            .from("customer")
            .select("*")
            .order("name", { ascending: true }) // מיון לפי שם
            .range(from, to);

        //   console.log("Supabase data:", data);
        console.log("Supabase error:", error);

        if (error) {
            console.error("❌ Supabase error:", error.message || error);
            return Promise.reject(
                new Error(`Supabase error: ${error.message || JSON.stringify(error)}`)
            );
        }

        const customers = data || [];
        return CustomerModel.fromDatabaseFormatArray(customers)
    };
}
const serviceCustomer = new customerService();

// מחלץ לקובץ csv את כל הלקוחות שעומדים בסינון שמקבלת הפונקציה
// export const exportCustomersToFileByFilter = async (
//   filter: Partial<CustomerModel>
// ): Promise<Buffer | null> => {
// const customerToExport = await serviceCustomer.getByFilters(filter);

// if (!customerToExport || customerToExport.length === 0) {
//   return null;
// }

//   // פונקציה מהספריה csv-writer
//   const csvStringifier = createObjectCsvStringifier({
//     header: [
//       { id: "id", title: "ID" },
//       { id: "name", title: "Name" },
//       { id: "idNumber", title: "ID Number" },
//       { id: "businessName", title: "Business Name" },
//       { id: "businessType", title: "Business Type" },
//       { id: "currentWorkspaceType", title: "Current Workspace Type" },
//       { id: "workspaceCount", title: "Workspace Count" },
//       { id: "contractSignDate", title: "Contract Sign Date" },
//       { id: "billingStartDate", title: "Billing Start Date" },
//       { id: "invoiceName", title: "InvoiceName" },
//       { id: "contractDocuments", title: "Contract Documents" },
//       { id: "paymentMethodsType", title: "Payment Methods Type" },
//       { id: "notes", title: "Notes" },
//       { id: "updatedAt", title: "Updated At" },
//       { id: "contracts", title: "Contracts" },
//       { id: "phone", title: "Phone" },
//       { id: "status", title: "Status" },
//       { id: "createdAt", title: "Created At" },
//     ],
//   });

//   const csvHeader = csvStringifier.getHeaderString();
//   // const csvBody = csvStringifier.stringifyRecords(customerToExport);
// const csvFull = csvHeader + csvBody;

// return Buffer.from(csvFull, "utf-8");
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
