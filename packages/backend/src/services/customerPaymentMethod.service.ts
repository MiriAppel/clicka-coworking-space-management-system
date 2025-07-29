import { customerPaymentMethodModel } from "../models/customerPaymentMethod.model";
import { baseService } from "./baseService";
import { supabase } from "../db/supabaseClient";

export class customerPaymentMethodService extends baseService<customerPaymentMethodModel> {
    constructor() {
        super("customer_payment_method"); // שם הטבלה ב-DB
    }

    async getByCustomerId(customerId: string): Promise<customerPaymentMethodModel[]> {
        const { data, error } = await supabase
            .from("customer_payment_method")
            .select("*")
            .eq("customer_id", customerId);

        if (error) {
            console.error("Error fetching payment methods by customer ID:", error);
            throw error;
        }

        return customerPaymentMethodModel.fromDatabaseFormatArray(data) || [];
    }
}

export const serviceCustomerPaymentMethod = new customerPaymentMethodService();