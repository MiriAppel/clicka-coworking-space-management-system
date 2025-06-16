import { DateISO, FileReference, ID } from "../types/core";
import { Contract, Customer, CustomerPeriod, CustomerStatus, ExitReason, PaymentMethod, RecordExitNoticeRequest, WorkspaceType } from "../types/customer";


export class CustomerModel implements Customer   {
  id?: ID;
  name: string;
  phone: string;
  email: string;
  idNumber: string;
  businessName: string;
  businessType: string;
  status: CustomerStatus;
  currentWorkspaceType?: WorkspaceType[];
  workspaceCount: number;
  contractSignDate?: string;
  contractStartDate?: string;
  billingStartDate?: string;
  notes?: string;
  invoiceName?: string;
  contractDocuments?: FileReference[];
  paymentMethods: PaymentMethod[];
  periods: CustomerPeriod[];
  contracts: Contract[];
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
    currentWorkspaceType?: WorkspaceType[],
    contractSignDate?: string,
    contractStartDate?: string,
    billingStartDate?: string,
    notes?: string,
    invoiceName?: string,
    contractDocuments?: FileReference[],
    paymentMethods: PaymentMethod[] = [],
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
    this.paymentMethods = paymentMethods;
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
      paymentMethods: this.paymentMethods,
      periods: this.periods,
      contracts: this.contracts,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

export class exit_noticesModel implements RecordExitNoticeRequest {

  customerId: ID;
  exitNoticeDate: string;
  plannedExitDate: string;
  exitReason: ExitReason;
  exitReasonDetails?: string | undefined;

    constructor(data: {
    customerId: ID;
    exitNoticeDate: string;
    plannedExitDate: string;
    exitReason: ExitReason;
    exitReasonDetails?: string;
  }) {
    this.customerId = data.customerId;
    this.exitNoticeDate = data.exitNoticeDate;
    this.plannedExitDate = data.plannedExitDate;
    this.exitReason = data.exitReason;
    this.exitReasonDetails = data.exitReasonDetails;
  }

  toDatabaseFormat() {
    return {
      customer_id: this.customerId,
      exit_notice_date: this.exitNoticeDate,
      planned_exit_date: this.plannedExitDate,
      exit_reason: this.exitReason,
      exit_reason_details: this.exitReasonDetails ?? null,
    };
  }
  
}