// // src/__mocks__/supabaseClient.ts
// // זה קובץ ה-mock של supabaseClient.ts
// // Jest יחפש קובץ עם שם זהה לזה שאתה מייבא ב-pricing.service.ts
// // וייטען את ה-mock הזה במקומו.

// // Mock את ה-Supabase client.
// // תצטרך לממש את הפונקציות שאתה משתמש בהן בקובץ השירות שלך
// // כמו .from(), .select(), .insert(), .update(), .delete(), .eq(), .lte(), .order(), .limit(), .single(), .maybeSingle()

// const mockData = {}; // אובייקט שישמש כ"מסד נתונים" וירטואלי לבדיקות

// const mockSelect = jest.fn().mockReturnThis(); // מאפשר שרשור
// const mockFrom = jest.fn((tableName: string) => {
//   return {
//     select: mockSelect,
//     insert: jest.fn().mockReturnThis(),
//     update: jest.fn().mockReturnThis(),
//     delete: jest.fn().mockReturnThis(),
//     eq: jest.fn().mockReturnThis(),
//     neq: jest.fn().mockReturnThis(),
//     lte: jest.fn().mockReturnThis(),
//     order: jest.fn().mockReturnThis(),
//     limit: jest.fn().mockReturnThis(),
//     single: jest.fn(async () => {
//       // לוגיקה לדוגמה: נחזיר מה שהוגדר מראש ב-mockData או שגיאה
//       if (mockData[tableName]?.singleResult) {
//         return { data: mockData[tableName].singleResult, error: null };
//       }
//       return { data: null, error: { code: 'PGRST116', message: 'No rows found' } }; // Supabase "No rows found" error
//     }),
//     maybeSingle: jest.fn(async () => {
//       if (mockData[tableName]?.maybeSingleResult) {
//         return { data: mockData[tableName].maybeSingleResult, error: null };
//       }
//       return { data: null, error: null }; // no rows found, no error
//     }),
//   };
// });

// export const supabase = {
//   from: mockFrom,
// };

// // פונקציה לאיפוס ה-mocks בין בדיקות
// export const resetMocks = () => {
//   mockFrom.mockClear();
//   mockSelect.mockClear();
//   // אנו מניחים ש-mockData יאופס או יוגדר מחדש בכל בדיקה ספציפית
//   for (const key in mockData) {
//     delete mockData[key];
//   }
// };

// // פונקציות עזר להגדרת התנהגות ה-mock
// export const setMockSingleResult = (tableName: string, data: any) => {
//   if (!mockData[tableName]) mockData[tableName] = {};
//   mockData[tableName].singleResult = data;
// };

// export const setMockMaybeSingleResult = (tableName: string, data: any) => {
//   if (!mockData[tableName]) mockData[tableName] = {};
//   mockData[tableName].maybeSingleResult = data;
// };

// export const setMockError = (tableName: string, error: any) => {
//   if (!mockData[tableName]) mockData[tableName] = {};
//   mockData[tableName].error = error;
// };

// // חשוב לייצא את ה-mocked functions כדי שתוכל לשלוט בהן מהבדיקות
// export const mockSupabase = {
//     from: mockFrom,
// };