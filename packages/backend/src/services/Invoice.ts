/**
 * יוצרת חשבונית חדשה בהתבסס על פרטי הבקשה שסופקו.
 *
 * @param request - נתוני החשבונית כולל לקוח, טווח חיוב, פריטים ושדות אופציונליים
 * @returns אובייקט חשבונית מוכן לאחסון או לעיבוד
 */
export const createInvoice = async (request: CreateInvoiceRequest): Promise<Invoice> => {
  // שלב 1: הפקת מזהים ותאריכים
  const id = generateId(); // מזהה ייחודי לחשבונית
  const invoiceNumber = generateInvoiceNumber(); // מספר חשבונית רציף וייחודי
  const createdAt = new Date().toISOString(); // חותמת זמן יצירה
  const invoiceDate = createdAt;

  // שלב 2: בדיקות תקינות על טווח חיוב ותאריך יעד
  // מקרי קצה: תאריך התחלה אחרי תאריך סיום
  if (new Date(request.billingPeriod.startDate) > new Date(request.billingPeriod.endDate)) {
    throw new Error("תאריך התחלה של טווח החיוב חייב להיות לפני תאריך הסיום");
  }

  // מקרי קצה: תאריך יעד לתשלום הוא לפני תאריך החשבונית
  if (new Date(request.dueDate) < new Date(invoiceDate)) {
    throw new Error("תאריך יעד לתשלום חייב להיות אחרי תאריך החשבונית");
  }

  // שלב 3: שליפת נתוני הלקוח
  const customerName = await getCustomerName(request.customerId); // מביא את שם הלקוח לפי מזהה

  // שלב 4: עיבוד פריטים לחשבונית (שורות חיוב)
  const items: InvoiceItem[] = request.items.map((item) => {
    // מקרי קצה: כמות או מחיר שלילי
    if (item.quantity <= 0 || item.unitPrice < 0) {
      throw new Error("כמות ומחיר ליחידה חייבים להיות חיוביים");
    }

    const lineTotal = item.quantity * item.unitPrice;

    return {
      id: generateId(),
      type: item.type,
      description: item.description,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      lineTotal,
      period: item.period,
      workspaceId: item.workspaceId,
      orderId: item.orderId,
    };
  });

  // שלב 5: חישוב סכומים
  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
  const taxRate = 0.17; // שיעור מע"מ ברירת מחדל: 17%
  const taxAmount = subtotal * taxRate;
  const total = subtotal + taxAmount;

  // שלב 6: בניית אובייקט החשבונית הסופי
  const invoice: Invoice = {
    id,
    invoiceNumber,
    customerId: request.customerId,
    customerName,
    invoiceDate,
    dueDate: request.dueDate,
    billingPeriod: request.billingPeriod,
    items,
    subtotal,
    taxAmount,
    taxRate,
    total,
    status: "טיוטה", // סטטוס ברירת מחדל: טיוטה
    paymentDate: request.paymentDate,
    paymentAmount: request.paymentAmount,
    notes: request.notes,
    templateId: request.templateId,
    documentFile: undefined,
    createdAt,
    updatedAt: createdAt,
  };

  // שלב 7: החזרת החשבונית המלאה
  return invoice;
};