// ייבוא Supabase client ליצירת קשר עם מסד הנתונים
import { createClient } from '@supabase/supabase-js';

// ייבוא טיפוסי בקשות והגדרות עבור הוצאות
import type { CreateExpenseRequest, UpdateExpenseRequest, GetExpensesRequest, MarkExpenseAsPaidRequest } from 'shared-types';

// קריאת משתני סביבה - פרטי התחברות ל-Supabase
const supabaseUrl = process.env.SUPABASE_URL || '';  // כתובת פרויקט Supabase
const supabaseAnonKey = process.env.SUPABASE_KEY || '';  // מפתח השירות של Supabase

// יצירת client חדש של Supabase
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// הגדרת מחלקת ExpenseService - אחראית על פעולות במסד הנתונים הקשורות להוצאות
export class ExpenseService {

    /**
     * יצירת הוצאה חדשה במסד הנתונים
     * @param expenseData - הנתונים של ההוצאה (מה-body של הבקשה)
     * @returns ההוצאה שנוצרה או null במקרה של כישלון
     */
    async createExpense(expenseData: CreateExpenseRequest) {
        const { data, error } = await supabase
            .from('expense')              // שם הטבלה ב-Supabase
            .insert([expenseData])         // הכנסת ההוצאה החדשה לטבלה
            .select()                      // בקשה לקבל את הרשומה החדשה שחזרה
            .single();                     // מצפה לרשומה בודדת

        if (error) {
            console.error('Error creating expense:', error);  // הדפסת השגיאה ללוג
            return null;                                      // החזרת null במקרה של כישלון
        }

        return data;  // החזרת ההוצאה שנוצרה בהצלחה
    }

    /**
     * שליפת רשימת הוצאות עם אפשרות לסינון
     * @param filters - אובייקט עם קריטריוני סינון (קטגוריה, סטטוס, תאריכים וכו')
     * @returns מערך הוצאות או null במקרה של כישלון
     */
    async getExpenses(filters: GetExpensesRequest) {
        let query = supabase
            .from('expense')        // עבודה מול טבלת ההוצאות
            .select('*');            // בחירה של כל השדות

        // סינון לפי vendorId (ספק)
        if (filters.vendorId) {
            query = query.eq('vendor_id', filters.vendorId);
        }

        // סינון לפי קטגוריות
        if (filters.category && filters.category.length > 0) {
            query = query.in('category', filters.category);
        }

        // סינון לפי סטטוסים
        if (filters.status && filters.status.length > 0) {
            query = query.in('status', filters.status);
        }

        // סינון לפי טווח תאריכים (from-to)
        if (filters.dateFrom) {
            query = query.gte('date', filters.dateFrom);
        }
        if (filters.dateTo) {
            query = query.lte('date', filters.dateTo);
        }

        // הוספת מיון לפי שדה שנבחר
        if (filters.sortBy) {
            query = query.order(filters.sortBy, { ascending: filters.sortDirection !== 'desc' });
        }

        const { data, error } = await query;  // הרצת השאילתה מול המסד

        if (error) {
            console.error('Error fetching expenses:', error);  // הדפסת השגיאה
            return null;
        }

        return data;  // החזרת תוצאות
    }

    /**
     * שליפת הוצאה בודדת לפי מזהה (ID)
     * @param id - מזהה ההוצאה
     * @returns ההוצאה או null אם לא נמצאה
     */
    async getExpenseById(id: string) {
        const { data, error } = await supabase
            .from('expense')        // עבודה מול טבלת ההוצאות
            .select('*')             // שליפת כל השדות
            .eq('id', id)            // תנאי לפי מזהה
            .single();               // ציפייה לתוצאה אחת בלבד

        if (error) {
            console.error('Error fetching expense by ID:', error);
            return null;
        }

        return data;
    }

    /**
     * עדכון הוצאה קיימת לפי מזהה
     * @param id - מזהה ההוצאה
     * @param updateData - נתוני העדכון
     * @returns ההוצאה המעודכנת או null במקרה של כישלון
     */
    async updateExpense(id: string, updateData: UpdateExpenseRequest) {
        const { data, error } = await supabase
            .from('expense')            // טבלת ההוצאות
            .update(updateData)          // ביצוע עדכון בשדות הרצויים
            .eq('id', id)                // תנאי לפי מזהה ההוצאה
            .select()                    // בקשה לקבל את הרשומה המעודכנת
            .single();                   // תוצאה בודדת

        if (error) {
            console.error('Error updating expense:', error);
            return null;
        }

        return data;
    }

    /**
     * סימון הוצאה כבתשלום (Mark as Paid)
     * @param id - מזהה ההוצאה
     * @param paidData - פרטי התשלום (תאריך, אמצעי תשלום וכו')
     * @returns ההוצאה המעודכנת או null במקרה של כישלון
     */
    async markExpenseAsPaid(id: string, paidData: MarkExpenseAsPaidRequest) {
        const { data, error } = await supabase
            .from('expense')              // טבלת ההוצאות
            .update({
                status: 'PAID',            // שינוי סטטוס ל-PAID
                paid_date: paidData.paidDate,  // עדכון תאריך התשלום
                payment_method: paidData.paymentMethod,  // אמצעי תשלום
                reference: paidData.reference,           // רפרנס אם יש
                notes: paidData.notes                   // הערות
            })
            .eq('id', id)                // תנאי לפי מזהה ההוצאה
            .select()                    // בקשה לקבל את הרשומה המעודכנת
            .single();                   // תוצאה בודדת

        if (error) {
            console.error('Error marking expense as paid:', error);
            return null;
        }

        return data;
    }

    /**
     * מחיקת הוצאה מהמסד לפי מזהה
     * @param id - מזהה ההוצאה
     * @returns true אם הצליח, false אם נכשל
     */
    async deleteExpense(id: string) {
        const { error } = await supabase
            .from('expense')     // טבלת ההוצאות
            .delete()             // מחיקה
            .eq('id', id);        // תנאי לפי מזהה

        if (error) {
            console.error('Error deleting expense:', error);
            return false;
        }

        return true;
    }
}
export async function getExpensesByVendorId(vendorId: string) {
  const { data, error } = await supabase
    .from('expense')
    .select('*')
    .eq('vendor_id', vendorId);

  if (error) {
    throw error;
  }

  return data;
}