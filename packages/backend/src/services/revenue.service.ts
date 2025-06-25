import { ReportParameters, Revenue } from 'shared-types'; // ייבוא טיפוסים מה־shared-types
import { getReservationRevenue } from './reservationService'; // ייבוא פונקציה קיימת שמחשבת הכנסות מהזמנות
import { getPaymentsRevenue } from './payments.service'; // ייבוא פונקציה קיימת שמחשבת הכנסות מתשלומים

/**
 * איסוף כל ההכנסות ממקורות שונים לפי פרמטרים
 * @param parameters - פרמטרים לסינון (תאריך, לקוח, סוג חלל וכו')
 * @returns מערך הכנסות אחיד
 */
export async function getRevenues(parameters: ReportParameters): Promise<Revenue[]> {
  const revenues: Revenue[] = [];

  // 1. שליפת הכנסות מהזמנות (Reservations)
  const reservationRevenues = await getReservationRevenue(parameters);
  revenues.push(...reservationRevenues);

  // 2. שליפת הכנסות מתשלומים (Payments)
  const paymentRevenues = await getPaymentsRevenue(parameters);
  revenues.push(...paymentRevenues);

  // 3. אפשר להוסיף כאן מקורות הכנסה נוספים בעתיד...

  return revenues; // 4. החזרת כל ההכנסות כמערך אחד אחיד
}
