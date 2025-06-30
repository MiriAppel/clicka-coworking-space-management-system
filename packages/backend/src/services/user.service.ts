import { createClient } from '@supabase/supabase-js';
import { UserModel } from '../models/user.model'; // נניח שהמודל User נמצא באותו תיק
import { logUserActivity } from '../utils/logger';
import dotenv from 'dotenv';
//טוען את משתני הסביבה מהקובץ .env
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_KEY || '';
console.log(supabaseUrl, supabaseAnonKey);
const supabase = createClient(supabaseUrl, supabaseAnonKey);


export class UserService {

    // פונקציה ליצירת משתמש
    async createUser(user: UserModel): Promise<UserModel | null> {
        console.log(user);
        
        const { data, error } = await supabase
            .from('users') // שם הטבלה ב-Supabase
            .insert([user.toDatabaseFormat()])
            .select()
            .single();
        
        if (error) {
            console.error('Error creating user:', error);
            return null;
        }

        const createdUser = UserModel.fromDatabaseFormat(data);
            // רישום פעילות המשתמש
            logUserActivity(user.id? user.id:user.firstName, 'User created');
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
        const createdUser = UserModel.fromDatabaseFormatArray(data) // המרה לסוג UserModel
        // רישום פעילות המשתמשים
        createdUser.forEach(user => {
            logUserActivity(user.id? user.id:user.firstName, 'User fetched');
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

        const user = UserModel.fromDatabaseFormat(data); // המרה לסוג UserModel
        // רישום פעילות המשתמש
        logUserActivity(user.id? user.id:user.firstName, 'User fetched by ID');
        // מחזיר את המשתמש שנמצא
        return user;
    }

    //  googleId פונקציה לקרוא משתמש לפי  
    async loginByGoogleId(googleId: string): Promise<UserModel | null> {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('google_id', googleId)
            .single();

        if (error) {
            console.error('Error fetching user by Google ID:', error);
            return null;
        }

        const user = UserModel.fromDatabaseFormat(data); // המרה לסוג UserModel
        // רישום פעילות המשתמש
        logUserActivity(user.id? user.id:user.firstName, 'User logged in by Google ID');
        // מחזיר את המשתמש שנמצא
        return user; 
    }

    // פונקציה לעדכן משתמש
    async updateUser(id: string, updatedData: UserModel): Promise<UserModel | null> {

        const { data, error } = await supabase
            .from('users')
            .update([updatedData.toDatabaseFormat()])
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Error updating user:', error);
            return null;
        }
        const user = UserModel.fromDatabaseFormat(data); // המרה לסוג UserModel
        // רישום פעילות המשתמש
        logUserActivity(user.id ? user.id : user.firstName, 'User updated');
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