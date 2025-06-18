
import { InvoiceModel } from "./Invoice-model";
import { ID } from "../../../types/core";

// מערך שישמש כ"דאטה בייס" זמני
export const invoicesMockDb: InvoiceModel[] = [];

//generateId
export function generateId(): ID {
    return (Math.random() * 1000000).toFixed(0) as ID;
}

