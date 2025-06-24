
import { ContractStatus } from "shared-types";
import type { Contract, DateISO, FileReference, ID } from "shared-types";
import { ContractModel } from "../models/contract.model";
import { baseService } from "./baseService";

export class contractService extends baseService<ContractModel> {
  constructor() {
    super("ContractModel");
  }


  updateContractTerms = async (
    contactId: ID,
    terms: any
  ): Promise<ContractModel> => {
    // אמור לעדכן את התנאים של החוזה עבור ה-contactId הנתון
    // הנח שהחוזה הוא אובייקט עם מזהה, תנאים, תאריכים, סטטוס וכו'

    const contract: ContractModel = {
      id: contactId,
      terms: terms,
      startDate: new Date().toISOString() as DateISO,
      endDate: new Date(
        new Date().setFullYear(new Date().getFullYear() + 1)
      ).toISOString() as DateISO,
      customerId: "customer-id", // הנח שהחוזה שייך ללקוח עם מזהה זה
      status: ContractStatus.ACTIVE, // הנח שהחוזה פעיל
      signDate: undefined, // הנח שהחוזה לא נחתם עדיין
      documents: [], // הנח שאין מסמכים כרגע
      version: 1, // הנח שהחוזה הוא גרסה 1
      createdAt: new Date().toISOString() as DateISO,
      updatedAt: new Date().toISOString() as DateISO,
      signedBy: undefined, // הנח שהחוזה לא נחתם על ידי אף אחד
      witnessedBy: undefined, // הנח שהחוזה לא נחתם על ידי עדים
    };
    await this.patch(contract ,contactId);
    return contract; // להחזיר את החוזה המעודכן
  };
  
  getAllContractsByCustomerId = async (customerId: ID): Promise<Contract[]> => {
    // אמור לשלוף את כל החוזים עבור הלקוח עם ה-customerId הנתון
    return []; // להחזיר מערך של חוזים
  };
  getContractsEndingSoon = async (days: number = 30): Promise<Contract[]> => {
    // אמור לשלוף את החוזים שהתוקף שלהם מסתיים בעוד 30 יום
    return []; // להחזיר מערך של חוזים
  };

  postContractDocument = async (
    documentToAdd: FileReference,
    id: ID
  ): Promise<void> => {
    const contract = await this.getById(id);
    contract.documents.push(documentToAdd);
  };


  //מוחק את הקובץ מהמערך שהid documentIdשלו שווה ל
  deleteContractDocument = async (customerId: ID, documentId: ID): Promise<void> => {
    //איזה מסמך?
    //מחיקת מסמך מהחוזה
  };

}
