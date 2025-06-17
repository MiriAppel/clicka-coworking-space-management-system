import { PaymentMethodType } from "../../../../types/billing";
import { DateISO, FileReference, ID } from "../../../../types/core";
import { Contract, Customer, CustomerPeriod, CustomerStatus, ExitReason, PaymentMethod, RecordExitNoticeRequest, WorkspaceType } from "../../../../types/customer";


export class CustomerModel implements Customer   {
  id: ID; //PK
  name: string;
  phone: string;
  email: string;
  idNumber: string; //identity card
  businessName: string;
  businessType: string;
  status: CustomerStatus;
  currentWorkspaceType?: WorkspaceType;
  workspaceCount: number;
  contractSignDate?: string;
  contractStartDate?: string;
  billingStartDate?: string;
  notes?: string;
  invoiceName?: string;
  contractDocuments?: FileReference[];
  //paymentMethods: PaymentMethod[];  // ללקוח יכולים להיות כמה אמצעי תשלום שונים – למשל שני כרטיסים. כל אמצעי תשלום שייך ללקוח אחד.
  paymentMethodsType: PaymentMethodType;    
  periods: CustomerPeriod[];
  contracts: Contract[];  // One customer can have several contracts. 1:N
  createdAt: DateISO;
  updatedAt: DateISO;

  constructor(
    id: string,
    name: string,
    phone: string,
    email: string,
    idNumber: string,
    businessName: string,
    businessType: string,
    status: CustomerStatus,
    workspaceCount: number,
    createdAt: DateISO,
    updatedAt: DateISO,
    paymentMethodsType: PaymentMethodType,
    currentWorkspaceType?: WorkspaceType,
    contractSignDate?: string,
    contractStartDate?: string,
    billingStartDate?: string,
    notes?: string,
    invoiceName?: string,
    contractDocuments?: FileReference[],
    //paymentMethods: PaymentMethod[] = [],
    periods: CustomerPeriod[] = [],
    contracts: Contract[] = []
  ) {
    this.id = id;
    this.name = name;
    this.phone = phone;
    this.email = email;
    this.idNumber = idNumber;
    this.businessName = businessName;
    this.businessType = businessType;
    this.status = status;
    this.currentWorkspaceType = currentWorkspaceType;
    this.workspaceCount = workspaceCount;
    this.contractSignDate = contractSignDate;
    this.contractStartDate = contractStartDate;
    this.billingStartDate = billingStartDate;
    this.notes = notes;
    this.invoiceName = invoiceName;
    this.contractDocuments = contractDocuments;
   //this.paymentMethods = paymentMethods;
    this.paymentMethodsType = paymentMethodsType;
    this.periods = periods;
    this.contracts = contracts;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  toDatabaseFormat?() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      phone: this.phone,
      idNumber: this.idNumber,
      businessName: this.businessName,
      businessType: this.businessType,
      status: this.status,
      currentWorkspaceType: this.currentWorkspaceType,
      workspaceCount: this.workspaceCount,
      contractSignDate: this.contractSignDate,
      contractStartDate: this.contractStartDate,
      billingStartDate: this.billingStartDate,
      notes: this.notes,
      invoiceName: this.invoiceName,
      contractDocuments: this.contractDocuments,
     // paymentMethods: this.paymentMethods,
      paymentMethodsType: this.paymentMethodsType,
      periods: this.periods,
      contracts: this.contracts,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}
