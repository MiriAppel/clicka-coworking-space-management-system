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
  StatusChangeRequest,
  UpdateCustomerRequest,
} from "shared-types";
import { supabase } from "../db/supabaseClient";
import { CustomerPeriodModel } from "../models/customerPeriod.model";
import { EmailTemplateService } from "./emailTemplate.service";
import { EmailTemplateModel } from "../models/emailTemplate.model";
import { sendEmail } from "./gmail-service";

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
    id: ID,
  ): Promise<GetCustomersRequest[] | null> => {
    return [];
  };

  createCustomer = async (
    newCustomer: CreateCustomerRequest,
  ): Promise<CustomerModel> => {
    console.log("in servise");
    console.log(newCustomer);

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
      paymentMethodsType: newCustomer.paymentMethodType,
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
          payment_methods_type: this.paymentMethodsType,
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
    ((dataToUpdate.updatedAt = new Date().toISOString()),
      this.patch(CustomerModel.partialToDatabaseFormat(dataToUpdate), id));
  };

  // יצרית הודעת עזיבה של לקוח
  postExitNotice = async (
    exitNotice: RecordExitNoticeRequest,
    id: ID,
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
    const searchFields = [
      "name",
      "phone",
      "business_name",
      "business_type",
      "email",
    ];

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
    page?: string;
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
      .order("created_at", { ascending: false })
      .range(from, to);

    console.log("Supabase data:", data);
    console.log("Supabase error:", error);

    if (error) {
      console.error("❌ Supabase error:", error.message || error);
      return Promise.reject(
        new Error(`Supabase error: ${error.message || JSON.stringify(error)}`),
      );
    }

    const customers = data || [];
    return CustomerModel.fromDatabaseFormatArray(customers);
  };

  emailService = new EmailTemplateService();

  sendStatusChangeEmails = async (
    detailsForChangeStatus: StatusChangeRequest,
    id: ID,
    token: any,
  ): Promise<void> => {
    const customer = await this.getById(id);

    // סטטוסים שדורשים התראה לצוות
    const notifyTeamStatuses = ["NOTICE_GIVEN", "EXITED", "ACTIVE"];
    const shouldNotifyTeam = notifyTeamStatuses.includes(
      detailsForChangeStatus.newStatus,
    );

    //אם ללקוח יש מייל וזה true אז יש לשלוח התראה ללקוח
    const shouldNotifyCustomer = detailsForChangeStatus.notifyCustomer &&
      !!customer.email;

    const emailPromises: Promise<any>[] = [];

    function encodeSubject(subject: string): string {
      return `=?UTF-8?B?${Buffer.from(subject).toString("base64")}?=`;
    }

    // תרגום הסטטוס לעברית
    const statusTranslations: Record<string, string> = {
      NOTICE_GIVEN: "ניתנה הודעה",
      TERMINATED: "סיום העסקה",
      ACTIVE: "פעיל",
    };

    const effectiveDate = new Date(detailsForChangeStatus.effectiveDate);
    const formattedDate = effectiveDate.toLocaleString("he-IL", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    detailsForChangeStatus.effectiveDate = formattedDate;
    const status = statusTranslations[detailsForChangeStatus.newStatus] ||
      detailsForChangeStatus.newStatus;

    // פונקציה לשליחת מייל לצוות
    const sendTeamEmail = async () => {
      try {
        const template = await this.emailService.getTemplateByName(
          "שינוי סטטוס - צוות",
        );

        if (!template) {
          console.warn("Team email template not found");
          return;
        }
        const renderedHtml = await this.emailService.renderTemplate(
          template.bodyHtml,
          {
            "שם": customer.name,
            "סטטוס": status,
            "תאריך": formattedDate,
            "סיבה": detailsForChangeStatus.reason || "ללא סיבה מצוינת",
          },
        );

        const response = await sendEmail(
          "me",
          {
            to: ["diversitech25clicka@gmail.com"],
            subject: encodeSubject(template.subject),
            body: renderedHtml,
            isHtml: true,
          },
          token,
        );
        console.log(template.subject);

        console.log("HTML before sending:\n", renderedHtml);
        console.log(
          customer.name,
          detailsForChangeStatus.newStatus,
          detailsForChangeStatus.effectiveDate,
          detailsForChangeStatus.reason,
        );

        console.log("Team email sent successfully:", response);
      } catch (err) {
        console.error("שגיאה בשליחת מייל לצוות:", err);
      }
    };

    // פונקציה לשליחת מייל ללקוח
    const sendCustomerEmail = async () => {
      const template = await this.emailService.getTemplateByName(
        "שינוי סטטוס - לקוח",
      );
      if (!template) {
        console.warn("Customer email template not found");
        return;
      }
      const renderedHtml = await this.emailService.renderTemplate(
        template.bodyHtml,
        {
          "שם": customer.name,
          "סטטוס": status,
          "תאריך": formattedDate,
        },
      );
      console.log("HTML before sending:\n", renderedHtml);
      console.log(
        customer.name,
        detailsForChangeStatus.newStatus,
        detailsForChangeStatus.effectiveDate,
      );

      return sendEmail(
        "me",
        {
          to: [customer.email],
          subject: encodeSubject(template.subject),
          body: renderedHtml,
          isHtml: true,
        },
        token,
      );
    };

    //מוסיף למערך הפרומיסים רק אם זה הצליח
    if (shouldNotifyTeam) {
      emailPromises.push(
        sendTeamEmail().catch((err) => {
          console.error("שגיאה בשליחת מייל לצוות", err);
        }),
      );
    }
    if (shouldNotifyCustomer) {
      emailPromises.push(
        sendCustomerEmail().catch((err) => {
          console.error("שגיאה בשליחת מייל ללקוח", err);
        }),
      );
    }

    //אם פרומיס אחד נכשל זה לא מפעיל את השליחה
    await Promise.all(emailPromises);
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
