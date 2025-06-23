// import { ID, PricingTier, WorkspaceType } from "shared-types";
// import { generateId } from "../models/invoice.mock-db";

// /**
//  *  1 יוצר רשומת תמחור חדשה עבור סוג סביבת עבודה מסוימת ולתאריך התחלה נתון.
//  *
//  * @param request - פרטי התמחור המתקבלים (סוג סביבה, מחירים לשנים, תאריך תחילה)
//  * @param createdBy - מזהה המשתמש שמבצע את הפעולה
//  * @returns אובייקט PricingTier מוכן לשמירה במסד הנתונים
//  */
//  export function createPricingTier(request: PricingTierCreateRequest, createdBy: ID): PricingTier {
// // מקרי קצה: מחירים שליליים

//   // מתבצעת בדיקה האם סוג הסביבה סופק
  
//   // נבדק שהתאריך התקף (effectiveDate) הוא מהיום והלאה
  
//   // נוצר אובייקט תמחור חדש עם כל הערכים הדרושים
//   const pricingTier: PricingTier = {
//     id: generateId(),
//     workspaceType: request.workspaceType,
//     year1Price: request.year1Price,
//     year2Price: request.year2Price,
//     year3Price: request.year3Price,
//     year4Price: request.year4Price,
//     effectiveDate: request.effectiveDate,
//     active: true,
//     // createdBy: createdBy,
//     createdAt: new Date().toISOString(),
//     updatedAt: new Date().toISOString()
//   };

//   return pricingTier;
// }
// /**
//  * 2 יוצר רשומת תמחור חדשה עבור סוג סביבת עבודה מסוימת ולתאריך תחילה נתון,
//  * תוך ניהול היסטוריית תמחור מלאה.
//  *
//  * @param request - פרטי התמחור המתקבלים (סוג סביבה, מחירים לשנים, תאריך תחילה)
//  * @param createdBy - מזהה המשתמש שמבצע את הפעולה
//  * @returns אובייקט PricingTier מוכן לשמירה במסד הנתונים
//  */
// export  function createPricingTierWithHistory(request: PricingTierCreateRequest, createdBy: ID): PricingTier {
// // מקרי קצה: מחירים שליליים
// // מקרי קצה: תאריך תחילה אינו יכול להיות בעבר
// // מקרי קצה: קיימת רשומה פעילה לאותו סוג סביבה עם תאריך חופף – מבטלים אותה

//   // מתבצעת בדיקה שהתאריך המבוקש לתחילת התמחור אינו תאריך שכבר עבר.
//   // אם התאריך קטן מהיום – הפעולה נזרקת עם הודעת שגיאה.

//   // כאן אפשר להוסיף לוגיקה של ביטול שכבה קיימת:
//   // למשל: deactivateOldPricingTier(request.workspaceType);

//   // שלב 3: יצירה בפועל באמצעות הפונקציה הקיימת
//   return createPricingTier(request, createdBy);
// }
// /**
//  * מחזירה את כל היסטוריית התמחור עבור סוג סביבת עבודה מסוים,
//  * כדי לאפשר למנהלת המערכת לעקוב אחרי שינויי תעריפים לאורך זמן.
//  *
//  * @param workspaceType - סוג הסביבה (למשל: משרד קטן, טרקלין)
//  * @returns מערך של רשומות תמחור ממויינות לפי תאריך תחילה מהישן לחדש
//  */
// export  function getPricingHistory(workspaceType: WorkspaceType): PricingTier[] {
//   // שלב 1: שליפת כל רשומות התמחור מהמסד עבור סוג הסביבה המבוקש.

//   // שלב 2: מיון הרשומות לפי תאריך תחילה, כך שהרשומה עם התאריך הכי מוקדם תופיע ראשונה.
//   // צריך להוסיף שליפה אמיתית לפי סוג סביבה

//   // שלב 3: החזרת רשימת הרשומות הממויינת.
//   // שלב 3: מיפוי לכל רשומה לפי המבנה המלא של PricingTier
//   // const sortedHistory: PricingTier[] = sorted.map(tier => ({
//   //   id: tier.id || generateId(), // במקרה שאין מזהה – מייצרים חדש
//   //   workspaceType: tier.workspaceType || workspaceType,
//   //   year1Price: tier.year1Price ?? 0,
//   //   year2Price: tier.year2Price ?? 0,
//   //   year3Price: tier.year3Price ?? 0,
//   //   year4Price: tier.year4Price ?? 0,
//   //   effectiveDate: tier.effectiveDate,
//   //   active: tier.active ?? true,
//   //   createdBy: tier.createdBy || "system",
//   //   createdAt: tier.createdAt || new Date().toISOString(),
//   //   updatedAt: tier.updatedAt || new Date().toISOString(),
//   // }));

//   //  return sortedHistory;
//    }

//  /**
//  *  3 מחזירה את רשומת התמחור התקפה כיום עבור סוג סביבת עבודה מסוים.
//  * מיועדת להצגת המחירים העדכניים ביותר למנהלת המערכת.
//  *
//  * @param workspaceType - סוג סביבת העבודה (למשל: משרד קטן, חדר ישיבות)
//  * @returns רשומת תמחור תקפה לפי תאריך ומצב פעיל, או null אם לא קיימת כזו
//  */
// export  function getCurrentPricingTier(workspaceType: WorkspaceType): PricingTier | null {
//   // שלב 1: שליפת כל רשומות התמחור מהמסד עבור סוג הסביבה הנתון
//   const allTiers = []
//   // getAllPricingTiersFromDatabase(workspaceType);

//   // שלב 2: קביעת התאריך הנוכחי לצורך בדיקת תוקף הרשומות
//   const now = new Date();

//   // שלב 3: חיפוש הרשומה הפעילה שתוקפה התחיל היום או מוקדם יותר
//   const tier = allTiers.find(tier =>
//     tier.active &&
//     new Date(tier.effectiveDate) <= now
//   );

//   // שלב 4: אם לא נמצאה רשומה כזו – מחזירים null
//   // if (!tier) return null;

//   // שלב 5: מיפוי הרשומה לתוך אובייקט תקני מסוג PricingTier
//   const currentTier: PricingTier = {
//     id: tier.id || generateId(),
//     workspaceType: tier.workspaceType || workspaceType,
//     year1Price: tier.year1Price ?? 0,
//     year2Price: tier.year2Price ?? 0,
//     year3Price: tier.year3Price ?? 0,
//     year4Price: tier.year4Price ?? 0,
//     effectiveDate: tier.effectiveDate,
//     active: tier.active ?? true,
//     createdBy: tier.createdBy || "system",
//     createdAt: tier.createdAt || new Date().toISOString(),
//     updatedAt: tier.updatedAt || new Date().toISOString(),
//   };

//   // שלב 6: החזרת האובייקט שמייצג את התמחור התקף כיום
//   // return currentTier;
// }
// /**
//  * 4 מעדכנת רשומת תמחור קיימת לפי מזהה, בהתאם לערכים החדשים שסופקו.
//  *
//  * @param id - מזהה רשומת התמחור שברצוננו לעדכן
//  * @param update - ערכים חדשים לעדכון ברשומה (למשל: מחירים לשנים חדשות, תאריך תחילה)
//  * @param updatedBy - מזהה המשתמש שמבצע את העדכון
//  * @returns אובייקט PricingTier מעודכן לשמירה במסד הנתונים
//  */
// export  function updatePricingTier(id: ID, update: Partial<PricingTier>, updatedBy: ID): PricingTier {
//     // בדיקה אם המזהה חוקי (לא ריק והוא מסוג מחרוזת)
//     // בדיקה אם מזהה העדכון תקין
//     // נבנה אובייקט חדש שמייצג את התמחור המעודכן

//     const updatedPricingTier: PricingTier = {
//       id: id,
//       workspaceType: update.workspaceType!, // ערך ברירת מחדל אם חסר
//       year1Price: update.year1Price ?? 0,
//       year2Price: update.year2Price ?? 0,
//       year3Price: update.year3Price ?? 0,
//       year4Price: update.year4Price ?? 0,
//       effectiveDate: update.effectiveDate || new Date().toISOString(),
//       active: update.active ?? true,
//       // createdBy: update.createdBy || "system",
//       createdAt: update.createdAt || new Date().toISOString(),
//       updatedAt: new Date().toISOString(),
//     };

//   return updatedPricingTier;
// }
// /**
//  * 5. מבצעת מחיקה לוגית של רשומת תמחור קיימת (השבתה במקום הסרה פיזית),
//  * על ידי שינוי השדה `active` ל־false.
//  *
//  * @param tier - רשומת התמחור שברצוננו להשבית
//  * @param updatedBy - מזהה המשתמש שמבצע את הפעולה
//  * @returns רשומת תמחור לא פעילה לשמירה במסד הנתונים
//  */
// export  function deletePricingTier(tier: PricingTier, updatedBy: ID): PricingTier {
//   // בדיקה שהתקבלה רשומת תמחור תקינה
//   // בדיקה שהתקבל מזהה משתמש תקין
//   // יוצרת עותק חדש מהרשומה, שבו מסמנים את הרשומה כלא פעילה
//   const deactivated: PricingTier = {
//     ...tier, 
//     active: false, 
//     updatedAt: new Date().toISOString(), 
//     // נרצה לשמור על createdBy המקורי, לכן לא נוגעים בו
//     //  updatedBy: updatedBy,
//   };

//   return deactivated;
// }

