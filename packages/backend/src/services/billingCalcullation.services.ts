// הפונקציה הזו:
// מקבלת את כל הנתונים הנדרשים (כולל שכבות תמחור, תקופות, ותק, כמות, וכו').
// מחשבת מחיר ליחידה לפי ותק.
// מבצעת פרורציה אם צריך.
// מחשבת סה"כ, מע"מ, וסה"כ לתשלום.
// מחזירה פירוט לכל חלל ולחשבונית.

import { PricingTier, ID, DateISO, BillingItemType, InvoiceStatus, WorkspaceType } from '../../../shared-types'; // ייבוא טיפוסים רלוונטיים
import { MeetingRoomPricing } from '../../../shared-types/pricing'; // ייבוא טיפוס תמחור חדרי ישיבות
import { differenceInCalendarDays, startOfMonth, endOfMonth } from 'date-fns'; // פונקציות עזר לתאריכים
import { VAT_RATE } from '../constants'; // קבוע מע"מ
import { createInvoice, InvoiceItemModel, InvoiceModel } from '../models/invoice.model'; // מודלים של חשבונית ופריט חשבונית
import { generateId } from '../models/invoice.mock-db'; // פונקציה ליצירת מזהה ייחודי
import { customerService } from './customer.service'; // שירות לשליפת לקוחות
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv'; // ייבוא dotenv לקריאת משתני סביבה
import { BookingService } from '../services/booking.service';
import { getCurrentMeetingRoomPricing } from '../services/pricing.service'; // שירות לשליפת תמחור חדרי ישיבות
dotenv.config();
const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_KEY!);
// --- הרחבת מבני קלט ---
// מבנה להזמנת חדר ישיבות
interface MeetingRoomBooking {
    bookingId: ID;
    roomId: ID;
    totalHours: number;
    pricing: MeetingRoomPricing;
    isKlikahCardHolder?: boolean;
}

// מבנה להנחה
interface Discount {
    id: ID;
    description: string;
    amount: number; // סכום הנחה בש"ח (שלילי)
}

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
    discounts?: Discount[];
    // fees?: Fee[];
    taxRate?: number; // אחוז מע"מ, ברירת מחדל 18%
}

// תוצאה של חישוב חיוב - מחזירה גם חשבונית וגם פירוט חיובים
export interface BillingCalculationResult {
    invoice: InvoiceModel;
    workspaceCharges: any[];
    meetingRoomCharges: any[];
    discounts: Discount[];
    // fees: Fee[];
    subtotal: number;
    taxAmount: number;
    total: number;
}
export const calculateBillingForCustomer = async (
    customerId: ID,
    billingPeriod: { startDate: DateISO; endDate: DateISO },
    dueDate: DateISO,
    taxRate: number = VAT_RATE
) => {
    const serviceCustomer = new customerService();
    const bookingService = new BookingService();
    // שליפת הלקוח
    const customer = await serviceCustomer.getById(customerId);
    if (!customer) throw new Error('Customer not found');

    // כאן נשלוף גם את כל ההנחות, חדרי ישיבות, עמלות וכו' של הלקוח
    // שליפת כל ההזמנות של הלקוח
    const allBookings = await bookingService.getAllBooking();
    const customerBookings = allBookings
        ? allBookings.filter(
            b =>
                b.customerId === customerId &&
                b.startTime >= billingPeriod.startDate &&
                b.endTime <= billingPeriod.endDate
        )
        : [];
    // שליפת המחיר הנוכחי לחדרי ישיבות
    const meetingRoomPricing = await getCurrentMeetingRoomPricing();
    if (!meetingRoomPricing) throw new Error('No meeting room pricing found');


    // המרה ל-MeetingRoomBooking
    const meetingRoomBookings: MeetingRoomBooking[] = customerBookings.map(b => ({
        bookingId: b.id!,
        roomId: b.roomId,
        totalHours: b.totalHours,
        pricing: meetingRoomPricing, // המחיר לחדר
        // isKlikahCardHolder, כ זה יחושב בפונקציה הראשית לפי workspaces
    }));

    // כאן נניח שיש לך מערך workspaces על הלקוח (אם לא, תצטרכי לשלוף אותו)
    const workspaces = Array.isArray((customer as any).workspaces)
        ? (customer as any).workspaces
        : customer.currentWorkspaceType
            ? [{
                workspaceId: 'main', // מזהה חלל ראשי, ניתן לשנות לפי הצורך
                workspaceType: customer.currentWorkspaceType,
                contractStart: customer.contractStartDate,
                workspaceStart: customer.contractStartDate,
                workspaceEnd: undefined,
                quantity: customer.workspaceCount,
                pricingTiers: [] // צריך למלא לפי הצורך
            }]
            : [];

    const billingInput: BillingCalculationInput = {
        customerId: customer.id!,
        customerName: customer.name,
        billingPeriod,
        dueDate,
        workspaces,
        meetingRoomBookings: meetingRoomBookings || [], // אם אין חדרי ישיבות, השתמש במערך ריק
        // discounts: discounts || [], // אם אין הנחות, השתמש במערך ריק
        // fees: fees || [], // אם אין עמלות, השתמש במערך ריק
        taxRate
    };
    // קריאה לפונקציית החישוב
    return billingCalculation(billingInput);
};

// פונקציית החישוב הראשית
export const billingCalculation = (input: BillingCalculationInput): BillingCalculationResult => {
    const taxRate = input.taxRate ?? VAT_RATE; // קובע את אחוז המע"מ (ברירת מחדל 18%)
    let subtotal = 0; // סכום ביניים לפני מע"מ
    const workspaceCharges: any[] = []; // מערך לפירוט חיובי חללים
    const meetingRoomCharges: any[] = []; // מערך לפירוט חיובי חדרי ישיבות
    const items: InvoiceItemModel[] = []; // מערך פריטים לחשבונית

    // בדיקה האם ללקוח יש כרטיס קליקה (לפחות אחד מסוג KLIKAH_CARD)
    const isKlikahCardHolder = input.workspaces.some(
        ws => ws.workspaceType === WorkspaceType.KLIKAH_CARD
    );

    // חישוב חיובי חללים (משרדים/עמדות)
    for (const ws of input.workspaces) {
        // בוחר את שכבת התמחור הרלוונטית לפי סוג, תאריך, והאם פעילה
        const pricing = ws.pricingTiers
            .filter(
                p =>
                    p.workspaceType === ws.workspaceType &&
                    p.active &&
                    new Date(p.effectiveDate) <= new Date(input.billingPeriod.startDate)
            )
            .sort((a, b) => new Date(b.effectiveDate).getTime() - new Date(a.effectiveDate).getTime())[0];
        if (!pricing) throw new Error('No pricing tier found for workspace');

        // מחשב את שנות הוותק של הלקוח (לפי תחילת חוזה)
        const tenureYears = Math.max(
            1,
            Math.floor(
                (new Date(input.billingPeriod.startDate).getTime() - new Date(ws.contractStart).getTime()) /
                (365 * 24 * 60 * 60 * 1000)
            ) + 1
        );
        // בוחר את המחיר ליחידה לפי הוותק
        let unitPrice = pricing.year1Price;
        if (tenureYears === 2) unitPrice = pricing.year2Price;
        else if (tenureYears === 3) unitPrice = pricing.year3Price;
        else if (tenureYears >= 4) unitPrice = pricing.year4Price;

        // קובע את טווח החיוב בפועל (כניסה/יציאה באמצע התקופה)
        const periodStart = ws.workspaceStart > input.billingPeriod.startDate ? ws.workspaceStart : input.billingPeriod.startDate;
        const periodEnd = ws.workspaceEnd && ws.workspaceEnd < input.billingPeriod.endDate ? ws.workspaceEnd : input.billingPeriod.endDate;
        // מחשב האם יש חיוב יחסי (פרורציה) ומהו הגורם
        const monthStart = startOfMonth(new Date(periodStart));
        const monthEnd = endOfMonth(new Date(periodStart));
        const totalDays = differenceInCalendarDays(monthEnd, monthStart) + 1;
        const billedStart = new Date(periodStart) < monthStart ? monthStart : new Date(periodStart);
        const billedEnd = new Date(periodEnd) > monthEnd ? monthEnd : new Date(periodEnd);
        const billedDays = differenceInCalendarDays(billedEnd, billedStart) + 1;
        const prorationFactor = billedDays / totalDays;
        const prorated = prorationFactor < 1;
        // מחשב את הסכום לחיוב עבור חלל זה (כולל פרורציה)
        const totalPrice = Math.round(ws.quantity * unitPrice * prorationFactor * 100) / 100;

        // מוסיף את פירוט החיוב למערך (לשימוש עתידי/דוחות)
        workspaceCharges.push({
            workspaceId: ws.workspaceId,
            workspaceType: ws.workspaceType,
            quantity: ws.quantity,
            unitPrice,
            totalPrice,
            pricingTier: tenureYears,
            period: { startDate: periodStart, endDate: periodEnd },
            prorated,
            prorationFactor: prorated ? prorationFactor : undefined,
        });

        // הוספת פריט לחשבונית (פריט מסוג WORKSPACE_RENTAL)
        items.push(
            new InvoiceItemModel(
                generateId(),
                '', // invoice_id ימולא לאחר יצירת החשבונית
                'WORKSPACE_RENTAL' as BillingItemType,
                `השכרת ${ws.workspaceType}`,
                ws.quantity,
                unitPrice,
                totalPrice,
                taxRate,
                Math.round(totalPrice * (taxRate / 100) * 100) / 100,
                ws.workspaceType,
                ws.workspaceId,
                new Date().toISOString(),
                new Date().toISOString()
            )
        );

        subtotal += totalPrice; // מוסיף לסכום הביניים
    }

    // חישוב חיובי חדרי ישיבות
    if (input.meetingRoomBookings) {
        // 34 שעות חינם ללקוחות קליקה כארד
        let freeHoursLeft = 34;
        for (const booking of input.meetingRoomBookings) {
            let hourlyRate = booking.pricing.hourlyRate;
            let chargeableHours = booking.totalHours;
            let discountApplied = 0;

            if (isKlikahCardHolder) {
                // שעות חינם עד 34 שעות בחודש
                let freeHoursForThisBooking = Math.min(freeHoursLeft, booking.totalHours);
                freeHoursLeft -= freeHoursForThisBooking;
                chargeableHours = booking.totalHours - freeHoursForThisBooking;
                discountApplied = freeHoursForThisBooking * hourlyRate;

                // מחיר 100 ש"ח לשעה לכל שעה בתשלום מעבר ל-3 שעות
                if (chargeableHours > 3) {
                    hourlyRate = 100;
                }
            } else {
                // ללקוחות רגילים: מחיר רגיל, הנחה לשעות רבות
                if (booking.totalHours >= 4) {
                    hourlyRate = booking.pricing.discountedHourlyRate;
                }
            }

            // מחשב את הסכום לחיוב עבור הזמנה זו
            const totalCharge = Math.round(chargeableHours * hourlyRate * 100) / 100;

            // מוסיף לפירוט החיוב
            meetingRoomCharges.push({
                bookingId: booking.bookingId,
                roomId: booking.roomId,
                totalHours: booking.totalHours,
                chargeableHours,
                hourlyRate,
                totalCharge,
                discountApplied: discountApplied > 0 ? discountApplied : undefined,
            });

            // הוספת פריט לחשבונית (פריט מסוג MEETING_ROOM)
            items.push(
                new InvoiceItemModel(
                    generateId(),
                    '', // invoice_id ימולא לאחר יצירת החשבונית
                    'MEETING_ROOM' as BillingItemType,
                    `הזמנת חדר ישיבות`,
                    chargeableHours,
                    hourlyRate,
                    totalCharge,
                    taxRate,
                    Math.round(totalCharge * (taxRate / 100) * 100) / 100,
                    undefined,
                    booking.bookingId,
                    new Date().toISOString(),
                    new Date().toISOString()
                )
            );

            subtotal += totalCharge; // מוסיף לסכום הביניים
        }
    }

    // הנחות
    const discounts = input.discounts ?? [];
    const totalDiscounts = discounts.reduce((sum, d) => sum + (d.amount || 0), 0);
    for (const discount of discounts) {
        items.push(
            new InvoiceItemModel(
                generateId(),
                '',
                'DISCOUNT' as BillingItemType,
                discount.description,
                1,
                discount.amount,
                discount.amount,
                taxRate,
                Math.round(discount.amount * (taxRate / 100) * 100) / 100,
                undefined,
                undefined,
                new Date().toISOString(),
                new Date().toISOString()
            )
        );
    }

    // // עמלות
    // const fees = input.fees ?? [];
    // const totalFees = fees.reduce((sum, f) => sum + (f.amount || 0), 0);
    // for (const fee of fees) {
    //     items.push(
    //         new InvoiceItemModel(
    //             generateId(),
    //             '',
    //             'LATE_FEE' as BillingItemType,
    //             fee.description,
    //             1,
    //             fee.amount,
    //             fee.amount,
    //             taxRate,
    //             Math.round(fee.amount * (taxRate / 100) * 100) / 100,
    //             undefined,
    //             undefined,
    //             new Date().toISOString(),
    //             new Date().toISOString()
    //         )
    //     );
    // }

    // חישוב סופי של סכומים
    const taxAmount = Math.round(subtotal * (taxRate / 100) * 100) / 100;
    const total = Math.round((subtotal + taxAmount) * 100) / 100;

    // יצירת אובייקט חשבונית מלא
    const now = new Date().toISOString();
    const invoice = new InvoiceModel(
        generateId(), // מזהה ייחודי לחשבונית
        '', // ?  מס חשבונית 
        input.customerId,
        input.customerName,
        InvoiceStatus.DRAFT, // סטטוס ראשוני
        now, // תאריך הפקה
        input.dueDate, // תאריך יעד
        items, // כל הפריטים שחושבו
        subtotal,
        taxAmount,
        false, // payment_due_reminder
        undefined, // payment_dueReminder_sentAt
        now, // נוצר בתאריך
        now  // עודכן בתאריך
    );

    // מחזיר את כל הפירוט, כולל החשבונית וכל סוגי החיובים
    return {
        invoice,
        workspaceCharges,
        meetingRoomCharges,
        discounts,
        // fees,
        subtotal,
        taxAmount,
        total
    };
};