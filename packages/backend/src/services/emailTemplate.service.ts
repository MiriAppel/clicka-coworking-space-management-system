import { createClient } from '@supabase/supabase-js';
import { EmailTemplateModel } from '../models/emailTemplate.model';
import dotenv from 'dotenv';
// טוען את משתני הסביבה מקובץ .env
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export class EmailTemplateService {

    // פונקציה ליצירת תבנית דוא"ל
    async createTemplate(template: EmailTemplateModel): Promise<EmailTemplateModel | null> {
        const { data, error } = await supabase
            .from('email_templates') // שם הטבלה ב-Supabase
            .insert([template.toDatabaseFormat()])
            .select()
            .single();
        if (error) {
            console.error('Error creating email template:', error);
            return null;
        }
        const createdTemplate = data as unknown as EmailTemplateModel; // המרה לסוג EmailTemplateModel
        return createdTemplate;
    }

    // פונקציה לקבל את כל תבניות הדוא"ל
    async getAllTemplates(): Promise<EmailTemplateModel[] | null> {
        const { data, error } = await supabase
            .from('email_templates')
            .select('*');
        if (error) {
            console.error('Error fetching email templates:', error);
            return null;
        }
        const templates = data as EmailTemplateModel[]; // המרה לסוג EmailTemplateModel
        return templates;
    }

    // פונקציה לקרוא תבנית דוא"ל לפי ID
    async getTemplateById(id: string): Promise<EmailTemplateModel | null> {
        const { data, error } = await supabase
            .from('email_templates')
            .select('*')
            .eq('id', id)
            .single();
        if (error) {
            console.error('Error fetching email template by ID:', error);
            return null;
        }
        const template = data as EmailTemplateModel; // המרה לסוג EmailTemplateModel
        return template;
    }

    // פונקציה לעדכן תבנית דוא"ל
    async updateTemplate(id: string, updatedData: EmailTemplateModel): Promise<EmailTemplateModel | null> {
        const { data, error } = await supabase
            .from('email_templates')
            .update(updatedData.toDatabaseFormat())
            .eq('id', id)
            .select()
            .single();
        if (error) {
            console.error('Error updating email template:', error);
            return null;
        }
        const updatedTemplate = data as unknown as EmailTemplateModel; // המרה לסוג EmailTemplateModel
        return updatedTemplate;
    }
    // פונקציה למחוק תבנית דוא"ל
    async deleteTemplate(id: string): Promise<boolean> {
        const { error } = await supabase
            .from('email_templates')
            .delete()
            .eq('id', id);
        if (error) {
            console.error('Error deleting email template:', error);
            return false;
        }
        return true; // מחזיר true אם המחיקה הצליחה
    }

    // פונקציה להציג תצוגה מקדימה של תבנית דוא"ל עם משתנים דינמיים
    // async previewTemplate(id: string, dynamicVariables: Record<string, string>): Promise<string | null> {
    //     const template = await this.getTemplateById(id); // קבלת התבנית לפי ה-ID
    //     if (!template) {
    //         return null; // אם התבנית לא נמצאה, מחזירים null
    //     }
    //     let renderedBody = template.bodyHtml; // בוחרים את גוף התבנית (HTML או טקסט)
    //     for (const [key, value] of Object.entries(dynamicVariables)) { // עבור כל משתנה דינמי
    //         const regex = new RegExp(`{{${key}}}`, 'g'); // יוצרים רג'קס להחלפת המשתנה
    //         renderedBody = renderedBody.replace(regex, value); // מחליפים את המשתנה בתוכן
    //     }
    //     return renderedBody; // מחזירים את התוצאה המוחלפת
    // }

    async previewTemplate(id: string, dynamicVariables: Record<string, string>): Promise<string | null> {
        const template = await this.getTemplateById(id);
        console.log('Retrieved Template:', template); // הוסף לוג כאן
        if (!template || !template.bodyHtml) {
            return null; // אם התבנית לא נמצאה או שאין לה גוף HTML
        }
        let renderedBody = template.bodyHtml;
        for (const [key, value] of Object.entries(dynamicVariables)) {
            const regex = new RegExp(`{{${key}}}`, 'g');
            renderedBody = renderedBody.replace(regex, value);
        }
        return renderedBody;
    }
}
