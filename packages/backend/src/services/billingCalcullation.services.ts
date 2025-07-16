// הפונקציה הזו:
// מקבלת את כל הנתונים הנדרשים (כולל שכבות תמחור, תקופות, ותק, כמות, וכו').
// מחשבת מחיר ליחידה לפי ותק.
// מבצעת פרורציה אם צריך.
// מחשבת סה"כ, מע"מ, וסה"כ לתשלום.
// מחזירה פירוט לכל חלל ולחשבונית.
import { v4 as uuidv4 } from 'uuid'; // ייבוא UUID
import { PricingTier, ID, DateISO, BillingItemType, InvoiceStatus, WorkspaceType } from '../../../shared-types'; // ייבוא טיפוסים רלוונטיים
import { MeetingRoomPricing } from '../../../shared-types/pricing'; // ייבוא טיפוס תמחור חדרי ישיבות
import { differenceInCalendarDays, startOfMonth, endOfMonth } from 'date-fns'; // פונקציות עזר לתאריכים
import { VAT_RATE } from '../constants'; // קבוע מע"מ
import { InvoiceItemModel, InvoiceModel } from '../models/invoice.model'; // מודלים של חשבונית ופריט חשבונית
import { generateId } from '../models/invoice.mock-db'; // פונקציה ליצירת מזהה ייחודי
import { customerService } from './customer.service'; // שירות לשליפת לקוחות
import { BookingService } from '../services/booking.service';
import { getCurrentMeetingRoomPricing } from '../services/pricing.service'; // שירות לשליפת תמחור חדרי ישיבות
import { UUID } from 'crypto';
// dotenv.config();
// const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_KEY!);
// --- הרחבת מבני קלט ---
// מבנה להזמנת חדר ישיבות
interface MeetingRoomBooking {
    bookingId: ID;
    roomId: ID;
    totalHours: number;
    pricing: MeetingRoomPricing;
    isKlikahCardHolder?: boolean;
}

// // מבנה להנחה
// interface Discount {
//     id: ID;
//     description: string;
//     amount: number; // סכום הנחה בש"ח (שלילי)
// }

// // מבנה לעמלה
// interface Fee {
//     id: ID;
//     description: string;
//     amount: number; // סכום עמלה בש"ח (חיובי)
// }

// מבנה קלט ראשי לפונקציית החישוב
interface BillingCalculationInput {
    customerId: ID;
    customerName: string; // שם הלקוח
    billingPeriod: { startDate: DateISO; endDate: DateISO }; // תקופת החיוב
    dueDate: DateISO; // תאריך יעד לתשלום
    workspaces: {
        workspaceId: ID;
        workspaceType: WorkspaceType;
        contractStart: DateISO; // תאריך התחלת החוזה
        workspaceStart: DateISO;
        workspaceEnd?: DateISO;
        quantity: number;
        pricingTiers: PricingTier[];
    }[];
    meetingRoomBookings?: MeetingRoomBooking[];
    // discounts?: Discount[];
    // fees?: Fee[];
    taxRate?: number; // אחוז מע"מ, ברירת מחדל 18%
}

// תוצאה של חישוב חיוב - מחזירה גם חשבונית וגם פירוט חיובים
export interface BillingCalculationResult {
    invoice: InvoiceModel;
    workspaceCharges: any[];
    meetingRoomCharges: any[];
    // discounts: Discount[];
    // fees: Fee[];
    subtotal: number;
    taxAmount: number;
    total: number;
}

export const calculateBillingForAllCustomers = async (
    billingPeriod: { startDate: DateISO; endDate: DateISO },
    dueDate: DateISO,
    taxRate: number = VAT_RATE // ברירת מחדל היא VAT_RATE
) => {
    const serviceCustomer = new customerService();
    const bookingService = new BookingService();

    // שליפת כל הלקוחות
    const allCustomers = await serviceCustomer.getAll();
    const billingResults = [];

    for (const customer of allCustomers) {
        try {
            const result = await calculateBillingForCustomer(
                customer.idNumber,
                billingPeriod,
                dueDate,
                taxRate
            );
            billingResults.push(result);
        } catch (err: unknown) { // טיפול בטיפוס unknown
            const errorMessage = (err instanceof Error) ? err.message : 'Unknown error';
            console.error(`Error calculating billing for customer ${customer.id}:`, errorMessage);
            billingResults.push({ customerId: customer.id, error: errorMessage });
        }
    }

    return billingResults;
};


export const calculateBillingForCustomer = async (
    customerId: ID,
    billingPeriod: { startDate: DateISO; endDate: DateISO }, // אובייקט המכיל את תאריך ההתחלה ותאריך הסיום של תקופת החיוב
    dueDate: DateISO, // תאריך היעד לתשלום החשבונית
    taxRate: number = VAT_RATE // שיעור המע"מ, ברירת מחדל היא VAT_RATE (קבוע המוגדר במקום אחר)
) => {
    console.log("Starting billing calculation for customer ID:", customerId, billingPeriod, dueDate);

    const serviceCustomer = new customerService();
    const bookingService = new BookingService();

    // בדיקות תאריכים
    const startDate = new Date(billingPeriod.startDate);
    const endDate = new Date(billingPeriod.endDate);
    const dueDateObj = new Date(dueDate);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime()) || isNaN(dueDateObj.getTime())) {
        throw new Error('תאריך לא תקף');
    }
    if (startDate > endDate) {
        throw new Error('תאריך ההתחלה לא יכול להיות מאוחר מתאריך הסיום');
    }
    if (dueDateObj < endDate) {
        throw new Error('תאריך היעד לתשלום לא יכול להיות לפני תאריך הסיום של תקופת החיוב');
    }
    try {
        const customer = await serviceCustomer.getById(customerId);
        console.log('Customer fetched:', customer);

        if (!customer) {
            // בדיקה האם הלקוח נמצא.
            console.error('Error: Customer not found');
            // הדפסת הודעת שגיאה לקונסול אם הלקוח לא נמצא.
            throw new Error('Customer not found');
            // זריקת שגיאה אם הלקוח לא נמצא, מה שיעצור את המשך החישוב.
        }

        // סינון ההזמנות כדי לקבל רק את אלו השייכות ללקוח הנוכחי ונמצאות בתוך תקופת החיוב.
        // שליפת כל ההזמנות של הלקוח
        const allBookings = await bookingService.getAllBooking();
        console.log('All Bookings fetched:', allBookings);

        const customerBookings = allBookings
            ? allBookings.filter(
                b =>
                    b.customerId === customerId &&
                    new Date(b.startTime) < new Date(billingPeriod.endDate) &&
                    new Date(b.endTime) > new Date(billingPeriod.startDate)
            )
            : [];

        console.log('Filtered Customer Bookings:', customerBookings);
        const meetingRoomPricing = await getCurrentMeetingRoomPricing();
        console.log('Meeting Room Pricing fetched:', meetingRoomPricing);

        // אם המחירון לא נמצא, הגדר ערך ברירת מחדל
        const pricing = meetingRoomPricing || { hourlyRate: 0, discountedHourlyRate: 0 };

        // if (!meetingRoomPricing|| new Date(meetingRoomPricing.effectiveDate) > new Date()) {
        //     // בדיקה האם מחירון חדרי ישיבות נמצא.
        //     console.error('Error: No meeting room pricing found');
        //     // הדפסת הודעת שגיאה לקונסול אם המחירון לא נמצא.
        //     throw new Error('No meeting room pricing found');
        //     // זריקת שגיאה אם המחירון לא נמצא.
        // }

        // const meetingRoomBookings: MeetingRoomBooking[] = customerBookings.map(b => ({
        //     bookingId: b.id!, // מזהה ההזמנה
        //     roomId: b.roomId, // מזהה החדר
        //     totalHours: b.totalHours, // סך השעות שהוזמנו
        //     pricing: meetingRoomPricing, // מחירון חדרי הישיבות הרלוונטי
        // }));
        const meetingRoomBookings: MeetingRoomBooking[] = customerBookings.map(b => ({
            bookingId: b.id!, // מזהה ההזמנה
            roomId: b.roomId, // מזהה החדר
            totalHours: b.totalHours, // סך השעות שהוזמנו
            pricing: meetingRoomPricing ? meetingRoomPricing : {
                hourlyRate: 0,
                discountedHourlyRate: 0,
                freeHoursKlikahCard: 0, // ערך ברירת מחדל
                active: false, // ערך ברירת מחדל
                effectiveDate: new Date().toISOString(), // ערך ברירת מחדל
                createdAt: new Date().toISOString(), // ערך ברירת מחדל
                updatedAt: new Date().toISOString() // ערך ברירת מחדל
            },
        }));
        // מיפוי ההזמנות המסוננות לאובייקטים מסוג MeetingRoomBooking, המכילים את הפרטים הרלוונטיים לחישוב.

        // שליפת תקופות הלקוח
        const customerPeriods = customer.periods || [];
        const currentPeriod = customerPeriods.find(period => {
            const entryDate = new Date(period.entryDate);
            const exitDate = period.exitDate ? new Date(period.exitDate) : null;
            return entryDate <= new Date() && (!exitDate || exitDate > new Date());
        });

        const workspaceStart = currentPeriod ? currentPeriod.entryDate : customer.contractStartDate;
        const workspaceEnd = currentPeriod ? currentPeriod.exitDate : null;

        const workspaces = Array.isArray((customer as any).workspaces)
            ? (customer as any).workspaces
            : customer.currentWorkspaceType
                ? [{
                    workspaceId: 'main', // מזהה חלל עבודה (ברירת מחדל 'main' אם אין מערך workspaces)
                    workspaceType: customer.currentWorkspaceType, // סוג חלל העבודה הנוכחי של הלקוח
                    contractStart: customer.contractStartDate, // תאריך תחילת החוזה של הלקוח
                    workspaceStart: workspaceStart, // תאריך תחילת השימוש בחלל העבודה
                    workspaceEnd: workspaceEnd, // תאריך סיום השימוש בחלל העבודה (אם קיים)
                    quantity: customer.workspaceCount, // כמות חללי העבודה
                    pricingTiers: [] // שכבות תמחור (יש למלא לפי הצורך, כרגע ריק)
                }]
                : [];

        console.log('Workspaces:', workspaces);
        // קביעת חללי העבודה של הלקוח. אם ללקוח יש מערך 'workspaces', הוא ישמש.
        // אחרת, אם יש לו 'currentWorkspaceType', נוצר אובייקט חלל עבודה יחיד עם פרטים בסיסיים.
        // אם אין אף אחד מהם, המערך יהיה ריק.

        const billingInput: BillingCalculationInput = {
            customerId: customer.id!, // מזהה הלקוח
            customerName: customer.name, // שם הלקוח
            billingPeriod, // תקופת החיוב
            dueDate, // תאריך יעד לתשלום
            workspaces, // חללי העבודה של הלקוח
            meetingRoomBookings: meetingRoomBookings || [], // הזמנות חדרי ישיבות (או מערך ריק אם אין)
            taxRate // שיעור המע"מ
        };
        console.log('Billing Input:', billingInput);
        return billingCalculation(billingInput);
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Error calculating billing for customer ${customerId}: ${error.message}`);
        } else {
            throw new Error(`Error calculating billing for customer ${customerId}: Unknown error occurred.`);
        }
    }
};
// פונקציה זו מבצעת את החישובים בפועל ומחזירה את תוצאת החיוב.
export const billingCalculation = (input: BillingCalculationInput): BillingCalculationResult => {
    console.log('Starting billing calculation...');
    const taxRate = input.taxRate ?? VAT_RATE;
    let subtotal = 0;
    const workspaceCharges: any[] = [];
    // מערך לאחסון פירוט חיובי חללי עבודה.
    const meetingRoomCharges: any[] = [];
    // מערך לאחסון פירוט חיובי חדרי ישיבות.
    const items: InvoiceItemModel[] = [];
    // מערך לאחסון פריטי החשבונית.

    const isKlikahCardHolder = input.workspaces.some(
        ws => ws.workspaceType === WorkspaceType.KLIKAH_CARD
    );
    // בדיקה האם הלקוח מחזיק בכרטיס "קליקה כארד" (לפחות אחד מחללי העבודה שלו הוא מסוג KLIKAH_CARD).

    console.log('Is Klikah Card Holder:', isKlikahCardHolder);

    const invoiceId: UUID = uuidv4() as UUID;
    for (const ws of input.workspaces) {
        // לולאה העוברת על כל חללי העבודה של הלקוח.
        console.log('invoiceId:', invoiceId);
        console.log('Processing workspace:', ws);

        const pricing = ws.pricingTiers
            .filter(
                p =>
                    p.workspaceType === ws.workspaceType &&
                    p.active &&
                    new Date(p.effectiveDate) <= new Date(input.billingPeriod.startDate)
            )
            .sort((a, b) => new Date(b.effectiveDate).getTime() - new Date(a.effectiveDate).getTime())[0];

        if (!pricing) {
            // בדיקה האם נמצאה שכבת תמחור מתאימה.
            console.error('Error: No pricing tier found for workspace:', ws);
            // הדפסת הודעת שגיאה לקונסול.
            throw new Error('No pricing tier found for workspace');
        }

        const tenureYears = Math.max(
            1,
            Math.floor(
                (new Date(input.billingPeriod.startDate).getTime() - new Date(ws.contractStart).getTime()) /
                (365 * 24 * 60 * 60 * 1000)
            ) + 1
        );

        let unitPrice = pricing.year1Price;
        // אתחול מחיר היחידה למחיר של שנה 1.

        if (tenureYears === 2) unitPrice = pricing.year2Price;
        else if (tenureYears === 3) unitPrice = pricing.year3Price;
        else if (tenureYears >= 4) unitPrice = pricing.year4Price;
        // קביעת מחיר היחידה בהתאם לשנות הוותק של הלקוח.

        console.log(`Tenure years: ${tenureYears}, Unit price: ${unitPrice}`);
        // קביעת תאריך תחילת החיוב בפועל: המאוחר מבין תאריך תחילת השימוש בחלל העבודה ותאריך תחילת תקופת החיוב.

        const periodStart = ws.workspaceStart > input.billingPeriod.startDate ? ws.workspaceStart : input.billingPeriod.startDate;
        // קביעת תאריך סיום החיוב בפועל: המוקדם מבין תאריך סיום השימוש בחלל העבודה (אם קיים) ותאריך סיום תקופת החיוב.

        const periodEnd = ws.workspaceEnd && ws.workspaceEnd < input.billingPeriod.endDate ? ws.workspaceEnd : input.billingPeriod.endDate;
        console.log(`Billing period: ${periodStart} to ${periodEnd}`);
        const monthStart = startOfMonth(new Date(periodStart));
        // קביעת תאריך תחילת החודש של תאריך תחילת החיוב בפועל.
        const monthEnd = endOfMonth(new Date(periodStart));
        // קביעת תאריך סיום החודש של תאריך תחילת החיוב בפועל.
        const totalDays = differenceInCalendarDays(monthEnd, monthStart) + 1;
        // חישוב סך הימים בחודש הרלוונטי.
        const billedStart = new Date(periodStart) < monthStart ? monthStart : new Date(periodStart);
        // קביעת תאריך התחלה לחישוב יחסי: המאוחר מבין תאריך תחילת החיוב בפועל ותחילת החודש.
        const billedEnd = new Date(periodEnd) > monthEnd ? monthEnd : new Date(periodEnd);
        // קביעת תאריך סיום לחישוב יחסי: המוקדם מבין תאריך סיום החיוב בפועל וסיום החודש.
        // חישוב מספר הימים בפועל שעבורם יבוצע חיוב יחסי.
        const billedDays = differenceInCalendarDays(billedEnd, billedStart) + 1;

        if (billedDays < 0) {
            console.error('Error: Billed days cannot be negative');
            throw new Error('Billed days cannot be negative');
        }

        const prorationFactor = billedDays / totalDays;
        // חישוב גורם הפרורציה (יחס הימים המחויבים לסך הימים בחודש).
        const totalPrice = Math.round(ws.quantity * unitPrice * prorationFactor * 100) / 100;
        // חישוב הסכום הכולל עבור חלל עבודה זה, כולל כמות, מחיר יחידה וגורם פרורציה.

        console.log(`Total price for workspace ${ws.workspaceId}: ${totalPrice}`);

        workspaceCharges.push({
            workspaceId: ws.workspaceId, // מזהה חלל העבודה
            workspaceType: ws.workspaceType, // סוג חלל העבודה
            quantity: ws.quantity, // כמות
            unitPrice, // מחיר ליחידה
            totalPrice, // סכום כולל
            pricingTier: tenureYears, // שכבת התמחור (לפי שנות ותק)
            period: { startDate: periodStart, endDate: periodEnd }, // תקופת החיוב בפועל
            prorationFactor: prorationFactor < 1 ? prorationFactor : undefined, // גורם פרורציה (אם בוצעה פרורציה)
        });

        // הוספת פירוט חיוב חלל העבודה למערך workspaceCharges.
        items.push(
            new InvoiceItemModel(
                generateId(), // מזהה ייחודי לפריט החשבונית
                invoiceId, // invoice_id - ימולא מאוחר יותר
                'WORKSPACE_RENTAL' as BillingItemType, // סוג פריט החיוב
                `השכרת ${ws.workspaceType}`, // תיאור הפריט
                ws.quantity, // כמות
                unitPrice, // מחיר ליחידה
                totalPrice, // סכום כולל
                taxRate, // שיעור מע"מ
                Math.round(totalPrice * (taxRate / 100) * 100) / 100, // סכום מע"מ
                ws.workspaceType, // סוג חלל העבודה
                ws.workspaceId, // מזהה חלל העבודה
                new Date().toISOString(), // תאריך יצירה
                new Date().toISOString() // תאריך עדכון
            )
        );
        // יצירת פריט חשבונית עבור חלל העבודה והוספתו למערך items.

        subtotal += totalPrice;
        // הוספת הסכום הכולל של חלל העבודה לסכום הביניים.

        console.log(`Subtotal after workspace ${ws.workspaceId}: ${subtotal}`);
        // הדפסת סכום הביניים לאחר הוספת חלל העבודה לקונסול.
    }

    if (input.meetingRoomBookings) {
        // בדיקה האם קיימות הזמנות חדרי ישיבות.

        let freeHoursLeft = 34;
        // אתחול שעות חינם שנותרו ללקוחות "קליקה כארד" (34 שעות).

        for (const booking of input.meetingRoomBookings) {
            // לולאה העוברת על כל הזמנות חדרי הישיבות.

            let hourlyRate = booking.pricing.hourlyRate;
            // אתחול התעריף השעתי לתעריף הרגיל של חדר הישיבות.

            let chargeableHours = booking.totalHours;
            // אתחול השעות לחיוב לסך השעות שהוזמנו.

            let discountApplied = 0;
            // אתחול סכום ההנחה שהופעלה.

            if (isKlikahCardHolder) {
                // אם הלקוח הוא בעל "קליקה כארד".

                let freeHoursForThisBooking = Math.min(freeHoursLeft, booking.totalHours);
                // חישוב שעות חינם שיש להחיל על הזמנה זו (המינימום בין השעות החינם שנותרו לסך השעות בהזמנה).

                freeHoursLeft -= freeHoursForThisBooking;
                // הפחתת שעות החינם שהופעלו מסך השעות החינם שנותרו.

                chargeableHours = booking.totalHours - freeHoursForThisBooking;
                // חישוב השעות לחיוב לאחר הפחתת שעות החינם.

                discountApplied = freeHoursForThisBooking * hourlyRate;
                // חישוב סכום ההנחה שהופעלה.

                console.log(`Free hours applied: ${freeHoursForThisBooking}, Remaining free hours: ${freeHoursLeft}`);
                // הדפסת פרטי שעות החינם לקונסול.
            } else {
                // אם הלקוח אינו בעל "קליקה כארד".

                if (booking.totalHours >= 4) {
                    // אם סך השעות שהוזמנו הוא 4 ומעלה.
                    hourlyRate = booking.pricing.discountedHourlyRate;
                    // שימוש בתעריף השעתי המוזל.
                }
            }

            const totalCharge = Math.round(chargeableHours * hourlyRate * 100) / 100;
            // חישוב הסכום הכולל לחיוב עבור הזמנת חדר ישיבות זו.

            console.log(`Booking ID: ${booking.bookingId}, Chargeable hours: ${chargeableHours}, Hourly rate: ${hourlyRate}, Total charge: ${totalCharge}`);
            // הדפסת פרטי החיוב עבור הזמנת חדר הישיבות לקונסול.

            meetingRoomCharges.push({
                bookingId: booking.bookingId, // מזהה ההזמנה
                roomId: booking.roomId, // מזהה החדר
                totalHours: booking.totalHours, // סך השעות שהוזמנו
                chargeableHours, // שעות לחיוב
                hourlyRate, // תעריף שעתי
                totalCharge, // סכום כולל לחיוב
                discountApplied: discountApplied > 0 ? discountApplied : undefined, // סכום הנחה (אם הופעלה)
            });

            // הוספת פירוט חיוב חדר הישיבות למערך meetingRoomCharges.
            items.push(
                new InvoiceItemModel(
                    generateId(), // מזהה ייחודי לפריט החשבונית
                    invoiceId, // invoice_id - ימולא מאוחר יותר
                    'MEETING_ROOM' as BillingItemType, // סוג פריט החיוב
                    `הזמנת חדר ישיבות`, // תיאור הפריט
                    chargeableHours, // כמות (שעות לחיוב)
                    hourlyRate, // מחיר ליחידה (תעריף שעתי)
                    totalCharge, // סכום כולל
                    taxRate, // שיעור מע"מ
                    Math.round(totalCharge * (taxRate / 100) * 100) / 100, // סכום מע"מ
                    undefined, // workspaceType (לא רלוונטי לפריט זה)
                    booking.bookingId, // מזהה ההזמנה
                    new Date().toISOString(), // תאריך יצירה
                    new Date().toISOString() // תאריך עדכון
                )
            );
            // יצירת פריט חשבונית עבור הזמנת חדר הישיבות והוספתו למערך items.

            subtotal += totalCharge;
            // הוספת הסכום הכולל של הזמנת חדר הישיבות לסכום הביניים.

            console.log(`Subtotal after meeting room booking ${booking.bookingId}: ${subtotal}`);
            // הדפסת סכום הביניים לאחר הוספת הזמנת חדר הישיבות לקונסול.
        }
    }

    const taxAmount = Math.round(subtotal * (taxRate / 100) * 100) / 100;
    // חישוב סכום המע"מ על בסיס סכום הביניים ושיעור המע"מ.

    const total = Math.round((subtotal + taxAmount) * 100) / 100;
    // חישוב הסכום הכולל לתשלום (סכום ביניים + מע"מ).

    console.log(`Final Subtotal: ${subtotal}, Tax amount: ${taxAmount}, Total: ${total}`);
    // הדפסת הסכומים הסופיים לקונסול.

    const now = new Date().toISOString();

    const invoice = new InvoiceModel(
        invoiceId, // מזהה ייחודי לחשבונית
        '456456', // מספר חשבונית (ייתכן שייקבע מאוחר יותר במערכת)
        input.customerId || 'unknown', // מזהה הלקוח או ערך ברירת מחדל
        input.customerName || 'Unknown Customer', // שם הלקוח או ערך ברירת מחדל
        InvoiceStatus.DRAFT, // סטטוס ראשוני של החשבונית (טיוטה)
        new Date().toISOString(), // תאריך הפקת החשבונית
        input.dueDate || new Date().toISOString(), // תאריך יעד לתשלום או ערך ברירת מחדל
        items.length > 0 ? items : [], // כל פריטי החשבונית שחושבו, או מערך ריק
        subtotal || 0, // סכום ביניים
        taxAmount || 0, // סכום מע"מ
        false, // payment_due_reminder (האם נשלחה תזכורת תשלום)
        undefined, // payment_dueReminder_sentAt (מתי נשלחה תזכורת תשלום)
        new Date().toISOString(), // תאריך יצירת הרשומה
        new Date().toISOString() // תאריך עדכון הרשומה
    );

    // יצירת אובייקט חשבונית חדש עם כל הפרטים שחושבו.

    console.log('Invoice created:', invoice);
    // הדפסת אובייקט החשבונית שנוצר לקונסול.

    return {
        invoice, // אובייקט החשבונית
        workspaceCharges, // פירוט חיובי חללי עבודה
        meetingRoomCharges, // פירוט חיובי חדרי ישיבות
        subtotal, // סכום ביניים
        taxAmount, // סכום מע"מ
        total // סכום כולל לתשלום
    };
    // החזרת אובייקט המכיל את החשבונית וכל פירוטי החיובים.
};

