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
  ): Promise<Contract> => {
    // אמור לעדכן את התנאים של החוזה עבור ה-contactId הנתון
    // הנח שהחוזה הוא אובייקט עם מזהה, תנאים, תאריכים, סטטוס וכו'

    const contract: Contract = {
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
    // אמור לשלוף את החוזים שהתוקף שלהם מסתיים בעוד 30 יום
  const now = new Date();
  const thresholdDate = new Date();
  thresholdDate.setDate(now.getDate() + days);

  // נניח שיש לך פונקציה שמחזירה את כל החוזים
  const allContracts: Contract[] = await this.getAll();

  return allContracts.filter(contract => {
    if (!contract.endDate) return false;
    
    const end = new Date(contract.endDate);
    return end >= now && end <= thresholdDate;
  });
    return []; // להחזיר מערך של חוזים
  };

  // export const postContractDocument = async (document: AddContractDocumentRequest, id: ID): Promise<void> => {

  //     const contract: ContractModel = {

  //         customerId: id,
  //         version: 1,
  //         status: ContractStatus.DRAFT,
  //         signDate: undefined,
  //         startDate: undefined,
  //         endDate: undefined,
  //         terms: undefined,
  //         documents: [],
  //         signedBy: undefined,
  //         witnessedBy: undefined,
  //         createdAt: new Date().toISOString(),
  //         updatedAt: new Date().toISOString()
  //     }
  // }

  postContractDocument = async (
    documentToAdd: FileReference,
    id: ID
  ): Promise<void> => {
    const contract = await this.getById(id);
    contract.documents.push(documentToAdd);
  };

  deleteContractDocument = async (id: ID): Promise<void> => {
    //מחיקת מסמך מהחוזה

  };

}
