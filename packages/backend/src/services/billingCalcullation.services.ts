// // הפונקציה הזו:
// // מקבלת את כל הנתונים הנדרשים (כולל שכבות תמחור, תקופות, ותק, כמות, וכו').
// // מחשבת מחיר ליחידה לפי ותק.
// // מבצעת פרורציה אם צריך.
// // מחשבת סה"כ, מע"מ, וסה"כ לתשלום.
// // מחזירה פירוט לכל חלל.
// import { PricingTier, ID,DateISO,WorkspaceType} from '../types/billing';
// import { MeetingRoomPricing } from '../types/pricing';
// import { differenceInCalendarDays, startOfMonth, endOfMonth } from 'date-fns';

// // --- הרחבת מבני קלט ---
// interface MeetingRoomBooking {
//   bookingId: ID;
//   roomId: ID;
//   totalHours: number;
//   pricing: MeetingRoomPricing;
//   isKlikahCardHolder?: boolean;
// }

// interface Discount {
//   id: ID;
//   description: string;
//   amount: number; // סכום הנחה בש"ח (שלילי)
// }

// interface Fee {
//   id: ID;
//   description: string;
//   amount: number; // סכום עמלה בש"ח (חיובי)
// }

// interface BillingCalculationInput {
//   customerId: ID;
//   billingPeriod: { startDate: DateISO; endDate: DateISO };// תקופת החיוב
//   workspaces: {
//     workspaceId: ID;
//     workspaceType: WorkspaceType;
//     contractStart: DateISO;// תאריך התחלת החוזה
//     // תאריכים של תקופת החיוב
//     workspaceStart: DateISO;
//     workspaceEnd?: DateISO;
//     quantity: number;//כמות הפריטים לסוג זה
//     pricingTiers: PricingTier[];
//   }[];
//   meetingRoomBookings?: MeetingRoomBooking[];
//   discounts?: Discount[];//הנחות או דמי פיגור
//   fees?: Fee[];//עמלות
//   taxRate?: number; // אחוז מע"מ, ברירת מחדל 17%
//   //כללים לחיוב עבור לקוחות עם חוזים מורכבים??
// }
  
// // --- מבני תוצאה ---
// interface WorkspaceCharge {
//   workspaceId: ID;
//   workspaceType: WorkspaceType;
//   quantity: number;
//   unitPrice: number;
//   totalPrice: number;
//   pricingTier: number;//שכבת תמחור
//   period: { startDate: DateISO; endDate: DateISO };// תקופת החיוב
//   prorated: boolean;//יחסי-אם יש חיוב חלקי-פחות מחודש לדוג
//   prorationFactor?: number;//גורם יחסי (אם חל)
// }

// interface MeetingRoomCharge {
//   bookingId: ID;
//   roomId: ID;
//   totalHours: number;
//   chargeableHours: number;//שעות לתשלום 
//   hourlyRate: number;
//   totalCharge: number;
//   discountApplied?: number;//האם הושמה הנחה? אם כן, כמה?
// }

// interface BillingCalculationResult {
//   customerId: ID;
//   billingPeriod: { startDate: DateISO; endDate: DateISO };
//   workspaceCharges: WorkspaceCharge[];
//   meetingRoomCharges: MeetingRoomCharge[];
//   discounts: Discount[];
//   fees: Fee[];
//   subtotal: number;
//   taxAmount: number;
//   total: number;
// }
// //  פונקציה שמקבלת אובייקט קלט עם כל נתוני החיוב ומחזירה תוצאה עם כל הפירוט.
// export const billingCalculation=(input: BillingCalculationInput): BillingCalculationResult =>{
//   const taxRate = input.taxRate ?? 17;
// //   משתנה לסיכום ביניים של כל החיובים לפני מע"מ.
//   let subtotal = 0;
//   const workspaceCharges: WorkspaceCharge[] = [];
//   const meetingRoomCharges: MeetingRoomCharge[] = [];

// // עובר על כל חלל (משרד/עמדה) של הלקוח.
//   for (const ws of input.workspaces) {
//     //בוחר את שכבת התמחור הרלוונטית לפי סוג החלל, תאריך, והאם פעילה
//     const pricing = ws.pricingTiers
//       .filter(
//         p =>
//           p.workspaceType === ws.workspaceType &&
//           p.active &&
//           new Date(p.effectiveDate) <= new Date(input.billingPeriod.startDate)
//       )
//       .sort((a, b) => new Date(b.effectiveDate).getTime() - new Date(a.effectiveDate).getTime())[0];
//     // אם לא נמצא שכבת תמחור מתאימה, זורק שגיאה
//     if (!pricing) throw new Error('No pricing tier found for workspace');

//     //מחשב את שנות הוותק של הלקוח (לפי תחילת חוזה)
//     const tenureYears = Math.max(
//       1,
//       Math.floor(
//         (new Date(input.billingPeriod.startDate).getTime() - new Date(ws.contractStart).getTime()) /
//           (365 * 24 * 60 * 60 * 1000)
//       ) + 1
//     );
//     //בוחר את המחיר ליחידה לפי הוותק
//     let unitPrice = pricing.year1Price;
//     if (tenureYears === 2) unitPrice = pricing.year2Price;
//     else if (tenureYears === 3) unitPrice = pricing.year3Price;
//     else if (tenureYears >= 4) unitPrice = pricing.year4Price;

//     //קובע את טווח החיוב בפועל (לוקח בחשבון כניסה/יציאה באמצע התקופה)
//     const periodStart = ws.workspaceStart > input.billingPeriod.startDate ? ws.workspaceStart : input.billingPeriod.startDate;
//     const periodEnd = ws.workspaceEnd && ws.workspaceEnd < input.billingPeriod.endDate ? ws.workspaceEnd : input.billingPeriod.endDate;
//     //מחשב האם יש חיוב יחסי (פרורציה) ומהו הגורם (למשל, חצי חודש).
//     const monthStart = startOfMonth(new Date(periodStart));
//     const monthEnd = endOfMonth(new Date(periodStart));
//     const totalDays = differenceInCalendarDays(monthEnd, monthStart) + 1;
//     const billedStart = new Date(periodStart) < monthStart ? monthStart : new Date(periodStart);
//     const billedEnd = new Date(periodEnd) > monthEnd ? monthEnd : new Date(periodEnd);
//     const billedDays = differenceInCalendarDays(billedEnd, billedStart) + 1;
//     const prorationFactor = billedDays / totalDays;
//     const prorated = prorationFactor < 1;
//     //מחשב את הסכום לחיוב עבור חלל זה (כולל פרורציה)
//     const totalPrice = Math.round(ws.quantity * unitPrice * prorationFactor * 100) / 100;
//     //מוסיף את פירוט החיוב למערך.
//     workspaceCharges.push({
//       workspaceId: ws.workspaceId,
//       workspaceType: ws.workspaceType,
//       quantity: ws.quantity,
//       unitPrice,
//       totalPrice,
//       pricingTier: tenureYears,
//       period: { startDate: periodStart, endDate: periodEnd },
//       prorated,
//       prorationFactor: prorated ? prorationFactor : undefined,
//     });
// //מוסיף לסיכום הביניים
//     subtotal += totalPrice;
//   }

//   // --- חיוב חדרי ישיבות ---
//     // (כולל הנחות ושעות חינם) אם יש הזמנות חדרי ישיבות, עובר על כל אחת ומחשב את החיוב.
//     // מוסיף לפירוט ולסיכום
//     if (input.meetingRoomBookings) {
//     for (const booking of input.meetingRoomBookings) {
//       let hourlyRate = booking.pricing.hourlyRate;
//       let chargeableHours = booking.totalHours;
//       let discountApplied = 0;

//       // הנחה לשעות רבות
//       if (booking.totalHours >= 4) {
//         hourlyRate = booking.pricing.discountedHourlyRate;
//       }

//       // שעות חינם למחזיקי כרטיס קליקה
//       let freeHours = 0;
//       if (booking.isKlikahCardHolder && booking.pricing.freeHoursKlikahCard) {
//         freeHours = Math.min(booking.pricing.freeHoursKlikahCard, booking.totalHours);
//         chargeableHours = booking.totalHours - freeHours;
//         discountApplied = freeHours * hourlyRate;
//       }

//       const totalCharge = Math.round(chargeableHours * hourlyRate * 100) / 100;

//       meetingRoomCharges.push({
//         bookingId: booking.bookingId,
//         roomId: booking.roomId,
//         totalHours: booking.totalHours,
//         chargeableHours,
//         hourlyRate,
//         totalCharge,
//         discountApplied: discountApplied > 0 ? discountApplied : undefined,
//       });

//       subtotal += totalCharge;
//     }
//   }

//   // --- (סכום שלילי)הנחות ---
//   const discounts = input.discounts ?? [];
//   const totalDiscounts = discounts.reduce((sum, d) => sum + (d.amount || 0), 0);

//   // --- חיובי)עמלות )---
//   const fees = input.fees ?? [];
//   const totalFees = fees.reduce((sum, f) => sum + (f.amount || 0), 0);

//   // --- חישוב סופי ---
//   //מחשב את הסכום הסופי לפני מע"מ, את המע"מ, ואת הסכום הכולל.
//   subtotal = subtotal + totalFees + totalDiscounts; // הנחות שליליות, עמלות חיוביות
//   const taxAmount = Math.round(subtotal * (taxRate / 100) * 100) / 100;
//   const total = Math.round((subtotal + taxAmount) * 100) / 100;
// //מחזיר את כל הפירוט, כולל כל סוגי החיובים, הנחות, עמלות, וסכומים סופיים.
//   return {
//     customerId: input.customerId,
//     billingPeriod: input.billingPeriod,
//     workspaceCharges,
//     meetingRoomCharges,
//     discounts,
//     fees,
//     subtotal,
//     taxAmount,
//     total,
//   };
// }
