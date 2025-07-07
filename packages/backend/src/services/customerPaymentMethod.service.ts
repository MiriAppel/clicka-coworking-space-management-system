import { customerPaymentMethodModel } from "../models/customerPaymentMethod.model";
import { baseService } from "./baseService";
import { CustomerPeriod } from "shared-types";

export class customerPaymentMethodService extends baseService<customerPaymentMethodModel> {
    constructor() {
        super("customer_payment_method"); // שם הטבלה ב-DB
    }
}

export const serviceCustomerPaymentMethod = new customerPaymentMethodService();