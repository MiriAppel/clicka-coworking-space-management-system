// translation-types.d.ts

import { ID, DateISO } from './core';
import { Language } from './language';

/**
 * רשומת תרגום בודדת
 */
export interface Translation {
  id: ID;
  key: string;           // מזהה ייחודי למחרוזת (כגון: 'menu.dashboard')
  lang: Language;        // שפת התרגום (לדוגמה: 'he', 'en')
  text: string;          // המחרוזת המתורגמת
  context?: string;      // הקשר/הסבר פנימי או הערה למתרגם (אופציונלי)
  createdAt: DateISO;
  updatedAt: DateISO;
}

/**
 * בקשה להוספת תרגום חדש
 */
export interface CreateTranslationRequest {
  key: string;
  lang: Language;
  text: string;
  context?: string;
}

/**
 * בקשה לעדכון תרגום קיים
 */
export interface UpdateTranslationRequest {
  text?: string;
  context?: string;
}

/**
 * בקשה לשליפת תרגומים עם סינון
 */
export interface GetTranslationsRequest {
  key?: string;
  lang?: Language;
  search?: string; // חיפוש חלקי בטקסטים
  page?: number;
  limit?: number;
  sortBy?: 'key' | 'lang' | 'createdAt';
  sortDirection?: 'asc' | 'desc';
}
