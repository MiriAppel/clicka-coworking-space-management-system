import type{ ID, Invoice, Payment } from "shared-types";

export class PaymentService {
  static getCustomerBalance(customerId: string) {
    throw new Error('Method not implemented.');
  }
  static recordPayment(body: any, id: any) {
    throw new Error('Method not implemented.');
  }
 updatePayment(request: PaymentRequest, recordedBy: ID)/*: Payment*/ {
    // אימות מזהה לקוח (נניח שמבוצע ברמת שירות או קריאה חיצונית)
    // אימות חשבונית אם צורפה
    // יצירת אובייקט תשלום חדש
    // עדכון סטטוס חשבונית בהתאם אם צורפה - יבוצע בהמשך במערכת
  }

  getCustomerBalance(customerId: ID)/*: CustomerBalance*/ {
    // שליפת כל החשבוניות של הלקוח שלא שולמו במלואן
    // חישוב סך כל החשבוניות שעדיין פתוחות
    // חישוב סך הסכומים שעדיין לא שולמו
    // שליפת היסטוריית תשלומים של הלקוח
    // חישוב היתרה הנוכחית של הלקוח (לדוגמה: סך החיובים פחות סך התשלומים)
    // שליפת תאריך התשלום האחרון במידה ויש
  }

  getOverdueInvoices()/*: OverdueInvoiceSummary[] */{
    // שליפת כל החשבוניות מהמערכת (DB / API)
    // שליפת כל הלקוחות מהמערכת
    // שליפת כל התשלומים מהמערכת
    // סינון חשבוניות שלא שולמו או שולמו חלקית בלבד
    // סינון חשבוניות שמועד הפירעון שלהן עבר (כלומר היום כבר אחרי due_date)
    // בניית מערך סיכום לכל חשבונית באיחור
    // איתור הלקוח לפי מזהה הלקוח בחשבונית
    // שליפת כל התשלומים של הלקוח ומיון מהתאריך האחרון לישן יותר
  }

  matchPaymentsToInvoices(customerId: ID, currentPayment: Payment): void {
    // שליפת כל החשבוניות של הלקוח
    // סינון חשבוניות שלא שולמו במלואן
    // לולאה על כל תשלום פתוח עד שנגמר סכום התשלום
    // עדכון של החשבוניות בהתאם לסכום שנכנס
    // אם התשלום הושלם, להכניס את היתרה ליתרה בחשבון של המשתמש
  }

  matchPaymentsToInvoice(customerId: ID, currentPayment: Payment, invoice: Invoice): void {
    // שליפת כל החשבוניות של הלקוח
    // סינון חשבוניות שלא שולמו במלואן
    // לולאה על כל תשלום פתוח עד שנגמר סכום התשלום
    // עדכון של החשבוניות בהתאם לסכום שנכנס
    // אם התשלום הושלם, להכניס את היתרה ליתרה בחשבון של המשתמש
  }
async getPaymentHistory(customerId: ID): Promise<Payment[]> {
    // כרגע מחזיר רשימה ריקה לצורך בניית ה-service
      // שליפת כל התשלומים מהמסד (פונקציה כללית שמחזירה את כולם)
    // סינון לפי מזהה הלקוח
    // מיון תשלומים מהחדש לישן לפי תאריך תשלום
    return [];
  }


  //לרחל
  /**
   * תיעוד תשלום חדש ללקוח ועדכון מצב החשבוניות והיתרה
   * @param customerId מזהה הלקוח
   * @param paymentData פרטי התשלום (סכום, תאריך, אמצעי תשלום וכו')
   * @param recordedBy מי תיעד את התשלום (משתמש/מערכת)
   * @returns אובייקט תשלום חדש לאחר עדכון החשבוניות והיתרה
   */
  recordAndApplyPayment(
    customerId: ID,
    // paymentData: PaymentRecordRequest,
    recordedBy: ID
  )/*: Payment*/ {
    // כאן יבוא המימוש בפועל
  }

  /**
   * מחזירה דוח גבייה כללי לכל הלקוחות (סיכום מצב גבייה).
   * @returns Promise<CollectionSummary>
   */
  async getCollectionSummaryReport()/*: Promise<CollectionSummary>*/ {

  }

  /**
   * מחזירה דוח גבייה מפורט ללקוח מסוים.
   * @param customerId מזהה הלקוח
   * @returns Promise<CustomerCollectionReport>
   */
  async getCustomerCollectionReport(customerId: ID)/*: Promise<CustomerCollectionReport>*/ {
  
  }
  
}
