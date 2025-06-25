import path from "path";

import type{ Contract, ContractStatus, ContractTerms, DateISO, FileReference, ID } from "shared-types";

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
    this.signedBy = signedBy;
    this.witnessedBy = witnessedBy;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  toDatabaseFormat?() {
    return {
      id: this.id,
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
      updated_at: this.updatedAt
    };   
  }
}
