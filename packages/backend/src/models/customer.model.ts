import { customer } from "../../../types/customer";

export class CustomerModel implements customer.Customer {
    id: string;
    name: string;
    email: string;
    phone: string;
    businessType: string;
    interestedIn: customer.WorkspaceType[];
    source: customer.LeadSource;
    status: customer.CustomerStatus;
    createdAt: Date;
    updatedAt: Date;

    constructor(
        id: string,
        name: string,
        email: string,
        phone: string,
        businessType: string,
        interestedIn: customer.WorkspaceType[],
        source: customer.LeadSource,
        status: customer.CustomerStatus,
        createdAt: Date,
        updatedAt: Date
    ) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.businessType = businessType;
        this.interestedIn = interestedIn;
        this.source = source;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}

export class CustomerPeriod implements customer.CustomerPeriod {
    startDate: Date;
    endDate: Date;
    status: customer.PeriodStatus;

    constructor(startDate: Date, endDate: Date, status: customer.PeriodStatus) {
        this.startDate = startDate;
        this.endDate = endDate;
        this.status = status;
    }
}

export class PaymentMethod implements customer.PaymentMethod {
    type: customer.PaymentMethodType;
    details: customer.PaymentMethodDetails;

    constructor(type: customer.PaymentMethodType, details: customer.PaymentMethodDetails) {
        this.type = type;
        this.details = details;
    }
}

export class CreateCustomerRequest implements customer.CreateCustomerRequest {
    name: string;
    phone: string;
    email: string;
    idNumber: string;
    businessName: string;
    businessType: string;
    workspaceType: customer.WorkspaceType;
    workspaceCount: number;
    contractSignDate: Date;
    contractStartDate: Date;
    billingStartDate: Date;
    notes?: string;
    invoiceName?: string;
    paymentMethod?: customer.PaymentMethodDetails;
    contractDocuments?: customer.FileReference[];

    constructor(
        name: string,
        phone: string,
        email: string,
        idNumber: string,
        businessName: string,
        businessType: string,
        workspaceType: customer.WorkspaceType,
        workspaceCount: number,
        contractSignDate: Date,
        contractStartDate: Date,
        billingStartDate: Date,
        notes?: string,
        invoiceName?: string,
        paymentMethod?: customer.PaymentMethodDetails,
        contractDocuments?: customer.FileReference[]
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

export class UpdateCustomerRequest implements customer.UpdateCustomerRequest {
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

export class GetCustomersRequest implements customer.GetCustomersRequest {
    status?: customer.CustomerStatus[];
    businessType?: string;
    workspaceType?: customer.WorkspaceType;
    search?: string;
    page?: number;
    pageSize?: number;

    constructor(
        status?: customer.CustomerStatus[],
        businessType?: string,
        workspaceType?: customer.WorkspaceType,
        search?: string,
        page?: number,
        pageSize?: number
    ) {
        this.status = status;
        this.businessType = businessType;
        this.workspaceType = workspaceType;
        this.search = search;
        this.page = page;
        this.pageSize = pageSize;
    }
}

export class RecordExitNoticeRequest implements customer.RecordExitNoticeRequest {
    customerId: string;
    exitDate: Date;
    reason: string;
    notes?: string;

    constructor(customerId: string, exitDate: Date, reason: string, notes?: string) {
        this.customerId = customerId;
        this.exitDate = exitDate;
        this.reason = reason;
        this.notes = notes;
    }
}

export class CompleteCustomerExitRequest implements customer.CompleteCustomerExitRequest {
    customerId: string;
    exitDate: Date;
    finalInvoiceAmount: number;
    notes?: string;

    constructor(customerId: string, exitDate: Date, finalInvoiceAmount: number, notes?: string) {
        this.customerId = customerId;
        this.exitDate = exitDate;
        this.finalInvoiceAmount = finalInvoiceAmount;
        this.notes = notes;
    }
}

export class AddContractDocumentRequest implements customer.AddContractDocumentRequest {
    customerId: string;
    document: customer.FileReference;

    constructor(customerId: string, document: customer.FileReference) {
        this.customerId = customerId;
        this.document = document;
    }
}

export class CustomerDeskChangeRequest implements customer.CustomerDeskChangeRequest {
    customerId: string;
    newWorkspaceType: customer.WorkspaceType;
    newWorkspaceCount: number;
    effectiveDate: Date;
    notes?: string;

    constructor(
        customerId: string,
        newWorkspaceType: customer.WorkspaceType,
        newWorkspaceCount: number,
        effectiveDate: Date,
        notes?: string
    ) {
        this.customerId = customerId;
        this.newWorkspaceType = newWorkspaceType;
        this.newWorkspaceCount = newWorkspaceCount;
        this.effectiveDate = effectiveDate;
        this.notes = notes;
    }
}

export class ExtendCustomerContractRequest implements customer.ExtendCustomerContractRequest {
    customerId: string;
    newEndDate: Date;
    notes?: string;

    constructor(customerId: string, newEndDate: Date, notes?: string) {
        this.customerId = customerId;
        this.newEndDate = newEndDate;
        this.notes = notes;
    }
}

export class ConvertLeadToCustomerRequest implements customer.ConvertLeadToCustomerRequest {
    leadId: string;
    workspaceType: customer.WorkspaceType;
    workspaceCount: number;
    contractSignDate: Date;
    contractStartDate: Date;
    billingStartDate: Date;
    notes?: string;
    paymentMethod?: customer.PaymentMethodDetails;
    contractDocuments?: customer.FileReference[];

    constructor(
        leadId: string,
        workspaceType: customer.WorkspaceType,
        workspaceCount: number,
        contractSignDate: Date,
        contractStartDate: Date,
        billingStartDate: Date,
        notes?: string,
        paymentMethod?: customer.PaymentMethodDetails,
        contractDocuments?: customer.FileReference[]
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




