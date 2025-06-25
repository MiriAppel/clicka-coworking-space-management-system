import { createClient } from '@supabase/supabase-js';
import { Translation } from 'shared-types';
import { translateText } from '../utils/translate';
import { supportedLanguages } from 'shared-types';
import dotenv from 'dotenv';
import { v4 as uuid } from 'uuid';
import { TranslationModel } from '../models/TranslationRecord';

dotenv.config();

// יצירת לקוח Supabase
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// בדיקת תקינות שפה
function isLanguage(value: string): value is string {
    return supportedLanguages.includes(value as any);
}

// שירות התרגום
export class TranslationService {

    // פונקציה לקבלת תרגומים לפי מפתח
    async getByKey(key: string): Promise<TranslationModel[]> {
        const { data, error } = await supabase
            .from('translations')
            .select('*')
            .eq('key', key);

        if (error) {
            console.error('Error fetching by key:', error);
            return [];
        }

        return data as TranslationModel[];
    }

    // פונקציה לקבלת תרגומים לפי שפה
    async getByLang(lang: string): Promise<TranslationModel[]> {
        if (!isLanguage(lang)) {
            throw new Error(`Invalid language: ${lang}`);
        }

        const { data, error } = await supabase
            .from('translations')
            .select('*')
            .or(`en.eq.${lang},he.eq.${lang}`);

        if (error) {
            console.error('Error fetching by language:', error);
            return [];
        }

        return data as TranslationModel[];
    }

    // פונקציה ליצירת תרגומים עבור כל השפות החסרות
    async createWithTranslations(base: { key: string; text: string; lang: string }): Promise<TranslationModel[]> {
        const { key, text, lang } = base;

        // הבאת תרגומים קיימים
        const existing = await this.getByKey(key);
        const langsToTranslate = supportedLanguages.filter(l => l !== lang);

        const newTranslations: TranslationModel[] = [];

        for (const targetLang of langsToTranslate) {
            const alreadyExists = existing.find(e => e.en === targetLang || e.he === targetLang);
            if (alreadyExists) continue;

            const translatedText = await translateText(text, lang, targetLang);

            const translation: TranslationModel = new TranslationModel(
                uuid(),
                key,
                targetLang,
                translatedText,
                new Date(),
                new Date(),
            );

            newTranslations.push(translation);
        }

        const selfExists = existing.find(e => e.en === lang || e.he === lang);
        if (!selfExists) {
            newTranslations.push(new TranslationModel(
                '',
                key,
                lang,
                text,
                new Date(),
                new Date(),
            ));
        }

        const { error } = await supabase
            .from('translations')
            .insert([...newTranslations.map(t => (t.toDatabaseFormat()))]);

        if (error) {
            console.error('Error inserting translations:', error);
            return [];
        }

        return newTranslations;
    }
}

// יצוא השירות
export const translationService = new TranslationService();
