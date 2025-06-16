import path from "path";
import { DateISO, FileReference, ID } from "../types/core";
import { Contract, ContractModification, ContractStatus, ContractTerms, WorkspaceType } from "../types/customer";


export class ContractModel implements Contract {
  
  id: ID; // PK
  customerId: ID; // FK.  כל חוזה שייך ללקוח אחד בלבד. אבל ללקוח יכולים להיות כמה חוזים לאורך זמן – למשל, הוא חתם שוב אחרי שנה, או שינה תנאים.
  version: number;
  status: ContractStatus;
  signDate?: string;
  startDate?: string;
  endDate?: string;
  terms?: ContractTerms;
  documents: FileReference[];
  modifications: ContractModification[];
  signedBy?: string;
  witnessedBy?: string;
  createdAt: DateISO;
  updatedAt: DateISO;

  constructor(
    id: ID,
    customerId: ID,
    version: number,
    status: ContractStatus,
    startDate: string,
    documents: FileReference[],
    modifications: ContractModification[],
    createdAt: string,
    updatedAt: string,
    signDate?: string,
    endDate?: string,
    terms?: ContractTerms,
    signedBy?: DateISO,
    witnessedBy?: DateISO
  ) {
    this.id = id;
    this.customerId = customerId;
    this.version = version;
    this.status = status;
    this.signDate = signDate;
    this.startDate = startDate;
    this.endDate = endDate;
    this.terms = terms;
    this.documents = documents;
    this.modifications = modifications;
    this.signedBy = signedBy;
    this.witnessedBy = witnessedBy;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  toDatabaseFormat?() {
    return {
      id: this.id,
      customerId: this.customerId,
      version: this.version,
      status: this.status,
      signDate: this.signDate,
      startDate: this.startDate,
      endDate: this.endDate,
      terms: this.terms ? {
        workspaceType: this.terms.workspaceType,
        workspaceCount: this.terms.workspaceCount,
        monthlyRate: this.terms.monthlyRate,
        duration: this.terms.duration,
        renewalTerms: this.terms.renewalTerms,
        terminationNotice: this.terms.terminationNotice,
        specialConditions: this.terms.specialConditions
      } : undefined,
      documents: this.documents.map(doc => ({
        id: doc.id,
        name: doc.name,
        path: doc.path,
        mimeType: doc.mimeType,
        size: doc.size,
        url: doc.url,
        googleDriveId: doc.googleDriveId,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt
      })),
      modifications: this.modifications.map(mod => ({
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
      })),
      signedBy: this.signedBy,
      witnessedBy: this.witnessedBy,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };   
  }
}

export class ContractTermsModel implements ContractTerms {

  workspaceType: WorkspaceType;
  workspaceCount: number;
  monthlyRate: number;
  duration: number;
  renewalTerms: string;
  terminationNotice: number;
  specialConditions?: string[];

  constructor(
    workspaceType: WorkspaceType,
    workspaceCount: number,
    monthlyRate: number,
    duration: number,
    renewalTerms: string,
    terminationNotice: number,
    specialConditions?: string[]
  ) {
    this.workspaceType = workspaceType;
    this.workspaceCount = workspaceCount;
    this.monthlyRate = monthlyRate;
    this.duration = duration;
    this.renewalTerms = renewalTerms;
    this.terminationNotice = terminationNotice;
    this.specialConditions = specialConditions;
  }

  toDatabaseFormat?() {
    return {
      workspaceType: this.workspaceType,
      workspaceCount: this.workspaceCount,
      monthlyRate: this.monthlyRate,
      duration: this.duration,
      renewalTerms: this.renewalTerms,
      terminationNotice: this.terminationNotice,
      specialConditions: this.specialConditions
    };
  }
}
