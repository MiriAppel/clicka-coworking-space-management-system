
import type{ ID } from "shared-types";
import { InvoiceModel } from "./invoice.model";


// מערך שישמש כ"דאטה בייס" זמני
export const invoicesMockDb: InvoiceModel[] = [];

//generateId
export function generateId(): ID {
    return (Math.random() * 1000000).toFixed(0) as ID;
}

