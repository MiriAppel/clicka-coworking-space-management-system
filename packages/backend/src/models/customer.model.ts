import { FileReference } from "../types/core";
import { Contract, Customer, CustomerPeriod, CustomerStatus, PaymentMethod, WorkspaceType } from "../types/customer";


export class CustomerModel implements Customer   {
  id: string;
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
  createdAt: string;
  updatedAt: string;

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
    createdAt: string,
    updatedAt: string,
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

  toDatabaseFormat() {
    return {
      id: this.id,
      name: this.name,
      phone: this.phone,
      email: this.email,
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
      contractDocuments: this.contractDocuments ? this.contractDocuments.map(doc => ({
        id: doc.id,
        name: doc.name,
        path: doc.path,
        mimeType: doc.mimeType,
        size: doc.size,
        url: doc.url,
        googleDriveId: doc.googleDriveId,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt
      })) : [],
      paymentMethods: this.paymentMethods.map(pm => ({
        id: pm.id,
        customerId: pm.customerId,
        creditCardLast4: pm.creditCardLast4,
        creditCardExpiry: pm.creditCardExpiry,
        creditCardHolderIdNumber: pm.creditCardHolderIdNumber,
        creditCardHolderPhone: pm.creditCardHolderPhone,
        isActive: pm.isActive,
        createdAt: pm.createdAt,
        updatedAt: pm.updatedAt
      })),
      periods: this.periods.map(period => ({
        id: period.id,
        customerId: period.customerId,
        entryDate: period.entryDate,
        exitDate: period.exitDate,
        exitNoticeDate: period.exitNoticeDate,
        exitReason: period.exitReason,
        exitReasonDetails: period.exitReasonDetails,
        createdAt: period.createdAt,
        updatedAt: period.updatedAt
      })),
      contracts: this.contracts.map(contract => ({
        id: contract.id,
        customerId: contract.customerId,
        version: contract.version,
        status: contract.status,
        startDate: contract.startDate,
        signDate: contract.signDate,
        endDate: contract.endDate,
        terms: contract.terms ? {
          workspaceType: contract.terms.workspaceType,
          workspaceCount: contract.terms.workspaceCount,
          monthlyRate: contract.terms.monthlyRate,
          duration: contract.terms.duration,
          renewalTerms: contract.terms.renewalTerms,
          terminationNotice: contract.terms.terminationNotice,
          specialConditions: contract.terms.specialConditions
        } : undefined,
        documents: contract.documents ? contract.documents.map(doc => ({
          id: doc.id,
          name: doc.name,
          path: doc.path,
          mimeType: doc.mimeType,
          size: doc.size,
          url: doc.url,
          googleDriveId: doc.googleDriveId,
          createdAt: doc.createdAt,
          updatedAt: doc.updatedAt
        })) : [],
        modifications: contract.modifications ? contract.modifications.map(mod => ({
          id: mod.id,
          date: mod.date,
          description: mod.description,
          modifiedByUserId: mod.modifiedByUserId,
          approvedByUserId: mod.approvedByUserId,
          documentChanges: mod.documentChanges ? mod.documentChanges.map(doc => ({
            id: doc.id,
            name: doc.name,
            path: doc.path,
            mimeType: doc.mimeType,
            size: doc.size,
            url: doc.url,
            googleDriveId: doc.googleDriveId,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt
          })) : []
        })) : [],
        signedBy: contract.signedBy,
        witnessedBy: contract.witnessedBy,
        createdAt: contract.createdAt,
        updatedAt: contract.updatedAt
      })),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}
