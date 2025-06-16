import { DateISO, FileReference, ID } from '../types/core';
import { ContractModification } from '../types/customer';

export class ContractModificationModel implements ContractModification {
    id: ID;
    date: DateISO;
    description: string;
    modifiedByUserId: ID;
    approvedByUserId?: ID;
    documentChanges?: FileReference[]; 

    constructor(
        id: ID,
        date: DateISO,
        description: string,
        modifiedByUserId: ID,
        approvedByUserId?: ID,
        documentChanges?: FileReference[]
    ) {
        this.id = id;
        this.date = date;
        this.description = description;
        this.modifiedByUserId = modifiedByUserId;
        this.approvedByUserId = approvedByUserId;
        this.documentChanges = documentChanges;
    }

    toDatabaseFormat() {
      return {
        id: this.id,
        date: this.date,
        description: this.description,
        modifiedByUserId: this.modifiedByUserId,
        approvedByUserId: this.approvedByUserId,
        documentChanges: this.documentChanges ? this.documentChanges.map(doc => ({
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
      };
    }

}
                


