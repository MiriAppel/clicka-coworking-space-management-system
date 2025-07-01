import { createClient } from '@supabase/supabase-js';
import { Translation } from 'shared-types';
import { translateText } from '../utils/translate';
import { supportedLanguages } from 'shared-types';
import dotenv from 'dotenv';
import { TranslationModel } from '../models/TranslationRecord';
import { supabase } from '../db/supabaseClient';

dotenv.config();



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
        if (existing.length > 0) {
            console.log('its exists already');
            return [];
        }

        let translatedText = '';
        
        if (lang === 'en')
            translatedText = await translateText(text, lang, 'he');
        else
            translatedText = await translateText(text, lang, 'en');
        const newTranslations: TranslationModel[] = [];

        const alreadyExists = existing.find(e => e.en === translatedText || e.he === translatedText);
        let translation: TranslationModel;
        if (!alreadyExists) {
            if (lang === 'en') {
                 translation = new TranslationModel(
                    key,
                    text,
                    translatedText,
                    new Date(),
                    new Date(),
                );

            }
            else {
                translation = new TranslationModel(
                    key,
                    translatedText,
                    text,
                    new Date(),
                    new Date(),
                );
            }
        };

        const selfExists = existing.find(e => e.en === lang || e.he === lang);

        const { error } = await supabase
            .from('translations')
            .insert([translation!.toDatabaseFormat()]);
        console.log('Inserting translations:', newTranslations);

        if (error) {
            console.error('Error inserting translations:', error);
            return [];
        }

        return newTranslations;
    }
}

// יצוא השירות
export const translationService = new TranslationService();
