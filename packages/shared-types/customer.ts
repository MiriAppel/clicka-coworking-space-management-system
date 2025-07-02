import { Person } from './person';
import { PaymentMethodType } from './billing';
import { ID, DateISO, FileReference } from './core';
export declare enum TimelineEventType {
    LEAD_CREATED = "LEAD_CREATED",
    INTERACTION = "INTERACTION",
    CONVERSION = "CONVERSION",
    CONTRACT_SIGNED = "CONTRACT_SIGNED",
    WORKSPACE_ASSIGNED = "WORKSPACE_ASSIGNED",
    PAYMENT_RECEIVED = "PAYMENT_RECEIVED",
    STATUS_CHANGE = "STATUS_CHANGE",
    NOTE_ADDED = "NOTE_ADDED"
}
export declare enum ContractStatus {
    DRAFT = "DRAFT",
    PENDING_SIGNATURE = "PENDING_SIGNATURE",
    SIGNED = "SIGNED",
    ACTIVE = "ACTIVE",
    EXPIRED = "EXPIRED",
    TERMINATED = "TERMINATED"
}
export declare enum WorkspaceType {
    PRIVATE_ROOM = "PRIVATE_ROOM",
    DESK_IN_ROOM = "DESK_IN_ROOM",
    OPEN_SPACE = "OPEN_SPACE",
    KLIKAH_CARD = "KLIKAH_CARD"
}
export declare enum CustomerStatus {
    ACTIVE = "ACTIVE",
    NOTICE_GIVEN = "NOTICE_GIVEN",
    EXITED = "EXITED",
    PENDING = "PENDING"
}
export declare enum ExitReason {
    RELOCATION = "RELOCATION",
    BUSINESS_CLOSED = "BUSINESS_CLOSED",
    PRICE = "PRICE",
    WORK_FROM_HOME = "WORK_FROM_HOME",
    SPACE_NEEDS = "SPACE_NEEDS",
    DISSATISFACTION = "DISSATISFACTION",
    OTHER = "OTHER"
}
export interface CustomerPeriod {
    id?: ID;
    customerId: ID;
    entryDate: DateISO;
    exitDate?: DateISO;
    exitNoticeDate?: DateISO;
    exitReason?: ExitReason;
    exitReasonDetails?: string;
    createdAt: DateISO;
    updatedAt: DateISO;
}
export interface ContractTerms {
    workspaceType: WorkspaceType;
    workspaceCount: number;
    monthlyRate: number;
    duration: number;
    renewalTerms: string;
    terminationNotice: number;
    specialConditions?: string[];
}
export interface Contract {
    id?: ID;
    customerId: ID;
    version: number;
    status: ContractStatus;
    signDate?: DateISO;
    startDate?: DateISO;
    endDate?: DateISO;
    terms?: ContractTerms;
    documents: FileReference[];
    signedBy?: string;
    witnessedBy?: string;
    createdAt: DateISO;
    updatedAt: DateISO;
}
export interface CustomerPaymentMethod {
    id?: ID;
    customerId: ID;
    creditCardLast4?: string;
    creditCardExpiry?: string;
    creditCardHolderIdNumber?: string;
    creditCardHolderPhone?: string;
    isActive: boolean;
    createdAt: DateISO;
    updatedAt: DateISO;
}
export interface Customer extends Person {
    id?: ID;
    name: string;
    phone: string;
    email: string;
    idNumber: string;
    businessName: string;
    businessType: string;
    status: CustomerStatus;
    currentWorkspaceType?: WorkspaceType;
    workspaceCount: number;
    contractSignDate?: DateISO;
    contractStartDate?: DateISO;
    billingStartDate?: DateISO;
    notes?: string;
    invoiceName?: string;
    contractDocuments?: FileReference[];
    paymentMethods: CustomerPaymentMethod[];
    periods?: CustomerPeriod[];
    createdAt: DateISO;
    updatedAt: DateISO;
}
export interface CreateCustomerRequest {
    name: string;
    phone: string;
    email: string;
    idNumber: string;
    businessName: string;
    businessType: string;
    workspaceType: WorkspaceType;
    workspaceCount: number;
    contractSignDate: DateISO;
    contractStartDate: DateISO;
    billingStartDate: DateISO;
    notes?: string;
    invoiceName?: string;
    paymentMethod?: {
        creditCardLast4?: string;
        creditCardExpiry?: string;
        creditCardHolderIdNumber?: string;
        creditCardHolderPhone?: string;
    };
    paymentMethodType: PaymentMethodType;
    contractDocuments?: FileReference[];
}
export interface UpdateCustomerRequest {
    name?: string;
    phone?: string;
    email?: string;
    idNumber?: string;
    businessName?: string;
    businessType?: string;
    notes?: string;
    invoiceName?: string;
    status?: CustomerStatus;
}
export interface GetCustomersRequest {
    status?: CustomerStatus[];
    workspaceType?: WorkspaceType[];
    search?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortDirection?: 'asc' | 'desc';
}
export interface RecordExitNoticeRequest {
    exitNoticeDate: DateISO;
    plannedExitDate: DateISO;
    exitReason: ExitReason;
    exitReasonDetails?: string;
}
export interface CompleteCustomerExitRequest {
    actualExitDate: DateISO;
    exitReason: ExitReason;
    exitReasonDetails?: string;
    finalNotes?: string;
}
export interface AddContractDocumentRequest {
    document: FileReference;
    description?: string;
}
export interface CustomerDeskChangeRequest {
    newWorkspaceType: WorkspaceType;
    newWorkspaceCount: number;
    effectiveDate: DateISO;
    notes?: string;
}
export interface ExtendCustomerContractRequest {
    newEndDate: DateISO;
    notes?: string;
}
export interface ConvertLeadToCustomerRequest {
    leadId: ID;
    workspaceType: WorkspaceType;
    businessName: string;
    invoiceName: string;
    workspaceCount: number;
    contractSignDate: DateISO;
    contractStartDate: DateISO;
    billingStartDate: DateISO;
    notes?: string;
    paymentMethod?: {
        creditCardLast4?: string;
        creditCardExpiry?: string;
        creditCardHolderIdNumber?: string;
        creditCardHolderPhone?: string;
    };
    paymentMethodType: PaymentMethodType;
    contractDocuments?: FileReference[];
}
export interface StatusChangeRequest {
    newStatus: CustomerStatus;
    effectiveDate: DateISO;
    reason?: string;
    notes?: string;
    notifyCustomer: boolean;
}
export interface StatusChangeRequest {
    newStatus: CustomerStatus;
    effectiveDate: DateISO;
    reason?: string;
    notes?: string;
    notifyCustomer: boolean;
}
