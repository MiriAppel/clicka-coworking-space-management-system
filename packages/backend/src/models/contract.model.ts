import path from "path";
import { DateISO, FileReference, ID } from "../types/core";
import { Contract, ContractStatus, WorkspaceType } from "../types/customer";


export class ContractModel implements Contract {
  
  id: ID; // PK
  customerId: ID; // FK.  כל חוזה שייך ללקוח אחד בלבד. אבל ללקוח יכולים להיות כמה חוזים לאורך זמן – למשל, הוא חתם שוב אחרי שנה, או שינה תנאים.
  version: number;
  status: ContractStatus;
  signDate?: string;
  startDate?: string;
  endDate?: string;
  terms?: string;
  documents: FileReference[];
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
    createdAt: string,
    updatedAt: string,
    signDate?: string,
    endDate?: string,
    terms?: string,
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
      terms: this.terms,
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
      signedBy: this.signedBy,
      witnessedBy: this.witnessedBy,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };   
  }
}
