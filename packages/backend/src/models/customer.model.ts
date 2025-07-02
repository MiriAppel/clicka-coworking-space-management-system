
// import type { Contract, Customer, CustomerPaymentMethod, CustomerPeriod, CustomerStatus, DateISO, FileReference, ID, PaymentMethodType, WorkspaceType } from "shared-types";

// export class CustomerModel implements Customer {
//   id?: ID; //PK
//   name: string;
//   phone: string;
//   email: string;
//   idNumber: string; //identity card
//   businessName: string;
//   businessType: string;
//   status: CustomerStatus;
//   currentWorkspaceType?: WorkspaceType;
//   workspaceCount: number;
//   contractSignDate?: string;
//   contractStartDate?: string;
//   billingStartDate?: string;
//   notes?: string;
//   invoiceName?: string;
//   // contractDocuments?: FileReference[];
//   //paymentMethods: PaymentMethod[];  // ללקוח יכולים להיות כמה אמצעי תשלום שונים – למשל שני כרטיסים. כל אמצעי תשלום שייך ללקוח אחד.
//   paymentMethodsType: PaymentMethodType;
//   periods?: CustomerPeriod[];
//   // contracts: Contract[];  // One customer can have several contracts. 1:N
//   createdAt: DateISO;
//   updatedAt: DateISO;

//   constructor(
//     id: string,
//     name: string,
//     phone: string,
//     email: string,
//     paymentMethods: CustomerPaymentMethod[],
//     idNumber: string,
//     businessName: string,
//     businessType: string,
//     status: CustomerStatus,
//     workspaceCount: number,
//     createdAt: DateISO,
//     updatedAt: DateISO,
//     paymentMethodsType: PaymentMethodType,
//     currentWorkspaceType?: WorkspaceType,
//     contractSignDate?: string,
//     contractStartDate?: string,
//     billingStartDate?: string,
//     notes?: string,
//     invoiceName?: string,
//     // contractDocuments?: FileReference[],
//     periods?: CustomerPeriod[] | undefined,
//     // contracts: Contract[] = []
//   ) {
//     this.id = id || undefined;
//     this.name = name;
//     this.phone = phone;
//     this.email = email;
//     this.idNumber = idNumber;
//     this.businessName = businessName;
//     this.businessType = businessType;
//     this.status = status;
//     this.currentWorkspaceType = currentWorkspaceType;
//     this.workspaceCount = workspaceCount;
//     this.contractSignDate = contractSignDate;
//     this.contractStartDate = contractStartDate;
//     this.billingStartDate = billingStartDate;
//     this.notes = notes;
//     this.invoiceName = invoiceName;
//     // this.contractDocuments = contractDocuments;
//     this.paymentMethods = paymentMethods;
//     this.paymentMethodsType = paymentMethodsType;
//     this.periods = periods;
//     // this.contracts = contracts;
//     this.createdAt = createdAt;
//     this.updatedAt = updatedAt;
//   }
//   paymentMethods: CustomerPaymentMethod[];


//   toDatabaseFormat() {
//     return {
//       name: this.name,
//       email: this.email,
//       phone: this.phone,
//       id_number: this.idNumber,
//       business_name: this.businessName,
//       business_type: this.businessType,
//       status: this.status,
//       current_workspace_type: this.currentWorkspaceType,
//       workspace_count: this.workspaceCount,
//       contract_sign_date: this.contractSignDate,
//       contract_start_date: this.contractStartDate,
//       billing_start_date: this.billingStartDate,
//       notes: this.notes,
//       invoice_name: this.invoiceName,
//       // contract_documents: this.contractDocuments,
//       // paymentMethods: this.paymentMethods,
//       payment_methods_type: this.paymentMethodsType,
//       // periods: this.periods,
//       // contracts: this.contracts,
//       created_at: this.createdAt,
//       updated_at: this.updatedAt
//     };
//   }
//   static fromDatabaseFormat(dbData: any): CustomerModel {
//     return new CustomerModel(
//       dbData.id,
//       dbData.name,
//       dbData.phone,
//       dbData.email,
//       dbData.paymentMethods,
//       dbData.id_number,
//       dbData.business_name,
//       dbData.business_type,
//       dbData.status,
//       dbData.workspace_count,
//       dbData.created_at,
//       dbData.updated_at,
//       dbData.payment_methods_type,
//       dbData.current_workspace_type,
//       dbData.contract_sign_date,
//       dbData.contract_start_date,
//       dbData.billing_start_date,
//       dbData.notes,
//       dbData.invoice_name,
//       //dbData.contract_documents,
//       // dbData.periods,
//       // dbData.contracts,

//     );
//   }
//   static fromDatabaseFormatArray(dbDataArray: any[]): CustomerModel[] {
//     return dbDataArray.map(dbData => CustomerModel.fromDatabaseFormat(dbData));
//   }
// }