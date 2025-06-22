import { supabase } from "../db/supabaseClient";
import { ID } from "../../../../types/core";

export class baseService <T> {

    // בשביל שם המחלקה
    constructor(private tableName: string) {}


    getById = async (id: ID): Promise <T> => {

        const { data, error } = await supabase
            .from(this.tableName)
            .select('*')
            .eq('id', id)
            .single()

        if (error) {
            console.error("שגיאה בשליפת נתונים:", error);
            throw error;
        }   

        if (!data) {
            throw new Error(`לא נמצא רשומה עם מזהה ${id}`);
        }

        return data;

    }

    getByFilters = async (filters: Partial<T>): Promise<T[]> => {

        let query = supabase
            .from(this.tableName)
            .select('*');

        Object.entries(filters).forEach(([key, value]) => {

            if (typeof value === 'string') {
                query = query.ilike(key, `%${value}%`); // חיפוש חלקי 
            } else {
                query = query.eq(key, value); // חיפוש מדויק
            }
        });

        const { data, error } = await query;

        if (error) {
            console.error("שגיאה בשליפת נתונים עם פילטרים:", error);
            throw error;
        }

        return data ?? [];
    }   



    getAll = async (): Promise <T[]> => {
        
        const { data, error } = await supabase
            .from(this.tableName)
            .select('*')

        if (error) {
            console.error("שגיאה בשליפת נתונים:", error);
            throw error;
        }               

        if (!data || data.length === 0) {
            throw new Error(`לא נמצאו נתונים`);
        }

        return data;           
    }

    patch = async (dataToUpdate: Partial<T>, id: ID): Promise <T> => {

        const { data, error } = await supabase
            .from(this.tableName)
            .update(dataToUpdate)
            .eq('id', id)
            .select()

        if (error) {
            console.error("שגיאה בעדכון הנתונים:", error);
            throw error;
        }

        if (!data || data.length === 0) 
            throw new Error("לא התקבלה תשובה מהשרת אחרי העדכון");        

        return data[0];
    }

    post = async (dataToAdd: T): Promise <T> => {

        const { data, error } = await supabase
            .from(this.tableName)
            .insert([dataToAdd])
            .select() 

        if (error) {
            console.error("שגיאה בהוספת הנתונים:", error);
            throw error;
        }

        if (!data || data.length === 0) 
            throw new Error("לא התקבלה תשובה מהשרת אחרי ההוספה");
        
        return data[0]; // מחזיר את מה שנוצר
    }

    delete = async (id: ID): Promise <void> => {

        const { data, error } = await supabase
            .from(this.tableName)
            .delete()
            .eq('id', id)

        if (error) {
            console.error("שגיאה במחיקת הנתונים:", error);
            throw error;
        }   
        
    }

}