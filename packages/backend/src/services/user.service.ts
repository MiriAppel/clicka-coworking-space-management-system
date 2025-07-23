import { createClient } from '@supabase/supabase-js';
import { UserModel } from '../models/user.model'; // נניח שהמודל User נמצא באותו תיק
import { logUserActivity } from '../utils/logger';
import dotenv from 'dotenv';
import { LoginResponse, UserRole } from 'shared-types';
import { Response } from 'express';
import { supabase } from '../db/supabaseClient';
import { decrypt } from './cryptoService';
import bcrypt from 'bcrypt';
//טוען את משתני הסביבה מהקובץ .env
dotenv.config();

export class UserService {
    // async verifyUserPassword(id: string | undefined, password: string): Promise<boolean> {
    //     try {
    //         const { data, error } = await supabase
    //             .from('users')
    //             .select('password')
    //             .eq('id', id)
    //             .single();

    //         if (error || !data) {
    //             console.error('Error fetching user password:', error || 'No user found');
    //             return false;
    //         }

    //         const dcryptPassword = decrypt(data.password)
    //         return dcryptPassword === password;
    //     } catch (error) {
    //         console.error('Error verifying user password:', error);
    //         throw error;
    //     }
    // }

    // פונקציה ליצירת משתמש
    async createUser(user: UserModel): Promise<UserModel | null> {
        try {
            if (await this.getUserByEmail(user.email)) {
                throw new Error(`User with email ${user.email} already exists`);
            }
            const { data, error } = await supabase
                .from('users') // שם הטבלה ב-Supabase
                .insert([user.toDatabaseFormat()])
                .select()
                .single();

            const createdUser = UserModel.fromDatabaseFormat(data);
            // רישום פעילות המשתמש
            logUserActivity(user.id ? user.id : user.firstName, 'User created');
            //החזרת המשתמש שנוצר
            return createdUser;
        }
        catch (error) {
            console.error('Error creating user:', error);
            throw error; // זריקת השגיאה כדי לטפל בה במקום אחר
        }

    }

    // פונקציה לקבל את כל המשתמשים
    async getAllUsers(): Promise<UserModel[] | null> {

        const { data, error } = await supabase
            .from('users')
            .select('*')

        if (error) {
            console.error('Error fetching user:', error);
            return null;
        }
        const createdUser = UserModel.fromDatabaseFormatArray(data) // המרה לסוג UserModel
        // מחזיר את כל המשתמשים שנמצאו
        return createdUser;

    }

    // פונקציה לקרוא משתמש לפי ID
    async getUserById(id: string): Promise<UserModel | null> {
        try {
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
            logUserActivity(user.id ? user.id : user.firstName, 'User fetched by ID');
            // מחזיר את המשתמש שנמצא
            return user;
        }
        catch (error) {
            console.error('Error fetching user by ID:', error);
            throw error; // זריקת השגיאה כדי לטפל בה במקום אחר
        }
    }

    async getUserByEmail(email: string): Promise<UserModel | null> {
        try {
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .eq('email', email)
                .single();
            if (error || !data) {
                console.error('Error fetching user by Google ID:', error || 'No user found');
                return null;
            }
            const user = UserModel.fromDatabaseFormat(data); // המרה לסוג UserModel
            // רישום פעילות המשתמש
            logUserActivity(user.id ? user.id : user.firstName, 'User fetched by email');
            // מחזיר את המשתמש שנמצא
            return user;
        }
        catch (error) {
            console.error('Error fetching user by email:', error);
            throw error; // זריקת השגיאה כדי לטפל בה במקום אחר
        }
    }
    async updatePassword(userId: string, hashedPassword: string): Promise<UserModel | null> {
        try {
            const { data, error } = await supabase
                .from('users')
                .update({ password: hashedPassword })
                .eq('id', userId)
                .select()
                .single();

            if (error) {
                console.error('Error updating user password:', error);
                return null;
            }

            return UserModel.fromDatabaseFormat(data);
        } catch (error) {
            console.error('Error updating user password:', error);
            throw error;
        }
    }
    async updateGoogleIdUser(id: string, googleId: string): Promise<UserModel | null> {
        try {
            const { data, error } = await supabase
                .from('users')
                .update({ google_id: googleId })
                .eq('id', id)
                .select()
                .single();

            const user = UserModel.fromDatabaseFormat(data); // המרה לסוג UserModel
            // רישום פעילות המשתמש
            logUserActivity(user.id ? user.id : user.firstName, 'User Google ID updated');
            // מחזיר את המשתמש המעודכן
            return user;
        }
        catch (error) {
            console.error('Error updating Google ID:', error);
            throw error; // זריקת השגיאה כדי לטפל בה במקום אחר
        }
    }


    //  googleId פונקציה לקרוא משתמש לפי  
    async loginByGoogleId(googleId: string): Promise<UserModel | null> {
        try {
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .eq('google_id', googleId)
                .single();
            if (error || !data) {
                console.error('Error fetching user by Google ID:', error || 'No user found');
                return null;
            }
            const user = UserModel.fromDatabaseFormat(data); // המרה לסוג UserModel

            // רישום פעילות המשתמש
            logUserActivity(user.id ? user.id : user.firstName, 'User logged in by Google ID');
            // מחזיר את המשתמש שנמצא
            return user;
        }
        catch (error) {
            console.error('Error fetching user by Google ID:', error);
            throw error; // זריקת השגיאה כדי לטפל בה במקום אחר
        }
    }

    // פונקציה לעדכן משתמש
    async updateUser(id: string, updatedData: UserModel): Promise<UserModel | null> {
        try {
            const { data, error } = await supabase
                .from('users')
                .update([updatedData.toDatabaseFormat()])
                .eq('id', id)
                .select()
                .single();


            const user = UserModel.fromDatabaseFormat(data); // המרה לסוג UserModel
            // רישום פעילות המשתמש
            logUserActivity(user.id ? user.id : user.firstName, 'User updated');
            // מחזיר את המשתמש המעודכן
            return user;
        }
        catch (error) {
            console.error('Error updating user:', error);
            throw error; // זריקת השגיאה כדי לטפל בה במקום אחר
        }
    }
    // פונקציה למחוק משתמש
    async deleteUser(id: string): Promise<boolean> {
        try {
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
        catch (error) {
            console.error('Error deleting user:', error);
            throw error; // זריקת השגיאה כדי לטפל בה במקום אחר
        }
    }


    createRoleCookies(res: Response<LoginResponse | { error: string }>, roleUser: UserRole): void {
        // שליפת ה-role מתוך ה-resulte
        const role = roleUser;
        // הגדרת cookie עם ה-role
        res.cookie('role', role, {
            httpOnly: true,// httpOnly כדי למנוע גישה דרך JavaScript
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
        });
    }
    clearRoleCookie = (res: Response): void => {
        res.clearCookie('role', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
        });
    };
}