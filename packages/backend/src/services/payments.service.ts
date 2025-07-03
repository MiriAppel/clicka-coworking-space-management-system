import type{ ID, Invoice, Payment } from "shared-types";
import { baseService } from "./baseService";
import { PaymentModel } from "../models/payments.model";
import { supabase } from "../db/supabaseClient";

export class PaymentService extends baseService<PaymentModel> {

  constructor() {
    super("payment");
  }
  
  // static getCustomerBalance(customerId: string) {
  //   throw new Error('Method not implemented.');
  // }
  // static recordPayment(body: any, id: any) {
  //   throw new Error('Method not implemented.');
  // }

  getCustomersByPage = async (filters: {
        page?: string ;
        limit?: number;
      }): Promise<PaymentModel[]> => {
        console.log("Service getCustomersByPage called with:", filters);
    
        const { page, limit } = filters;
    
        const pageNum = Number(filters.page);
        const limitNum = Number(filters.limit);
    
        if (!Number.isInteger(pageNum) || !Number.isInteger(limitNum)) {
          throw new Error("Invalid filters provided for pagination");
        }
    
        const from = (pageNum - 1) * limitNum;
        const to = from + limitNum - 1;
    
        const { data, error } = await supabase
          .from("customer")
          .select("*")
          .order("created_at", { ascending: false })
          .range(from, to);
    
        console.log("Supabase data:", data);
        console.log("Supabase error:", error);
    
        if (error) {
          console.error("❌ Supabase error:", error.message || error);
          return Promise.reject(
            new Error(`Supabase error: ${error.message || JSON.stringify(error)}`)
          );
        }
    
          const customers = data || [];
          PaymentModel
        return PaymentModel.returnsDatabaseFormat(customers)
      };
    }

//   getCustomerBalance(customerId: ID)/*: CustomerBalance*/ {
//     // שליפת כל החשבוניות של הלקוח שלא שולמו במלואן
//     // חישוב סך כל החשבוניות שעדיין פתוחות
//     // חישוב סך הסכומים שעדיין לא שולמו
//     // שליפת היסטוריית תשלומים של הלקוח
//     // חישוב היתרה הנוכחית של הלקוח (לדוגמה: סך החיובים פחות סך התשלומים)
//     // שליפת תאריך התשלום האחרון במידה ויש
//   }

//   getOverdueInvoices()/*: OverdueInvoiceSummary[] */{
//     // שליפת כל החשבוניות מהמערכת (DB / API)
//     // שליפת כל הלקוחות מהמערכת
//     // שליפת כל התשלומים מהמערכת
//     // סינון חשבוניות שלא שולמו או שולמו חלקית בלבד
//     // סינון חשבוניות שמועד הפירעון שלהן עבר (כלומר היום כבר אחרי due_date)
//     // בניית מערך סיכום לכל חשבונית באיחור
//     // איתור הלקוח לפי מזהה הלקוח בחשבונית
//     // שליפת כל התשלומים של הלקוח ומיון מהתאריך האחרון לישן יותר
//   }

//   matchPaymentsToInvoices(customerId: ID, currentPayment: Payment): void {
//     // שליפת כל החשבוניות של הלקוח
//     // סינון חשבוניות שלא שולמו במלואן
//     // לולאה על כל תשלום פתוח עד שנגמר סכום התשלום
//     // עדכון של החשבוניות בהתאם לסכום שנכנס
//     // אם התשלום הושלם, להכניס את היתרה ליתרה בחשבון של המשתמש
//   }

//   matchPaymentsToInvoice(customerId: ID, currentPayment: Payment, invoice: Invoice): void {
//     // שליפת כל החשבוניות של הלקוח
//     // סינון חשבוניות שלא שולמו במלואן
//     // לולאה על כל תשלום פתוח עד שנגמר סכום התשלום
//     // עדכון של החשבוניות בהתאם לסכום שנכנס
//     // אם התשלום הושלם, להכניס את היתרה ליתרה בחשבון של המשתמש
//   }

//   getPaymentHistory(customerId: ID)/*: Payment[]*/ {
//     // שליפת כל התשלומים מהמסד (פונקציה כללית שמחזירה את כולם)
//     // סינון לפי מזהה הלקוח
//     // מיון תשלומים מהחדש לישן לפי תאריך תשלום
//   }

//   //לרחל
//   /**
//    * תיעוד תשלום חדש ללקוח ועדכון מצב החשבוניות והיתרה
//    * @param customerId מזהה הלקוח
//    * @param paymentData פרטי התשלום (סכום, תאריך, אמצעי תשלום וכו')
//    * @param recordedBy מי תיעד את התשלום (משתמש/מערכת)
//    * @returns אובייקט תשלום חדש לאחר עדכון החשבוניות והיתרה
//    */
//   recordAndApplyPayment(
//     customerId: ID,
//     // paymentData: PaymentRecordRequest,
//     recordedBy: ID
//   )/*: Payment*/ {
//     // כאן יבוא המימוש בפועל
//   }

//   /**
//    * מחזירה דוח גבייה כללי לכל הלקוחות (סיכום מצב גבייה).
//    * @returns Promise<CollectionSummary>
//    */
//   async getCollectionSummaryReport()/*: Promise<CollectionSummary>*/ {

//   }

//   /**
//    * מחזירה דוח גבייה מפורט ללקוח מסוים.
//    * @param customerId מזהה הלקוח
//    * @returns Promise<CustomerCollectionReport>
//    */
//   async getCustomerCollectionReport(customerId: ID)/*: Promise<CustomerCollectionReport>*/ {
  
//   }
  
// }