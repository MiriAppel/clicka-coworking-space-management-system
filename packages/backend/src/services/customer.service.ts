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
  StatusChangeRequest,
  UpdateCustomerRequest,
} from "shared-types";
import { supabase } from "../db/supabaseClient";
import { CustomerPeriodModel } from "../models/customerPeriod.model";
import { ContractModel } from "../models/contract.model";
import { contractService } from "../services/contract.service";
import { customerPaymentMethodModel } from "../models/customerPaymentMethod.model";
import { serviceCustomerPaymentMethod } from "./customerPaymentMethod.service";
import { EmailTemplateService } from "./emailTemplate.service";
import { EmailTemplateModel } from "../models/emailTemplate.model";
import { encodeSubject, sendEmail } from "./gmail-service";
import { error, log } from "node:console";
import { changeCustomerStatus } from "../controllers/customer.controller";
import { token } from "morgan";
import { UserTokenService } from "./userTokenService";
import { promises } from "node:dns";
import { getDocumentById } from "./document.service";
export class customerService extends baseService<CustomerModel> {
  constructor() {
    super("customer");
  }

  // const serviceDocument = new documentSer

  getAllCustomers = async (): Promise<CustomerModel[] | null> => {
    const customers = await this.getAll();

    const customersWithPayments = await Promise.all(
      customers.map(async (customer) => {
        if (customer.paymentMethodType === PaymentMethodType.CREDIT_CARD) {
          const paymentMethods = await serviceCustomerPaymentMethod
            .getByCustomerId(customer.id!);
          customer.paymentMethods = paymentMethods || [];
        }
        return customer;
      }),
    );

    return CustomerModel.fromDatabaseFormatArray(customersWithPayments); // המרה לסוג UserModel
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

    //מה לעשות עם זה: paymentMethods!!

    const customerData: CustomerModel = {
      name: newCustomer.name,
      email: newCustomer.email,
      phone: newCustomer.phone,
      idNumber: newCustomer.idNumber,
      businessName: newCustomer.businessName,
      businessType: newCustomer.businessType,
      status: CustomerStatus.CREATED,
      currentWorkspaceType: newCustomer.currentWorkspaceType,
      workspaceCount: newCustomer.workspaceCount,
      contractSignDate: newCustomer.contractSignDate,
      contractStartDate: newCustomer.contractStartDate,
      billingStartDate: newCustomer.billingStartDate,
      notes: newCustomer.notes,
      invoiceName: newCustomer.invoiceName,
      paymentMethodType: newCustomer.paymentMethodType,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
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
      terms: { //ערכים התחלתיים לבנתיים
        workspaceType: newCustomer.currentWorkspaceType,
        workspaceCount: newCustomer.workspaceCount,
        duration: 1,
        monthlyRate: 0,
        renewalTerms: "",
        terminationNotice: 0,
      },
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
          updated_at: this.updatedAt,
        };
      },
    };
    const serviceContract = new contractService();

    const contract = await serviceContract.post(newContract);

    console.log("new contract in customer service");
    console.log(contract);

    //create customer payment method
    if (newCustomer.paymentMethodType == PaymentMethodType.CREDIT_CARD) {
      const newPaymentMethod: customerPaymentMethodModel = {
        customerId: customer.id!,
        isActive: true,
        creditCardExpiry: newCustomer.paymentMethod?.creditCardExpiry,
        creditCardHolderIdNumber: newCustomer.paymentMethod
          ?.creditCardHolderIdNumber,
        creditCardHolderPhone: newCustomer.paymentMethod?.creditCardHolderPhone,
        creditCardNumber: newCustomer.paymentMethod?.creditCardNumber,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        toDatabaseFormat() {
          return {
            customer_id: this.customerId,
            credit_card_number: this.creditCardNumber,
            credit_card_expiry: this.creditCardExpiry,
            credit_card_holder_id_number: this.creditCardHolderIdNumber,
            credit_card_holder_phone: this.creditCardHolderPhone,
            is_active: this.isActive,
            created_at: this.createdAt,
            updated_at: this.updatedAt,
          };
        },
      };

      const paymentMethod = await serviceCustomerPaymentMethod.post(
        newPaymentMethod,
      );

      console.log("paymentMethod in service");
      console.log(paymentMethod);
    }

    // קריאה לשירותי התראות/מייל מתאימים לאחר המרה מוצלחת קשור לקבוצה 1

    return customerData;
  };

  updateCustomer = async (dataToUpdate: any, id: ID) => {
    console.log("updateCustomer called with data:", dataToUpdate);

    try {
      await this.patch(CustomerModel.partialToDatabaseFormat(dataToUpdate), id); // תפס את השגיאה
      if (dataToUpdate.paymentMethodType === PaymentMethodType.CREDIT_CARD) {
        // אם סוג התשלום הוא כרטיס אשראי, נעדכן את שיטת התשלום
        //אם כבר היה שיטת תשלום אז נעדכן, אחרת ניצור
        const paymentMethods = await serviceCustomerPaymentMethod
          .getByCustomerId(id);
        console.log("paymentMethods in updateCustomer", paymentMethods);
        if (paymentMethods && paymentMethods.length > 0) {
          // אם יש כבר שיטת תשלום, נעדכן אותה
          const paymentMethodData = {
            ...paymentMethods[0], // נשתמש בנתונים הקיימים
            isActive: true,
            creditCardNumber: dataToUpdate.creditCardNumber,
            creditCardExpiry: dataToUpdate.creditCardExpiry,
            creditCardHolderIdNumber: dataToUpdate.creditCardHolderIdNumber,
            creditCardHolderPhone: dataToUpdate.creditCardHolderPhone,
            updatedAt: new Date().toISOString(),
          };
          console.log("paymentMethodData in updateCustomer", paymentMethodData);

          await serviceCustomerPaymentMethod.patch(
            customerPaymentMethodModel.partialToDatabaseFormat(
              paymentMethodData,
            ),
            paymentMethods[0].id!,
          );
        } else {
          // אם אין שיטת תשלום, ניצור חדשה
          const newPaymentMethod: customerPaymentMethodModel = {
            customerId: id,
            isActive: true,
            creditCardExpiry: dataToUpdate.creditCardExpiry,
            creditCardHolderIdNumber: dataToUpdate.creditCardHolderIdNumber,
            creditCardHolderPhone: dataToUpdate.creditCardHolderPhone,
            creditCardNumber: dataToUpdate.creditCardNumber,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            toDatabaseFormat() {
              return {
                customer_id: this.customerId,
                credit_card_number: this.creditCardNumber,
                credit_card_expiry: this.creditCardExpiry,
                credit_card_holder_id_number: this.creditCardHolderIdNumber,
                credit_card_holder_phone: this.creditCardHolderPhone,
                is_active: this.isActive,
                created_at: this.createdAt,
                updated_at: this.updatedAt,
              };
            },
          };

          await serviceCustomerPaymentMethod.post(newPaymentMethod);
        }
      }
    } catch (error) {
      console.error("שגיאה בעדכון הלקוח:", error);
      throw error; // זרוק את השגיאה הלאה
    }
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

    const customers = data || [];
    return CustomerModel.fromDatabaseFormatArray(customers);
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

    // console.log("Supabase data:", data);
    console.log("Supabase error:", error);

    if (error) {
      console.error("❌ Supabase error:", error.message || error);
      return Promise.reject(
        new Error(`Supabase error: ${error.message || JSON.stringify(error)}`),
      );
    }

    const customers = data || [];

    const customersWithPayments = await Promise.all(
      customers.map(async (customer) => {
        if (customer.payment_methods_type === PaymentMethodType.CREDIT_CARD) {
          const paymentMethods = await serviceCustomerPaymentMethod
            .getByCustomerId(customer.id!);
          customer.paymentMethods = paymentMethods || [];
        }
        return customer;
      }),
    );

    return CustomerModel.fromDatabaseFormatArray(customersWithPayments);
  };

  emailService = new EmailTemplateService();

  confirmEmail = async (email: string, id: ID) => {
    try {
      console.log('🔄 Starting email confirmation for customer:', id);
      
      const customerToUpdate: CustomerModel | null = await this.getById(id);
      if (!customerToUpdate) {
        console.error('❌ Customer not found:', id);
        return;
      }
      
      customerToUpdate.email = email;
      customerToUpdate.status = CustomerStatus.ACTIVE;
      console.log('✅ Customer updated with email:', email);

      await this.patch(customerToUpdate, id);
      console.log('✅ Customer patched in database');

      try {
        const response = await fetch(
          "http://localhost:3001/api/customer/" + id + "/status-change",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              status: CustomerStatus.ACTIVE,
            }),
          },
        );
        console.log('📡 Status change API response:', response.status);
      } catch (fetchError) {
        console.warn('⚠️ Status change API failed:', fetchError);
      }

      // Send contract email
      try {
        const serviceContract = new contractService();
        console.log('📄 Getting contracts for customer ID:', customerToUpdate.id);
        const contracts = customerToUpdate.id ? await serviceContract.getAllContractsByCustomerId(customerToUpdate.id) : null;
        if (contracts && contracts.length > 0) {
          const urls: string[] = [];
          contracts.forEach(contract => {
            if (contract.documents && Array.isArray(contract.documents)) {
              contract.documents.forEach(doc => {
                if (doc.url) {
                  urls.push(doc.url);
                }
              });
            }
          });
          
          if (urls.length > 0) {
            console.log('📧 Sending contract email with', urls.length, 'URLs');
            await this.sendEmailWithContract(customerToUpdate, urls.join('\n'));
            console.log('✅ Contract email sent');
          } else {
            console.warn('⚠️ No contract URLs found');
          }
        } else {
          console.warn('⚠️ No contracts found for customer');
        }
      } catch (contractError) {
        console.error('❌ Contract email failed:', contractError);
      }

      // Send welcome message
      try {
        console.log('🎉 Sending welcome message for:', customerToUpdate.name);
        await this.sendWellcomeMessageForEveryMember(customerToUpdate.name);
        console.log('✅ Welcome message sent');
      } catch (welcomeError) {
        console.error('❌ Welcome message failed:', welcomeError);
      }

      console.log('🎯 Email confirmation completed successfully');
    } catch (error) {
      console.error('❌ Email confirmation failed:', error);
      throw error;
    }
  };

  sendStatusChangeEmails = async (
    detailsForChangeStatus: StatusChangeRequest,
    id: ID,
    token: any,
  ): Promise<void> => {
    const customer = await this.getById(id);

    console.log("Customer in sendStatusChangeEmails:", customer);
    console.log("Details for change status:", detailsForChangeStatus);

    // סטטוסים שדורשים התראה לצוות
    const notifyTeamStatuses = ["NOTICE_GIVEN", "EXITED", "ACTIVE", "CREATED"];
    const shouldNotifyTeam = notifyTeamStatuses.includes(
      detailsForChangeStatus.newStatus,
    );

    //אם ללקוח יש מייל וזה true אז יש לשלוח התראה ללקוח
    const shouldNotifyCustomer = detailsForChangeStatus.notifyCustomer &&
      !!customer.email;

    const emailPromises: Promise<any>[] = [];

    // function encodeSubject(subject: string): string {
    //   return `=?UTF-8?B?${Buffer.from(subject).toString("base64")}?=`;
    // }

    // תרגום הסטטוס לעברית

    const statusTranslations: Record<CustomerStatus, string> = {
      ACTIVE: "פעיל",
      NOTICE_GIVEN: "הודעת עזיבה",
      EXITED: "עזב",
      PENDING: "בהמתנה",
      CREATED: "נוצר",
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

    const status =
      statusTranslations[detailsForChangeStatus.newStatus as CustomerStatus] ||
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

        console.log("Rendered HTML for team email:\n", renderedHtml);

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
          to: [customer.email ?? ""],
          subject: encodeSubject(template.subject),
          body: renderedHtml,
          isHtml: true,
        },
        token,
      );
    };

    //מוסיף למערך הפרומיסים רק אם זה הצליח
    if (shouldNotifyTeam) {
      console.log(
        "Sending email to team for status change:",
        customer.name,
        status,
      );
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

  CustomerAuthentication = async (
    id: ID,
    token: any,
  ): Promise<void> => {
    const customer = await this.getById(id);

    // פונקציה לשליחת מייל לצוות
    const sendEmailToAuth = async () => {
      try {
        const template = await this.emailService.getTemplateByName(
          "אימות לקוח",
        );

        if (!template) {
          console.warn("Team email template not found");
          return;
        }
        const renderedHtml = await this.emailService.renderTemplate(
          template.bodyHtml,
          {},
        );

        const response = await sendEmail(
          "me",
          {
            to: [customer.email ?? ""],
            subject: encodeSubject(template.subject),
            body: renderedHtml,
            isHtml: true,
          },
          token,
        );
        console.log(template.subject);

        console.log("HTML before sending:\n", renderedHtml);
      } catch (err) {
        console.error("שגיאה בשליחת מייל לצוות:", err);
      }
    };
    sendEmailToAuth();
  };

  serviceUserToken = new UserTokenService();

  sendEmailWithContract = async (customer: CustomerModel, link: string) => {
    const token = await this.serviceUserToken.getSystemAccessToken();
    const template = await this.emailService.getTemplateByName(
      "שליחת חוזה ללקוח",
    );

    if (!token) {
      console.warn("the token is wrong");
      return;
    }

    if (!template) {
      console.warn("contract email template not found");
      return;
    }
    const renderedHtml = await this.emailService.renderTemplate(
      template.bodyHtml,
      {
        "name": customer.name,
        "link": link,
      },
    );

    await sendEmail(
      "me",
      {
        to: [customer.email ?? ""],
        subject: encodeSubject(template.subject),
        body: renderedHtml,
        isHtml: true,
      },
      token,
    );
    console.log(template.subject);
  };

  sendWellcomeMessageForEveryMember = async (name: string) => {
    console.log('🎉 Starting welcome message for:', name);
    
    const token = await this.serviceUserToken.getSystemAccessToken();
    if (!token) {
      console.error('❌ Token not available');
      return;
    }
    console.log('✅ Token obtained');

    const template = await this.emailService.getTemplateByName("ברוכה הבאה");
    if (!template) {
      console.error('❌ Welcome email template not found');
      return;
    }
    console.log('✅ Template found:', template.subject);

    const renderedHtml = await this.emailService.renderTemplate(
      template.bodyHtml,
      { "name": name }
    );
    console.log('✅ Template rendered');

    const customers = await this.getAll();
    console.log('👥 Total customers found:', customers.length);
    
    const validEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const emails = [
      ...new Set(
        customers
          .map((c) => c.email)
          .filter((email): email is string => 
            typeof email === "string" && 
            email.trim() !== "" && 
            validEmailRegex.test(email.trim())
          ),
      ),
    ];
    console.log('📧 Valid emails found:', emails.length, emails);

    if (emails.length === 0) {
      console.warn('⚠️ No valid email addresses found for customers');
      return;
    }

    try {
      const result = await sendEmail(
        "me",
        {
          to: emails,
          subject: encodeSubject(template.subject),
          body: renderedHtml,
          isHtml: true,
        },
        token,
      );
      console.log('✅ Welcome emails sent successfully to', emails.length, 'recipients');
      console.log('📧 Email result:', result);
    } catch (error) {
      console.error('❌ Failed to send welcome emails:', error);
      throw error;
    }
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
