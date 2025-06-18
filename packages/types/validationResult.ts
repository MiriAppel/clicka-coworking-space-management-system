// תוצאה של אימות פרמטרים לדוח
export interface ValidationResult {
  isValid: boolean; // האם הפרמטרים תקינים
  errors?: string[]; // הודעות שגיאה (אם יש)
  warnings?: string[]; // אזהרות (לא חובה)
  fieldsWithError?: string[]; // שמות שדות עם שגיאה (לא חובה)
}