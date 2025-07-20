// // src/__tests__/pricing.service.test.ts
// import {
//   validatePrices,
//   checkEffectiveDateConflict,
//   createPricingTier,
//   createPricingTierWithHistory,
//   updatePricingTier,
//   createOrUpdatePricingTier,
//   // ... ייבא את כל הפונקציות שאתה רוצה לבדוק
// } from '../pricing.service';
// import { supabase, setMockMaybeSingleResult, setMockSingleResult, resetMocks, mockSupabase } from '../__mocks__/supabaseClient';
// import { PricingTierModel } from '../models/pricing.model'; // ייבא את המודל אם אתה משתמש בו לבניית אובייקטים

// // כדי לוודא שכל בדיקה מתחילה "נקייה"
// beforeEach(() => {
//   resetMocks(); // איפוס ה-mocks לפני כל בדיקה
//   // אפס את כל הפונקציות המדומות של supabase ללא תלות בקוד שלך
//   jest.clearAllMocks();
// });

// describe('validatePrices', () => {
//   it('should not throw an error for non-negative prices', () => {
//     expect(() => validatePrices([10, 20, 0, 5.5])).not.toThrow();
//   });

//   it('should throw an error for negative prices', () => {
//     expect(() => validatePrices([10, -5, 20])).toThrow("לא ניתן להזין מחירים שליליים");
//   });
// });

// describe('checkEffectiveDateConflict', () => {
//   it('should throw an error if a conflict is found for the same effective date and active status', async () => {
//     // הגדרת ה-mock שיחזיר נתונים סותרים
//     setMockMaybeSingleResult('pricing_tiers', { id: 'existing-id', effective_date: '2025-07-20' });

//     await expect(
//       checkEffectiveDateConflict(supabase, 'pricing_tiers', '2025-07-20', { workspace_type: 'Office' })
//     ).rejects.toThrow('תאריך התחולה 2025-07-20 מתנגש עם שכבה קיימת (id: existing-id)');
//   });

//   it('should not throw an error if no conflict is found', async () => {
//     // הגדרת ה-mock שיחזיר null (אין קונפליקט)
//     setMockMaybeSingleResult('pricing_tiers', null); // או לא להגדיר כלל, כי ברירת המחדל היא null

//     await expect(
//       checkEffectiveDateConflict(supabase, 'pricing_tiers', '2025-07-21', { workspace_type: 'Office' })
//     ).resolves.toBeUndefined();
//   });

//   it('should not throw an error if conflict is with excluded ID', async () => {
//     setMockMaybeSingleResult('pricing_tiers', null); // Mock this to return null for the query with .neq()
//     // זה דורש mock מורכב יותר של ה-supabase.from().eq().neq().maybeSingle()
//     // לדוגמה, נצטרך לוודא ש-eq ו-neq נקראות עם הערכים הנכונים
//     mockSupabase.from('pricing_tiers').select.mockReturnThis();
//     mockSupabase.from('pricing_tiers').eq.mockReturnThis();
//     mockSupabase.from('pricing_tiers').neq.mockReturnThis();
//     mockSupabase.from('pricing_tiers').maybeSingle.mockResolvedValueOnce({ data: null, error: null });


//     await expect(
//       checkEffectiveDateConflict(supabase, 'pricing_tiers', '2025-07-20', { workspace_type: 'Office' }, 'existing-id')
//     ).resolves.toBeUndefined();

//     // ודא שה-mock נקרא עם ה-neq הנכון
//     expect(mockSupabase.from('pricing_tiers').neq).toHaveBeenCalledWith('id', 'existing-id');
//   });

//   it('should throw an error for Supabase client errors (not PGRST116)', async () => {
//     // Mock את ה-maybeSingle לזרוק שגיאת Supabase כללית
//     mockSupabase.from('pricing_tiers').select.mockReturnThis();
//     mockSupabase.from('pricing_tiers').eq.mockReturnThis();
//     mockSupabase.from('pricing_tiers').maybeSingle.mockResolvedValueOnce({ data: null, error: { code: 'ANY_OTHER_ERROR', message: 'Test error' } });

//     await expect(
//       checkEffectiveDateConflict(supabase, 'pricing_tiers', '2025-07-20', { workspace_type: 'Office' })
//     ).rejects.toThrow('Failed to check for effective date conflicts.');
//   });
// });

// describe('createPricingTier', () => {
//   it('should create a new pricing tier with active: true', async () => {
//     // Mock כדי ש-checkEffectiveDateConflict לא יזרוק שגיאה
//     mockSupabase.from('pricing_tiers').select.mockReturnThis();
//     mockSupabase.from('pricing_tiers').eq.mockReturnThis();
//     mockSupabase.from('pricing_tiers').maybeSingle.mockResolvedValueOnce({ data: null, error: null });

//     // Mock את פעולת ה-insert
//     const mockInsertData = {
//       id: 'new-id-123',
//       workspace_type: 'Desk',
//       year1_price: 100,
//       year2_price: 90,
//       year3_price: 80,
//       year4_price: 70,
//       effective_date: '2025-08-01',
//       active: true,
//       created_at: new Date().toISOString(),
//       updated_at: new Date().toISOString(),
//     };
//     mockSupabase.from('pricing_tiers').insert.mockReturnThis();
//     mockSupabase.from('pricing_tiers').select.mockReturnThis();
//     mockSupabase.from('pricing_tiers').single.mockResolvedValueOnce({ data: mockInsertData, error: null });

//     const request = {
//       workspaceType: 'Desk',
//       year1Price: 100,
//       year2Price: 90,
//       year3Price: 80,
//       year4Price: 70,
//       effectiveDate: '2025-08-01',
//     };

//     const result = await createPricingTier(request);

//     expect(result).toBeDefined();
//     expect(result.id).toBe('new-id-123');
//     expect(result.workspaceType).toBe('Desk');
//     expect(result.active).toBe(true);
//     expect(mockSupabase.from('pricing_tiers').insert).toHaveBeenCalledTimes(1);
//     expect(mockSupabase.from('pricing_tiers').insert).toHaveBeenCalledWith(
//       expect.objectContaining({ active: true, effective_date: '2025-08-01' })
//     );
//   });

//   it('should throw an error if effectiveDate is in the past', async () => {
//     const request = {
//       workspaceType: 'Desk',
//       year1Price: 100,
//       year2Price: 90,
//       year3Price: 80,
//       year4Price: 70,
//       effectiveDate: '2024-01-01', // תאריך בעבר
//     };

//     await expect(createPricingTier(request)).rejects.toThrow("תאריך התחולה חייב להיות היום או בעתיד.");
//   });

//   it('should throw an error if workspaceType is missing', async () => {
//     const request = {
//       // workspaceType: undefined, // חסר בכוונה
//       year1Price: 100,
//       year2Price: 90,
//       year3Price: 80,
//       year4Price: 70,
//       effectiveDate: '2025-08-01',
//     } as any; // Cast to any to simulate missing field

//     await expect(createPricingTier(request)).rejects.toThrow("חובה לבחור סוג סביבת עבודה.");
//   });

//   it('should throw an error if pricing tier creation fails in Supabase', async () => {
//     // Mock כדי ש-checkEffectiveDateConflict לא יזרוק שגיאה
//     mockSupabase.from('pricing_tiers').select.mockReturnThis();
//     mockSupabase.from('pricing_tiers').eq.mockReturnThis();
//     mockSupabase.from('pricing_tiers').maybeSingle.mockResolvedValueOnce({ data: null, error: null });

//     // Mock את פעולת ה-insert לזרוק שגיאה
//     mockSupabase.from('pricing_tiers').insert.mockReturnThis();
//     mockSupabase.from('pricing_tiers').select.mockReturnThis();
//     mockSupabase.from('pricing_tiers').single.mockResolvedValueOnce({ data: null, error: { message: 'DB error' } });

//     const request = {
//       workspaceType: 'Desk',
//       year1Price: 100,
//       year2Price: 90,
//       year3Price: 80,
//       year4Price: 70,
//       effectiveDate: '2025-08-01',
//     };

//     await expect(createPricingTier(request)).rejects.toThrow('הפעולה ליצירת שכבת תמחור נכשלה.');
//   });
// });

// describe('createPricingTierWithHistory', () => {
//   it('should deactivate current active pricing and then create new', async () => {
//     const now = new Date();
//     const currentActiveId = 'active-pricing-1';
//     const newPricingTierRequest = {
//       workspaceType: 'Desk',
//       year1Price: 100,
//       year2Price: 90,
//       year3Price: 80,
//       year4Price: 70,
//       effectiveDate: now.toISOString().split('T')[0], // היום
//     };

//     // Mock עבור שלב 1: אחזור המחיר הפעיל הנוכחי
//     mockSupabase.from('pricing_tiers').select.mockReturnThis();
//     mockSupabase.from('pricing_tiers').eq.mockReturnThis();
//     mockSupabase.from('pricing_tiers').lte.mockReturnThis();
//     mockSupabase.from('pricing_tiers').order.mockReturnThis();
//     mockSupabase.from('pricing_tiers').limit.mockReturnThis();
//     mockSupabase.from('pricing_tiers').single
//       .mockResolvedValueOnce({ data: { id: currentActiveId }, error: null }); // מצא מחיר פעיל קיים

//     // Mock עבור שלב 2: עדכון המחיר הפעיל הקודם (active: false)
//     mockSupabase.from('pricing_tiers').update.mockReturnThis();
//     mockSupabase.from('pricing_tiers').eq.mockReturnThis();
//     mockSupabase.from('pricing_tiers').update
//       .mockResolvedValueOnce({ data: null, error: null }); // עדכון הצליח

//     // Mock עבור שלב 3: יצירת מחיר חדש
//     // (זה ידמה את הקריאה ל-createPricingTier מתוך הפונקציה)
//     // תצטרך לוודא ש-checkEffectiveDateConflict לא זורק שגיאה
//     mockSupabase.from('pricing_tiers').select.mockReturnThis(); // עבור checkEffectiveDateConflict
//     mockSupabase.from('pricing_tiers').eq.mockReturnThis(); // עבור checkEffectiveDateConflict
//     mockSupabase.from('pricing_tiers').maybeSingle.mockResolvedValueOnce({ data: null, error: null }); // checkEffectiveDateConflict
//     // Mock insert of the new pricing tier
//     mockSupabase.from('pricing_tiers').insert.mockReturnThis();
//     mockSupabase.from('pricing_tiers').select.mockReturnThis();
//     mockSupabase.from('pricing_tiers').single
//       .mockResolvedValueOnce({ // יצירת מחיר חדש הצליחה
//         data: {
//           id: 'new-pricing-id',
//           workspace_type: newPricingTierRequest.workspaceType,
//           year1_price: newPricingTierRequest.year1Price,
//           effective_date: newPricingTierRequest.effectiveDate,
//           active: true,
//           created_at: now.toISOString(),
//           updated_at: now.toISOString(),
//         },
//         error: null,
//       });

//     const result = await createPricingTierWithHistory(newPricingTierRequest);

//     expect(mockSupabase.from('pricing_tiers').eq).toHaveBeenCalledWith('id', currentActiveId); // ודא שהעדכון כוון ל-ID הנכון
//     expect(mockSupabase.from('pricing_tiers').update).toHaveBeenCalledWith(
//       expect.objectContaining({ active: false }) // ודא ש-active הוגדר ל-false
//     );
//     expect(mockSupabase.from('pricing_tiers').insert).toHaveBeenCalledTimes(1); // ודא שיצירה חדשה נקראה
//     expect(result.active).toBe(true);
//     expect(result.id).toBe('new-pricing-id');
//   });

//   it('should create new pricing directly if no active pricing found', async () => {
//     const now = new Date();
//     const newPricingTierRequest = {
//       workspaceType: 'Desk',
//       year1Price: 100,
//       year2Price: 90,
//       year3Price: 80,
//       year4Price: 70,
//       effectiveDate: now.toISOString().split('T')[0], // היום
//     };

//     // Mock עבור שלב 1: אחזור המחיר הפעיל הנוכחי - לא נמצא (PGRST116)
//     mockSupabase.from('pricing_tiers').select.mockReturnThis();
//     mockSupabase.from('pricing_tiers').eq.mockReturnThis();
//     mockSupabase.from('pricing_tiers').lte.mockReturnThis();
//     mockSupabase.from('pricing_tiers').order.mockReturnThis();
//     mockSupabase.from('pricing_tiers').limit.mockReturnThis();
//     mockSupabase.from('pricing_tiers').single
//       .mockResolvedValueOnce({ data: null, error: { code: 'PGRST116', message: 'No rows found' } });

//     // Mock עבור שלב 3: יצירת מחיר חדש
//     mockSupabase.from('pricing_tiers').select.mockReturnThis(); // עבור checkEffectiveDateConflict
//     mockSupabase.from('pricing_tiers').eq.mockReturnThis(); // עבור checkEffectiveDateConflict
//     mockSupabase.from('pricing_tiers').maybeSingle.mockResolvedValueOnce({ data: null, error: null }); // checkEffectiveDateConflict
//     mockSupabase.from('pricing_tiers').insert.mockReturnThis();
//     mockSupabase.from('pricing_tiers').select.mockReturnThis();
//     mockSupabase.from('pricing_tiers').single
//       .mockResolvedValueOnce({
//         data: {
//           id: 'new-pricing-id-only',
//           workspace_type: newPricingTierRequest.workspaceType,
//           year1_price: newPricingTierRequest.year1Price,
//           effective_date: newPricingTierRequest.effectiveDate,
//           active: true,
//           created_at: now.toISOString(),
//           updated_at: now.toISOString(),
//         },
//         error: null,
//       });

//     const result = await createPricingTierWithHistory(newPricingTierRequest);

//     expect(mockSupabase.from('pricing_tiers').update).not.toHaveBeenCalled(); // ודא שלא היה ניסיון לעדכן
//     expect(mockSupabase.from('pricing_tiers').insert).toHaveBeenCalledTimes(1);
//     expect(result.active).toBe(true);
//     expect(result.id).toBe('new-pricing-id-only');
//   });

//   // ... הוסף בדיקות נוספות עבור תרחישי שגיאה
// });

// describe('createOrUpdatePricingTier', () => {
//     // 1. תרחיש יצירה חדשה
//     it('should create a new pricing tier and deactivate existing active ones', async () => {
//         const now = new Date();
//         const request = {
//             workspaceType: 'Desk',
//             year1Price: 100,
//             year2Price: 90,
//             year3Price: 80,
//             year4Price: 70,
//             effectiveDate: now.toISOString().split('T')[0], // היום או בעתיד
//         };

//         // Mock ל-deactivate של רשומות קודמות
//         mockSupabase.from('pricing_tiers').update.mockReturnThis();
//         mockSupabase.from('pricing_tiers').eq.mockReturnThis();
//         mockSupabase.from('pricing_tiers').update.mockResolvedValueOnce({ data: null, error: null });

//         // Mock ל-checkEffectiveDateConflict (אין קונפליקט)
//         mockSupabase.from('pricing_tiers').select.mockReturnThis();
//         mockSupabase.from('pricing_tiers').eq.mockReturnThis();
//         mockSupabase.from('pricing_tiers').maybeSingle.mockResolvedValueOnce({ data: null, error: null });

//         // Mock ל-insert של הרשומה החדשה
//         const mockNewData = {
//             id: 'new-tier-id',
//             workspace_type: 'Desk',
//             year1_price: 100,
//             year2_price: 90,
//             year3_price: 80,
//             year4_price: 70,
//             effective_date: request.effectiveDate,
//             active: true,
//             created_at: now.toISOString(),
//             updated_at: now.toISOString(),
//         };
//         mockSupabase.from('pricing_tiers').insert.mockReturnThis();
//         mockSupabase.from('pricing_tiers').select.mockReturnThis();
//         mockSupabase.from('pricing_tiers').single.mockResolvedValueOnce({ data: mockNewData, error: null });

//         const result = await createOrUpdatePricingTier(request, 'user-id-123');

//         expect(mockSupabase.from('pricing_tiers').update).toHaveBeenCalledWith(
//             expect.objectContaining({ active: false }) // ודא שרשומות קודמות נוטרלו
//         );
//         expect(mockSupabase.from('pricing_tiers').insert).toHaveBeenCalledTimes(1);
//         expect(result.id).toBe('new-tier-id');
//         expect(result.active).toBe(true);
//     });

//     // 2. תרחיש עדכון רשומה קיימת
//     it('should update an existing pricing tier without deactivating others', async () => {
//         const existingId = 'existing-tier-id';
//         const now = new Date();
//         const request = {
//             id: existingId,
//             workspaceType: 'Desk',
//             year1Price: 150, // מחיר מעודכן
//             effectiveDate: now.toISOString().split('T')[0],
//         };

//         // Mock לאחזור שכבת התמחור הקיימת
//         const existingTierData = {
//             id: existingId,
//             workspace_type: 'Desk',
//             year1_price: 100,
//             year2_price: 90,
//             year3_price: 80,
//             year4_price: 70,
//             effective_date: '2025-07-01',
//             active: true,
//             created_at: now.toISOString(),
//             updated_at: now.toISOString(),
//         };
//         mockSupabase.from('pricing_tiers').select.mockReturnThis();
//         mockSupabase.from('pricing_tiers').eq.mockReturnThis();
//         mockSupabase.from('pricing_tiers').single.mockResolvedValueOnce({ data: existingTierData, error: null });

//         // Mock ל-checkEffectiveDateConflict (אין קונפליקט, עם החרגת ID)
//         mockSupabase.from('pricing_tiers').select.mockReturnThis(); // עבור checkEffectiveDateConflict
//         mockSupabase.from('pricing_tiers').eq.mockReturnThis(); // עבור checkEffectiveDateConflict
//         mockSupabase.from('pricing_tiers').neq.mockReturnThis(); // עבור checkEffectiveDateConflict
//         mockSupabase.from('pricing_tiers').maybeSingle.mockResolvedValueOnce({ data: null, error: null });

//         // Mock לעדכון הרשומה
//         const updatedData = { ...existingTierData, year1_price: 150, effective_date: request.effectiveDate };
//         mockSupabase.from('pricing_tiers').update.mockReturnThis();
//         mockSupabase.from('pricing_tiers').eq.mockReturnThis();
//         mockSupabase.from('pricing_tiers').select.mockReturnThis();
//         mockSupabase.from('pricing_tiers').single.mockResolvedValueOnce({ data: updatedData, error: null });

//         const result = await createOrUpdatePricingTier(request, 'user-id-123');

//         expect(mockSupabase.from('pricing_tiers').update).not.toHaveBeenCalledWith(
//             expect.objectContaining({ active: false }) // ודא שרשומות קודמות לא נוטרלו
//         );
//         expect(mockSupabase.from('pricing_tiers').insert).not.toHaveBeenCalled();
//         expect(mockSupabase.from('pricing_tiers').update).toHaveBeenCalledWith(
//             expect.objectContaining({ year1_price: 150 }) // ודא שהעדכון בוצע
//         );
//         expect(result.id).toBe(existingId);
//         expect(result.year1Price).toBe(150);
//     });

//     // 3. ולידציה: תאריך התחולה בעבר
//     it('should throw an error if effectiveDate is in the past for both create and update', async () => {
//         const pastDateRequest = {
//             workspaceType: 'Desk',
//             year1Price: 100,
//             year2Price: 90,
//             year3Price: 80,
//             year4Price: 70,
//             effectiveDate: '2024-01-01', // תאריך בעבר
//         };

//         await expect(createOrUpdatePricingTier(pastDateRequest, 'user-id')).rejects.toThrow("תאריך התחולה חייב להיות היום או בעתיד.");
//     });

//     // 4. ולידציה: מחירים שליליים
//     it('should throw an error for negative prices', async () => {
//         const negativePriceRequest = {
//             workspaceType: 'Desk',
//             year1Price: -10, // מחיר שלילי
//             year2Price: 90,
//             year3Price: 80,
//             year4Price: 70,
//             effectiveDate: '2025-08-01',
//         };
//         await expect(createOrUpdatePricingTier(negativePriceRequest, 'user-id')).rejects.toThrow("לא ניתן להזין מחירים שליליים");
//     });

//     // 5. תרחיש שגיאה: התנגשות תאריכים
//     it('should throw an error if effective date conflicts with an existing tier (creation)', async () => {
//         const now = new Date();
//         const request = {
//             workspaceType: 'Desk',
//             year1Price: 100,
//             year2Price: 90,
//             year3Price: 80,
//             year4Price: 70,
//             effectiveDate: now.toISOString().split('T')[0],
//         };

//         // Mock ל-deactivate (בהצלחה)
//         mockSupabase.from('pricing_tiers').update.mockReturnThis();
//         mockSupabase.from('pricing_tiers').eq.mockReturnThis();
//         mockSupabase.from('pricing_tiers').update.mockResolvedValueOnce({ data: null, error: null });

//         // Mock ל-checkEffectiveDateConflict שיחזיר קונפליקט
//         mockSupabase.from('pricing_tiers').select.mockReturnThis();
//         mockSupabase.from('pricing_tiers').eq.mockReturnThis();
//         mockSupabase.from('pricing_tiers').maybeSingle.mockResolvedValueOnce({ data: { id: 'conflicting-id' }, error: null });

//         await expect(createOrUpdatePricingTier(request, 'user-id')).rejects.toThrow(/מתנגש עם שכבה קיימת/);
//     });

//     // 6. תרחיש שגיאה: Supabase insert/update נכשל
//     it('should throw an error if Supabase insert fails', async () => {
//         const now = new Date();
//         const request = {
//             workspaceType: 'Desk',
//             year1Price: 100,
//             year2Price: 90,
//             year3Price: 80,
//             year4Price: 70,
//             effectiveDate: now.toISOString().split('T')[0],
//         };

//         // Mock ל-deactivate (בהצלחה)
//         mockSupabase.from('pricing_tiers').update.mockReturnThis();
//         mockSupabase.from('pricing_tiers').eq.mockReturnThis();
//         mockSupabase.from('pricing_tiers').update.mockResolvedValueOnce({ data: null, error: null });

//         // Mock ל-checkEffectiveDateConflict (אין קונפליקט)
//         mockSupabase.from('pricing_tiers').select.mockReturnThis();
//         mockSupabase.from('pricing_tiers').eq.mockReturnThis();
//         mockSupabase.from('pricing_tiers').maybeSingle.mockResolvedValueOnce({ data: null, error: null });

//         // Mock ל-insert שיחזיר שגיאה
//         mockSupabase.from('pricing_tiers').insert.mockReturnThis();
//         mockSupabase.from('pricing_tiers').select.mockReturnThis();
//         mockSupabase.from('pricing_tiers').single.mockResolvedValueOnce({ data: null, error: { message: 'Supabase insert failed' } });

//         await expect(createOrUpdatePricingTier(request, 'user-id')).rejects.toThrow('הפעולה ליצירת/עדכון שכבת תמחור נכשלה.');
//     });

//     // 7. תרחיש שגיאה: חוסר ב-workspaceType
//     it('should throw an error if workspaceType is missing', async () => {
//       const requestWithoutWorkspaceType = {
//         // workspaceType: undefined, // Missing
//         year1Price: 100,
//         year2Price: 90,
//         year3Price: 80,
//         year4Price: 70,
//         effectiveDate: '2025-08-01',
//       } as any; // Cast to any for the test

//       await expect(createOrUpdatePricingTier(requestWithoutWorkspaceType, 'user-id')).rejects.toThrow("חובה לבחור סוג סביבת עבודה.");
//     });

//     // 8. תרחיש שגיאה: חוסר ב-effectiveDate
//     it('should throw an error if effectiveDate is missing', async () => {
//       const requestWithoutEffectiveDate = {
//         workspaceType: 'Desk',
//         year1Price: 100,
//         year2Price: 90,
//         year3Price: 80,
//         year4Price: 70,
//         // effectiveDate: undefined, // Missing
//       } as any; // Cast to any for the test

//       await expect(createOrUpdatePricingTier(requestWithoutEffectiveDate, 'user-id')).rejects.toThrow("תאריך התחולה (effectiveDate) חייב להיות מוגדר.");
//     });
// });

// // ... המשך לכתוב בדיקות עבור כל פונקציה אחרת בקובץ
// // לדוגמה: updatePricingTier, getCurrentPricingTier, deletePricingTier,
// // וכן את הפונקציות עבור MeetingRoomPricing ו-LoungePricing