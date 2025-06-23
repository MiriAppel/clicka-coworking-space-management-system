import { createClient } from '@supabase/supabase-js';
import { UserModel } from '../models/User'; // נניח שהמודל User נמצא באותו תיק
import { logUserActivity } from '../utils/logger';

const supabaseUrl = 'https://your-project.supabase.co'; // החלף עם ה-URL של פרויקט ה-Supabase שלך
const supabaseAnonKey = 'your-anon-key'; // החלף עם ה-Anon Key שלך
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export class UserService {

    // פונקציה ליצירת משתמש
    async createUser(user: UserModel): Promise<UserModel | null> {
        const { data, error } = await supabase
            .from('users') // שם הטבלה ב-Supabase
            .insert([user.toDatabaseFormat()]);

        if (error) {
            console.error('Error creating user:', error);
            return null;
        }

            const createdUser = data as unknown as UserModel; // המרה לסוג UserModel
            // רישום פעילות המשתמש
            logUserActivity(createdUser.id, 'User created');
            //החזרת המשתמש שנוצר
            return createdUser; 
        
    }
        // פונקציה לקבל את כל המשתמשים
    async getAllUsers(): Promise<UserModel[]| null> {
        const { data, error } = await supabase
            .from('users')
            .select('*')

        if (error) {
            console.error('Error fetching user:', error);
            return null;
        }
        const createdUser = data as UserModel[]; // המרה לסוג UserModel
        // רישום פעילות המשתמשים
        createdUser.forEach(user => {
            logUserActivity(user.id, 'User fetched');
        });
        // מחזיר את כל המשתמשים שנמצאו
        return createdUser; 
        
    }

    // פונקציה לקרוא משתמש לפי ID
    async getUserById(id: string): Promise<UserModel | null> {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error('Error fetching user:', error);
            return null;
        }

        const user = data as UserModel; // המרה לסוג UserModel
        // רישום פעילות המשתמש
        logUserActivity(user.id, 'User fetched by ID');
        // מחזיר את המשתמש שנמצא
        return user;
    }

    //  googleId פונקציה לקרוא משתמש לפי  
    async loginByGoogleId(googleId: string): Promise<UserModel | null> {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('googleId', googleId)
            .single();

        if (error) {
            console.error('Error fetching user by Google ID:', error);
            return null;
        }

        const user = data as UserModel; // המרה לסוג UserModel
        // רישום פעילות המשתמש
        logUserActivity(user.id, 'User logged in by Google ID');
        // מחזיר את המשתמש שנמצא
        return user; 
    }

    // פונקציה לעדכן משתמש
    async updateUser(id: string, updatedData: Partial<UserModel>): Promise<UserModel | null> {
        const { data, error } = await supabase
            .from('users')
            .update(updatedData)
            .eq('id', id);

        if (error) {
            console.error('Error updating user:', error);
            return null;
        }
        const user = data as unknown as UserModel; // המרה לסוג UserModel
        // רישום פעילות המשתמש
        logUserActivity(user.id, 'User logged in by Google ID');
        // מחזיר את המשתמש המעודכן
        return user; 
        

    }

    // פונקציה למחוק משתמש
    async deleteUser(id: string): Promise<boolean> {
        const { error } = await supabase
            .from('users')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting user:', error);
            return false;
        }
        // רישום פעילות המשתמש
        logUserActivity(id, 'User deleted');
        // מחזיר true אם המשתמש נמחק בהצלחה
        return true; 
    }
}
