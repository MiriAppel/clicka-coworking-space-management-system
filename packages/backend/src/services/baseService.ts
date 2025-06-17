import { supabase } from "../db/supabaseClient";
import { ID } from "../types/core";

export class baseService <T> {

    // בשביל שם המחלקה
    constructor(private tableName: string) {}

    getById = async (id: ID): Promise <T> => {

        const { data, error } = await supabase
            .from(this.tableName)
            .select('*')
            .eq('id', id)
            .single()

        if (error)
            throw error;
        return data;

    }

    getAll = async (): Promise <T[]> {
        
        const { data, error } = await supabase
            .from(this.tableName)
            .select('*')

        if (!data || data.length === 0) {
            console.warn("לא נמצאו נתונים");
            return[];
        }
    }
}