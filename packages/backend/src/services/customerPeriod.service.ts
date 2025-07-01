import { baseService } from "./baseService";
import { CustomerPeriod } from "shared-types";

export class customerPeriodService extends baseService<CustomerPeriod> {
    constructor() {
        super("customer_period"); // שם הטבלה ב-DB
    }
}

export const serviceCustomerPeriod = new customerPeriodService();