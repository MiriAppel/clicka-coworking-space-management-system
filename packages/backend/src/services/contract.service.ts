import { ContractModel } from "../models/contract.model";
import { DateISO, FileReference, ID } from "../../../../types/core";
import { baseService } from "./baseService";
import { Contract, ContractStatus } from "../../../../types/customer";
import { supabase } from "../db/supabaseClient";

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
      const { data, error } = await supabase
    .from("contracts")
    .select("*")
    .eq("customerId", customerId);

  if (error) {
    console.error("שגיאה בעת שליפת החוזים:", error.message);
    throw new Error("לא ניתן לשלוף את החוזים עבור לקוח זה.");
  }
  return data as Contract[];

  };

  getContractsEndingSoon = async (days: number = 30): Promise<Contract[]> => {

    const today = new Date();
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + days);

    //קודם שולף את כל החוזים
    const allContracts = await this.getByFilters({}); 
    
    // ואז מסנן אותם לפי התאריך
    return allContracts.filter(contract => {

      if (!contract.endDate) return false;   
        return new Date(contract.endDate) <= targetDate;

    }); 

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

    const contract = await this.getById(customerId);

    const document = contract.documents.filter(doc => doc.id !== documentId);

    await this.patch( { documents: document }, customerId);

  };

}
