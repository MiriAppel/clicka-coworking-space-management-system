
import { ContractStatus } from "shared-types";
import type { Contract, ContractTerms, DateISO, FileReference, ID } from "shared-types";
import { ContractModel } from "../models/contract.model";
import { baseService } from "./baseService";
import { supabase } from '../db/supabaseClient'

export class contractService extends baseService<ContractModel> {
  constructor() {
    super("contract");
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
      endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString() as DateISO,
      customerId: "customer-id",
      status: ContractStatus.ACTIVE,
      signDate: undefined,
      documents: [],
      version: 1,
      createdAt: new Date().toISOString() as DateISO,
      updatedAt: new Date().toISOString() as DateISO,
      signedBy: undefined,
      witnessedBy: undefined,

      toDatabaseFormat() {
        return {
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
          updated_at: this.updatedAt,
        };
      },
    };

    await this.patch(contract.toDatabaseFormat(), contactId);
    return contract; // להחזיר את החוזה המעודכן
  };

  getAllContractsByCustomerId = async (customerId: ID): Promise<Contract[]> => {
    // אמור לשלוף את כל החוזים עבור הלקוח עם ה-customerId הנתון
    const { data, error } = await supabase
      .from("contract")
      .select("*")
      .eq("customer_id", customerId);

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
    return allContracts
  .filter(contract => {
    if (!contract.endDate) return false;
    return new Date(contract.endDate) <= targetDate;
  })
  .map(contract => ({
    ...contract,
    id: contract.id ?? "",  // מבטיח שה-id לא יהיה undefined
  })) as Contract[];
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

    await this.patch({ documents: contract.documents }, customerId);

  };

}
