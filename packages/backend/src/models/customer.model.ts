<<<<<<< HEAD
import { DateISO, FileReference, ID } from "../types/core";
import { AddContractDocumentRequest, CompleteCustomerExitRequest, ConvertLeadToCustomerRequest, CreateCustomerRequest, Customer, CustomerDeskChangeRequest, CustomerPeriod, CustomerStatus, ExitReason, ExtendCustomerContractRequest, GetCustomersRequest, PaymentMethod, RecordExitNoticeRequest, UpdateCustomerRequest, WorkspaceType } from "../types/customer";

export class CustomerModel implements Customer {

    id: ID;
    name: string;
    phone: string;
    email: string;
    idNumber: string;
    businessName: string;
    businessType: string;
    status: CustomerStatus[];
    currentWorkspaceType?: WorkspaceType;
    workspaceCount: number;
    contractSignDate?: DateISO;
    contractStartDate?: DateISO;
    billingStartDate?: DateISO;
    notes?: string;
    invoiceName?: string;
    contractDocuments?: FileReference[];
    paymentMethods: PaymentMethod[];
    periods: CustomerPeriod[];
    createdAt: DateISO;
    updatedAt: DateISO;

    constructor(
        id: ID,
        name: string,
        phone: string,
        email: string,
        idNumber: string,
        businessName: string,
        businessType: string,
        status: CustomerStatus[],
        workspaceCount: number,
        contractSignDate?: DateISO,
        contractStartDate?: DateISO,
        billingStartDate?: DateISO,
        notes?: string,
        invoiceName?: string,
        contractDocuments?: FileReference[],
        paymentMethods: PaymentMethod[] = [],
        periods: CustomerPeriod[] = [],
        createdAt: DateISO = new Date().toISOString(),
        updatedAt: DateISO = new Date().toISOString()
    ) {
        this.id = id;
        this.name = name;
        this.phone = phone;
        this.email = email;
        this.idNumber = idNumber;
        this.businessName = businessName;
        this.businessType = businessType;
        this.status = status;
        this.workspaceCount = workspaceCount;
        this.contractSignDate = contractSignDate;
        this.contractStartDate = contractStartDate;
        this.billingStartDate = billingStartDate;
        this.notes = notes;
        this.invoiceName = invoiceName;
        this.contractDocuments = contractDocuments;
        this.paymentMethods = paymentMethods;
        this.periods = periods;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }   
}

export class CustomerPeriodModel implements CustomerPeriod {

    id: ID;
    customerId: ID;
    entryDate: DateISO;
    exitDate?: DateISO;
    exitNoticeDate?: DateISO;
    exitReason?: ExitReason;
    exitReasonDetails?: string;
    createdAt: DateISO;
    updatedAt: DateISO;

    constructor(
        id: ID,
        customerId: ID,
        entryDate: DateISO,
        exitDate?: DateISO,
        exitNoticeDate?: DateISO,
        exitReason?: ExitReason,
        exitReasonDetails?: string,
        createdAt: DateISO = new Date().toISOString(),
        updatedAt: DateISO = new Date().toISOString()
    ) {
        this.id = id;
        this.customerId = customerId;
        this.entryDate = entryDate;
        this.exitDate = exitDate;
        this.exitNoticeDate = exitNoticeDate;
        this.exitReason = exitReason;
        this.exitReasonDetails = exitReasonDetails;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}

export class PaymentMethodModel implements PaymentMethod {

    id: ID;
    customerId: ID;
    creditCardLast4?: string;
    creditCardExpiry?: string;
    creditCardHolderIdNumber?: string;
    creditCardHolderPhone?: string;
    isActive: boolean;
    createdAt: DateISO;
    updatedAt: DateISO;

    constructor(
        id: ID,
        customerId: ID,
        creditCardLast4?: string,
        creditCardExpiry?: string,
        creditCardHolderIdNumber?: string,
        creditCardHolderPhone?: string,
        isActive: boolean = true,
        createdAt: DateISO = new Date().toISOString(),
        updatedAt: DateISO = new Date().toISOString()
    ) {
        this.id = id;
        this.customerId = customerId;
        this.creditCardLast4 = creditCardLast4;
        this.creditCardExpiry = creditCardExpiry;
        this.creditCardHolderIdNumber = creditCardHolderIdNumber;
        this.creditCardHolderPhone = creditCardHolderPhone;
        this.isActive = isActive;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}

export class CreateCustomerRequestModel implements CreateCustomerRequest {

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
    contractDocuments?: FileReference[];

    constructor(
        name: string,
        phone: string,
        email: string,
        idNumber: string,
        businessName: string,
        businessType: string,
        workspaceType: WorkspaceType,
        workspaceCount: number,
        contractSignDate: DateISO,
        contractStartDate: DateISO,
        billingStartDate: DateISO,
        notes?: string,
        invoiceName?: string,
        paymentMethod?: {
            creditCardLast4?: string;
            creditCardExpiry?: string;
            creditCardHolderIdNumber?: string;
            creditCardHolderPhone?: string;
            },
        contractDocuments?: FileReference[]
    ) {
        this.name = name;
        this.phone = phone;
        this.email = email;
        this.idNumber = idNumber;
        this.businessName = businessName;
        this.businessType = businessType;
        this.workspaceType = workspaceType;
        this.workspaceCount = workspaceCount;
        this.contractSignDate = contractSignDate;
        this.contractStartDate = contractStartDate;
        this.billingStartDate = billingStartDate;
        this.notes = notes;
        this.invoiceName = invoiceName;
        this.paymentMethod = paymentMethod;
        this.contractDocuments = contractDocuments;
    }
}

export class UpdateCustomerRequestModel implements UpdateCustomerRequest {

    name?: string;
    phone?: string;
    email?: string;
    idNumber?: string;
    businessName?: string;
    businessType?: string;
    notes?: string;
    invoiceName?: string;

    constructor(
        name?: string,
        phone?: string,
        email?: string,
        idNumber?: string,
        businessName?: string,
        businessType?: string,
        notes?: string,
        invoiceName?: string
    ) {
        this.name = name;
        this.phone = phone;
        this.email = email;
        this.idNumber = idNumber;
        this.businessName = businessName;
        this.businessType = businessType;
        this.notes = notes;
        this.invoiceName = invoiceName;
    }
}

export class GetCustomersRequestModel implements GetCustomersRequest {

    status?: CustomerStatus[];
    workspaceType?: WorkspaceType[];
    businessType?: string;
    search?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortDirection?: 'asc' | 'desc';

    constructor(params: {
        status?: CustomerStatus[];
        workspaceType?: WorkspaceType[];
        businessType?: string;
        search?: string;
        page?: number;
        limit?: number;
        sortBy?: string;
        sortDirection?: 'asc' | 'desc';
    } = {}) {
        this.status = params.status;
        this.workspaceType = params.workspaceType;
        this.businessType = params.businessType;
        this.search = params.search;
        this.page = params.page ?? 1;
        this.limit = params.limit ?? 10;
        this.sortBy = params.sortBy;
        this.sortDirection = params.sortDirection;
    }
}


export class RecordExitNoticeRequestModel implements RecordExitNoticeRequest {

    exitNoticeDate: DateISO;
    plannedExitDate: DateISO;
    exitReason: ExitReason;
    exitReasonDetails?: string;

    constructor(
        exitNoticeDate: DateISO,
        plannedExitDate: DateISO,
        exitReason: ExitReason,
        exitReasonDetails?: string
    ) {
        this.exitNoticeDate = exitNoticeDate;
        this.plannedExitDate = plannedExitDate;
        this.exitReason = exitReason;
        this.exitReasonDetails = exitReasonDetails;
    }
}

export class CompleteCustomerExitRequestModel implements CompleteCustomerExitRequest {

    actualExitDate: DateISO;
    exitReason: ExitReason;
    exitReasonDetails?: string;
    finalNotes?: string;

    constructor(
        actualExitDate: DateISO,
        exitReason: ExitReason,
        exitReasonDetails?: string,
        finalNotes?: string
    ) {
        this.actualExitDate = actualExitDate;
        this.exitReason = exitReason;
        this.exitReasonDetails = exitReasonDetails;
        this.finalNotes = finalNotes;
    }
}

export class AddContractDocumentRequestModel implements AddContractDocumentRequest {

    document: FileReference;
    description?: string;

    constructor(document: FileReference, description?: string) {
        this.document = document;
        this.description = description;
    }
}

export class CustomerDeskChangeRequestModel implements CustomerDeskChangeRequest {

    newWorkspaceType: WorkspaceType;
    newWorkspaceCount: number;
    effectiveDate: DateISO;
    notes?: string;

    constructor(newWorkspaceType: WorkspaceType, newWorkspaceCount: number, effectiveDate: DateISO, notes?: string) {
        this.newWorkspaceType = newWorkspaceType;
        this.newWorkspaceCount = newWorkspaceCount;
        this.effectiveDate = effectiveDate;
        this.notes = notes;
    }
}

export class ExtendCustomerContractRequestModel implements ExtendCustomerContractRequest {

    newEndDate: DateISO;
    notes?: string;

    constructor(newEndDate: DateISO, notes?: string) {
        this.newEndDate = newEndDate;
        this.notes = notes;
    }
}

export class ConvertLeadToCustomerRequestModel implements ConvertLeadToCustomerRequest {

    leadId: ID;
    workspaceType: WorkspaceType;
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
    contractDocuments?: FileReference[];

    constructor(
        leadId: ID,
        workspaceType: WorkspaceType,
        workspaceCount: number,
        contractSignDate: DateISO,
        contractStartDate: DateISO,
        billingStartDate: DateISO,
        notes?: string,
        paymentMethod?: {
            creditCardLast4?: string;
            creditCardExpiry?: string;
            creditCardHolderIdNumber?: string;
            creditCardHolderPhone?: string;
        },
        contractDocuments?: FileReference[]
    ) {
        this.leadId = leadId;
        this.workspaceType = workspaceType;
        this.workspaceCount = workspaceCount;
        this.contractSignDate = contractSignDate;
        this.contractStartDate = contractStartDate;
        this.billingStartDate = billingStartDate;
        this.notes = notes;
        this.paymentMethod = paymentMethod;
        this.contractDocuments = contractDocuments;
    } 
}





