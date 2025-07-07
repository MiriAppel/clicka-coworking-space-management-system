// // ייבוא Supabase client ליצירת קשר עם מסד הנתונים
// import { createClient } from '@supabase/supabase-js';

// // ייבוא טיפוסי בקשות והגדרות עבור הוצאות
// import type { CreateExpenseRequest, UpdateExpenseRequest, GetExpensesRequest, MarkExpenseAsPaidRequest } from 'shared-types';

// // קריאת משתני סביבה - פרטי התחברות ל-Supabase
// const supabaseUrl = process.env.SUPABASE_URL || '';  // כתובת פרויקט Supabase
// const supabaseAnonKey = process.env.SUPABASE_KEY || '';  // מפתח השירות של Supabase

// // יצירת client חדש של Supabase
// const supabase = createClient(supabaseUrl, supabaseAnonKey);

// // הגדרת מחלקת ExpenseService - אחראית על פעולות במסד הנתונים הקשורות להוצאות
// export class ExpenseService {
//     async createExpense(expenseData: CreateExpenseRequest) {
//         const { data, error } = await supabase
//             .from('expenses')              // שם הטבלה ב-Supabase
//             .insert([expenseData])         // הכנסת ההוצאה החדשה לטבלה
//             .select()                      // בקשה לקבל את הרשומה החדשה שחזרה
//             .single();                     // מצפה לרשומה בודדת

//         if (error) {
//             console.error('Error creating expense:', error);  // הדפסת השגיאה ללוג
//             return null;                                      // החזרת null במקרה של כישלון
//         }

//         return data;  // החזרת ההוצאה שנוצרה בהצלחה
//     }

//      async getExpenses1() {
//         let query = supabase
//             .from('expenses')        // עבודה מול טבלת ההוצאות
//             .select('*');  
//         const { data, error } = await query;  // הרצת השאילתה מול המסד
//         if (error) {
//             console.error('Error fetching expenses:', error);  // הדפסת השגיאה
//             return null;
//         }
//         return data;
//     }
//     async getExpenses(filters: GetExpensesRequest) {
//         let query = supabase
//             .from('expenses')        // עבודה מול טבלת ההוצאות
//             .select('*');            // בחירה של כל השדות

//         // סינון לפי vendorId (ספק)
//         if (filters.vendorId) {
//             query = query.eq('vendor_id', filters.vendorId);
//         }

//         // סינון לפי קטגוריות
//         if (filters.category && filters.category.length > 0) {
//             query = query.in('category', filters.category);
//         }

//         // סינון לפי סטטוסים
//         if (filters.status && filters.status.length > 0) {
//             query = query.in('status', filters.status);
//         }

//         // סינון לפי טווח תאריכים (from-to)
//         if (filters.dateFrom) {
//             query = query.gte('date', filters.dateFrom);
//         }
//         if (filters.dateTo) {
//             query = query.lte('date', filters.dateTo);
//         }

//         // הוספת מיון לפי שדה שנבחר
//         if (filters.sortBy) {
//             query = query.order(filters.sortBy, { ascending: filters.sortDirection !== 'desc' });
//         }

//         const { data, error } = await query;  // הרצת השאילתה מול המסד

//         if (error) {
//             console.error('Error fetching expenses:', error);  // הדפסת השגיאה
//             return null;
//         }

//         return data;  // החזרת תוצאות
//     }

//     async getExpenseById(id: string) {
//         const { data, error } = await supabase
//             .from('expenses')        // עבודה מול טבלת ההוצאות
//             .select('*')             // שליפת כל השדות
//             .eq('id', id)            // תנאי לפי מזהה
//             .single();               // ציפייה לתוצאה אחת בלבד

//         if (error) {
//             console.error('Error fetching expense by ID:', error);
//             return null;
//         }

//         return data;
//     }
//     async updateExpense(id: string, updateData: UpdateExpenseRequest) {
//         const { data, error } = await supabase
//             .from('expenses')            // טבלת ההוצאות
//             .update(updateData)          // ביצוע עדכון בשדות הרצויים
//             .eq('id', id)                // תנאי לפי מזהה ההוצאה
//             .select()                    // בקשה לקבל את הרשומה המעודכנת
//             .single();                   // תוצאה בודדת

//         if (error) {
//             console.error('Error updating expense:', error);
//             return null;
//         }

//         return data;
//     }
//     async markExpenseAsPaid(id: string, paidData: MarkExpenseAsPaidRequest) {
//         const { data, error } = await supabase
//             .from('expenses')              // טבלת ההוצאות
//             .update({
//                 status: 'PAID',            // שינוי סטטוס ל-PAID
//                 paid_date: paidData.paidDate,  // עדכון תאריך התשלום
//                 payment_method: paidData.paymentMethod,  // אמצעי תשלום
//                 reference: paidData.reference,           // רפרנס אם יש
//                 notes: paidData.notes                   // הערות
//             })
//             .eq('id', id)                // תנאי לפי מזהה ההוצאה
//             .select()                    // בקשה לקבל את הרשומה המעודכנת
//             .single();                   // תוצאה בודדת

//         if (error) {
//             console.error('Error marking expense as paid:', error);
//             return null;
//         }

//         return data;
//     }
//     async deleteExpense(id: string) {
//         const { error } = await supabase
//             .from('expenses')     // טבלת ההוצאות
//             .delete()             // מחיקה
//             .eq('id', id);        // תנאי לפי מזהה

//         if (error) {
//             console.error('Error deleting expense:', error);
//             return false;
//         }

//         return true;
//     }
// }
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import type { CreateExpenseRequest, UpdateExpenseRequest, GetExpensesRequest, MarkExpenseAsPaidRequest } from 'shared-types';

dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);

export class ExpenseService {
  async createExpense(expenseData: CreateExpenseRequest) {
    try {
      const { data, error } = await supabase
        .from('expense')
        .insert([expenseData])
        .select()
        .single();

      if (error) {
        console.error('Error creating expense:', error);
        return null;
      }

      return data;
    } catch (err) {
      console.error('Unexpected error in createExpense:', err);
      return null;
    }
  }

  async getExpenses1() {
    try {
      const { data, error } = await supabase
        .from('expense')
        .select('*');

      if (error) {
        console.error('Error fetching expenses:', error);
        return null;
      }

      return data;
    } catch (err) {
      console.error('Unexpected error in getExpenses1:', err);
      return null;
    }
  }

  async getExpenses(filters: GetExpensesRequest) {
    try {
      let query = supabase.from('expense').select('*');
console.log("Using filters:", {
  vendorId: filters.vendorId,
  category: filters.category,
  status: filters.status,
  dateFrom: filters.dateFrom,
  dateTo: filters.dateTo,
  sortBy: filters.sortBy,
  sortDirection: filters.sortDirection
});

      if (filters.vendorId) {
        query = query.eq('vendor_id', filters.vendorId);
      } 

      if (filters.category && filters.category.length > 0) {
        query = query.in('category', filters.category);
      }

      if (filters.status && filters.status.length > 0) {
        query = query.in('status', filters.status);
      }

      if (filters.dateFrom) {
        query = query.gte('date', filters.dateFrom);
      }

      if (filters.dateTo) {
        query = query.lte('date', filters.dateTo);
      }

      if (filters.sortBy) {
        query = query.order(filters.sortBy, { ascending: filters.sortDirection !== 'desc' });
      }

      const { data, error } = await query;
      if (error) {
        console.error('Error fetching expenses with filters:', error);
        return null;
      }

      return data;
    } catch (err) {
      console.error('Unexpected error in getExpenses:', err);
      return null;
    }
  }

  async getExpenseById(id: string) {
    try {
      const { data, error } = await supabase
        .from('expense')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching expense by ID:', error);
        return null;
      }

      return data;
    } catch (err) {
      console.error('Unexpected error in getExpenseById:', err);
      return null;
    }
  }

  async updateExpense(id: string, updateData: UpdateExpenseRequest) {
    try {
      const { data, error } = await supabase
        .from('expense')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating expense:', error);
        return null;
      }

      return data;
    } catch (err) {
      console.error('Unexpected error in updateExpense:', err);
      return null;
    }
  }

  async markExpenseAsPaid(id: string, paidData: MarkExpenseAsPaidRequest) {
    try {
      const { data, error } = await supabase
        .from('expense')
        .update({
          status: 'PAID',
          paid_date: paidData.paidDate,
          payment_method: paidData.paymentMethod,
          reference: paidData.reference,
          notes: paidData.notes,
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error marking expense as paid:', error);
        return null;
      }

      return data;
    } catch (err) {
      console.error('Unexpected error in markExpenseAsPaid:', err);
      return null;
    }
  }

  async deleteExpense(id: string) {
    try {
      const { error } = await supabase
        .from('expense')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting expense:', error);
        return false;
      }

        return true;
    }
    catch (err) {
      console.error('Unexpected error in deleteExpense:', err);
      return false;
    }}
 async  getExpensesByVendorId(vendorId: string) {
  const { data, error } = await supabase
    .from('expense')
    .select('*')
    .eq('vendor_id', vendorId);

  if (error) {
    throw error;
  }

  return data;
}
}