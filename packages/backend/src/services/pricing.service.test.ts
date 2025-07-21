// // src/__tests__/pricing.service.test.ts
// import {
//   validatePrices,
//   checkEffectiveDateConflict,
//   createPricingTier,
//   createPricingTierWithHistory,
//   updatePricingTier,
//   createOrUpdatePricingTier,
//   getCurrentPricingTier,
//   getPricingHistory,
//   deletePricingTier,
//   createMeetingRoomPricing,
//   updateMeetingRoomPricing,
//   getCurrentMeetingRoomPricing,
//   deleteMeetingRoomPricing,
//   createLoungePricing,
//   updateLoungePricing,
//   getCurrentLoungePricing,
//   deleteLoungePricing
//   // ... ייבא את כל הפונקציות שאתה רוצה לבדוק
// } from '../services/pricing.service';
// import { supabase, setMockMaybeSingleResult, setMockSingleResult, resetMocks, mockSupabase } from '../db/__mocks__/supabaseClient';
// import { PricingTierModel, MeetingRoomPricingModel, LoungePricingModel } from '../models/pricing.model'; //
// import { Request, Response } from "express";
// import { SupabaseClient } from '@supabase/supabase-js';
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

// // src/__tests__/pricing.service.test.ts
// // ... (הקוד הקיים מהדוגמאות הקודמות - imports, beforeEach, ו-describe בלוקים שכבר כתבתם) ...


// beforeEach(() => {
//   resetMocks();
//   jest.clearAllMocks(); // ודא שכל ה-mocks מאופסים
// });

// // ... (ה-describe בלוקים הקיימים: 'validatePrices', 'checkEffectiveDateConflict', 'createPricingTier', 'createPricingTierWithHistory', 'createOrUpdatePricingTier') ...

// describe('updatePricingTier', () => {
//   const existingId = 'existing-pricing-tier-id';
//   const existingPricingTier = {
//     id: existingId,
//     workspace_type: 'Desk',
//     year1_price: 100,
//     year2_price: 90,
//     year3_price: 80,
//     year4_price: 70,
//     effective_date: '2025-01-01',
//     active: true,
//     created_at: '2024-01-01T00:00:00.000Z',
//     updated_at: '2024-01-01T00:00:00.000Z',
//   };

//   it('should update an existing pricing tier successfully', async () => {
//     // Mock אחזור הרשומה הקיימת
//     mockSupabase.from('pricing_tiers').select.mockReturnThis();
//     mockSupabase.from('pricing_tiers').eq.mockReturnThis();
//     mockSupabase.from('pricing_tiers').single.mockResolvedValueOnce({ data: existingPricingTier, error: null });

//     // Mock שאין קונפליקט תאריכים (עם החרגת ה-ID של הרשומה המעודכנת)
//     mockSupabase.from('pricing_tiers').select.mockReturnThis();
//     mockSupabase.from('pricing_tiers').eq.mockReturnThis();
//     mockSupabase.from('pricing_tiers').neq.mockReturnThis();
//     mockSupabase.from('pricing_tiers').maybeSingle.mockResolvedValueOnce({ data: null, error: null });

//     // Mock פעולת העדכון
//     const updatedData = { ...existingPricingTier, year1_price: 120, updated_at: new Date().toISOString() };
//     mockSupabase.from('pricing_tiers').update.mockReturnThis();
//     mockSupabase.from('pricing_tiers').eq.mockReturnThis();
//     mockSupabase.from('pricing_tiers').select.mockReturnThis();
//     mockSupabase.from('pricing_tiers').single.mockResolvedValueOnce({ data: updatedData, error: null });

//     const request = {
//       id: existingId,
//       year1Price: 120,
//       effectiveDate: '2025-01-01', // אותו תאריך או תאריך עתידי
//     };

//     const result = await updatePricingTier(request);

//     expect(mockSupabase.from('pricing_tiers').update).toHaveBeenCalledTimes(1);
//     expect(mockSupabase.from('pricing_tiers').update).toHaveBeenCalledWith(
//       expect.objectContaining({ year1_price: 120 })
//     );
//     expect(result.id).toBe(existingId);
//     expect(result.year1Price).toBe(120);
//   });

//   it('should throw an error if the pricing tier does not exist', async () => {
//     // Mock אחזור הרשומה הקיימת - לא נמצאה
//     mockSupabase.from('pricing_tiers').select.mockReturnThis();
//     mockSupabase.from('pricing_tiers').eq.mockReturnThis();
//     mockSupabase.from('pricing_tiers').single.mockResolvedValueOnce({ data: null, error: { code: 'PGRST116', message: 'No rows found' } });

//     const request = {
//       id: 'non-existent-id',
//       year1Price: 120,
//       effectiveDate: '2025-01-01',
//     };

//     await expect(updatePricingTier(request)).rejects.toThrow('שכבת התמחור לעדכון לא נמצאה.');
//   });

//   it('should throw an error for negative prices in update request', async () => {
//     const request = {
//       id: existingId,
//       year1Price: -50, // מחיר שלילי
//       effectiveDate: '2025-01-01',
//     };
//     await expect(updatePricingTier(request)).rejects.toThrow('לא ניתן להזין מחירים שליליים');
//   });

//   it('should throw an error if effectiveDate is in the past', async () => {
//     // Mock אחזור הרשומה הקיימת
//     mockSupabase.from('pricing_tiers').select.mockReturnThis();
//     mockSupabase.from('pricing_tiers').eq.mockReturnThis();
//     mockSupabase.from('pricing_tiers').single.mockResolvedValueOnce({ data: existingPricingTier, error: null });

//     const request = {
//       id: existingId,
//       year1Price: 120,
//       effectiveDate: '2024-01-01', // תאריך בעבר
//     };

//     await expect(updatePricingTier(request)).rejects.toThrow('תאריך התחולה חייב להיות היום או בעתיד.');
//   });

//   it('should throw an error if effectiveDate conflicts with another tier (excluding self)', async () => {
//     // Mock אחזור הרשומה הקיימת
//     mockSupabase.from('pricing_tiers').select.mockReturnThis();
//     mockSupabase.from('pricing_tiers').eq.mockReturnThis();
//     mockSupabase.from('pricing_tiers').single.mockResolvedValueOnce({ data: existingPricingTier, error: null });

//     // Mock שקיים קונפליקט תאריכים
//     mockSupabase.from('pricing_tiers').select.mockReturnThis();
//     mockSupabase.from('pricing_tiers').eq.mockReturnThis();
//     mockSupabase.from('pricing_tiers').neq.mockReturnThis();
//     mockSupabase.from('pricing_tiers').maybeSingle.mockResolvedValueOnce({ data: { id: 'other-tier' }, error: null });

//     const request = {
//       id: existingId,
//       year1Price: 120,
//       effectiveDate: '2025-01-01',
//     };

//     await expect(updatePricingTier(request)).rejects.toThrow(/מתנגש עם שכבה קיימת/);
//   });

//   it('should throw an error if Supabase update fails', async () => {
//     // Mock אחזור הרשומה הקיימת
//     mockSupabase.from('pricing_tiers').select.mockReturnThis();
//     mockSupabase.from('pricing_tiers').eq.mockReturnThis();
//     mockSupabase.from('pricing_tiers').single.mockResolvedValueOnce({ data: existingPricingTier, error: null });

//     // Mock שאין קונפליקט תאריכים
//     mockSupabase.from('pricing_tiers').select.mockReturnThis();
//     mockSupabase.from('pricing_tiers').eq.mockReturnThis();
//     mockSupabase.from('pricing_tiers').neq.mockReturnThis();
//     mockSupabase.from('pricing_tiers').maybeSingle.mockResolvedValueOnce({ data: null, error: null });

//     // Mock פעולת העדכון לזרוק שגיאה
//     mockSupabase.from('pricing_tiers').update.mockReturnThis();
//     mockSupabase.from('pricing_tiers').eq.mockReturnThis();
//     mockSupabase.from('pricing_tiers').select.mockReturnThis();
//     mockSupabase.from('pricing_tiers').single.mockResolvedValueOnce({ data: null, error: { message: 'DB error' } });

//     const request = {
//       id: existingId,
//       year1Price: 120,
//       effectiveDate: '2025-01-01',
//     };

//     await expect(updatePricingTier(request)).rejects.toThrow('הפעולה לעדכון שכבת תמחור נכשלה.');
//   });
// });

// describe('getCurrentPricingTier', () => {
//   it('should return the current active pricing tier for a workspace type', async () => {
//     const today = new Date().toISOString().split('T')[0];
//     const mockPricingData = {
//       id: 'current-active-id',
//       workspace_type: 'Desk',
//       effective_date: today,
//       active: true,
//       year1_price: 150,
//       year2_price: 140,
//       year3_price: 130,
//       year4_price: 120,
//     };

//     // Mock אחזור הנתונים
//     mockSupabase.from('pricing_tiers').select.mockReturnThis();
//     mockSupabase.from('pricing_tiers').eq.mockReturnThis();
//     mockSupabase.from('pricing_tiers').lte.mockReturnThis();
//     mockSupabase.from('pricing_tiers').order.mockReturnThis();
//     mockSupabase.from('pricing_tiers').limit.mockReturnThis();
//     mockSupabase.from('pricing_tiers').single.mockResolvedValueOnce({ data: mockPricingData, error: null });

//     const result = await getCurrentPricingTier('Desk');

//     expect(mockSupabase.from('pricing_tiers').eq).toHaveBeenCalledWith('workspace_type', 'Desk');
//     expect(mockSupabase.from('pricing_tiers').eq).toHaveBeenCalledWith('active', true);
//     expect(mockSupabase.from('pricing_tiers').lte).toHaveBeenCalledWith('effective_date', today);
//     expect(mockSupabase.from('pricing_tiers').order).toHaveBeenCalledWith('effective_date', { ascending: false });
//     expect(mockSupabase.from('pricing_tiers').limit).toHaveBeenCalledWith(1);

//     expect(result).toBeInstanceOf(PricingTierModel);
//     expect(result.id).toBe('current-active-id');
//     expect(result.year1Price).toBe(150);
//   });

//   it('should return null if no current active pricing tier is found', async () => {
//     // Mock שלא נמצאו רשומות
//     mockSupabase.from('pricing_tiers').select.mockReturnThis();
//     mockSupabase.from('pricing_tiers').eq.mockReturnThis();
//     mockSupabase.from('pricing_tiers').lte.mockReturnThis();
//     mockSupabase.from('pricing_tiers').order.mockReturnThis();
//     mockSupabase.from('pricing_tiers').limit.mockReturnThis();
//     mockSupabase.from('pricing_tiers').single.mockResolvedValueOnce({ data: null, error: { code: 'PGRST116', message: 'No rows found' } });

//     const result = await getCurrentPricingTier('Office');
//     expect(result).toBeNull();
//   });

//   it('should throw an error if Supabase query fails (not PGRST116)', async () => {
//     // Mock שגיאה ממסד הנתונים
//     mockSupabase.from('pricing_tiers').select.mockReturnThis();
//     mockSupabase.from('pricing_tiers').eq.mockReturnThis();
//     mockSupabase.from('pricing_tiers').lte.mockReturnThis();
//     mockSupabase.from('pricing_tiers').order.mockReturnThis();
//     mockSupabase.from('pricing_tiers').limit.mockReturnThis();
//     mockSupabase.from('pricing_tiers').single.mockResolvedValueOnce({ data: null, error: { message: 'Database query error' } });

//     await expect(getCurrentPricingTier('Desk')).rejects.toThrow('נכשל באחזור שכבת התמחור הנוכחית');
//   });
// });

// describe('getPricingHistory', () => {
//   it('should return pricing history sorted by effectiveDate descending', async () => {
//     const mockHistoryData = [
//       { id: 'id1', workspace_type: 'Desk', effective_date: '2025-01-01', year1_price: 100, active: true },
//       { id: 'id2', workspace_type: 'Desk', effective_date: '2024-06-01', year1_price: 90, active: false },
//       { id: 'id3', workspace_type: 'Desk', effective_date: '2023-12-01', year1_price: 80, active: false },
//     ];

//     // Mock אחזור הנתונים
//     mockSupabase.from('pricing_tiers').select.mockReturnThis();
//     mockSupabase.from('pricing_tiers').eq.mockReturnThis();
//     mockSupabase.from('pricing_tiers').order.mockReturnThis();
//     mockSupabase.from('pricing_tiers').get.mockResolvedValueOnce({ data: mockHistoryData, error: null }); // שימו לב לשינוי ל-.get() אם זו הפונקציה שנקראת

//     const result = await getPricingHistory('Desk');

//     expect(mockSupabase.from('pricing_tiers').eq).toHaveBeenCalledWith('workspace_type', 'Desk');
//     expect(mockSupabase.from('pricing_tiers').order).toHaveBeenCalledWith('effective_date', { ascending: false });
//     expect(result.length).toBe(3);
//     expect(result[0]).toBeInstanceOf(PricingTierModel);
//     expect(result[0].id).toBe('id1');
//     expect(result[1].id).toBe('id2');
//   });

//   it('should return an empty array if no history is found', async () => {
//     mockSupabase.from('pricing_tiers').select.mockReturnThis();
//     mockSupabase.from('pricing_tiers').eq.mockReturnThis();
//     mockSupabase.from('pricing_tiers').order.mockReturnThis();
//     mockSupabase.from('pricing_tiers').get.mockResolvedValueOnce({ data: [], error: null });

//     const result = await getPricingHistory('NonExistentType');
//     expect(result).toEqual([]);
//   });
// });

// describe('deletePricingTier', () => {
//   it('should delete a pricing tier successfully', async () => {
//     const tierId = 'tier-to-delete';

//     // Mock פעולת המחיקה
//     mockSupabase.from('pricing_tiers').delete.mockReturnThis();
//     mockSupabase.from('pricing_tiers').eq.mockReturnThis();
//     mockSupabase.from('pricing_tiers').single.mockResolvedValueOnce({ data: { id: tierId }, error: null });

//     await expect(deletePricingTier(tierId)).resolves.toBeUndefined(); // הפונקציה לא מחזירה ערך

//     expect(mockSupabase.from('pricing_tiers').delete).toHaveBeenCalledTimes(1);
//     expect(mockSupabase.from('pricing_tiers').eq).toHaveBeenCalledWith('id', tierId);
//   });

//   it('should throw an error if the pricing tier to delete is not found', async () => {
//     const tierId = 'non-existent-id';

//     // Mock שהמחיקה לא מצאה רשומה
//     mockSupabase.from('pricing_tiers').delete.mockReturnThis();
//     mockSupabase.from('pricing_tiers').eq.mockReturnThis();
//     mockSupabase.from('pricing_tiers').single.mockResolvedValueOnce({ data: null, error: { code: 'PGRST116', message: 'No rows found' } });

//     await expect(deletePricingTier(tierId)).rejects.toThrow('שכבת התמחור למחיקה לא נמצאה.');
//   });

//   it('should throw an error if Supabase delete operation fails', async () => {
//     const tierId = 'some-id';

//     // Mock שגיאה ממסד הנתונים
//     mockSupabase.from('pricing_tiers').delete.mockReturnThis();
//     mockSupabase.from('pricing_tiers').eq.mockReturnThis();
//     mockSupabase.from('pricing_tiers').single.mockResolvedValueOnce({ data: null, error: { message: 'DB delete error' } });

//     await expect(deletePricingTier(tierId)).rejects.toThrow('הפעולה למחיקת שכבת תמחור נכשלה.');
//   });
// });

// describe('createMeetingRoomPricing', () => {
//   it('should create a new meeting room pricing tier', async () => {
//     const now = new Date();
//     const request = {
//       name: 'Standard Room',
//       effectiveDate: now.toISOString().split('T')[0],
//       pricePerHour: 50,
//       pricePerDay: 400,
//       freeHoursKlikahCard: 2,
//     };

//     // Mock checkEffectiveDateConflict
//     mockSupabase.from('meeting_room_pricing').select.mockReturnThis();
//     mockSupabase.from('meeting_room_pricing').eq.mockReturnThis();
//     mockSupabase.from('meeting_room_pricing').maybeSingle.mockResolvedValueOnce({ data: null, error: null });

//     // Mock insert
//     const mockInsertData = {
//       id: 'new-meeting-room-id',
//       name: request.name,
//       effective_date: request.effectiveDate,
//       price_per_hour: request.pricePerHour,
//       price_per_day: request.pricePerDay,
//       free_hours_klikah_card: request.freeHoursKlikahCard,
//       active: true,
//       created_at: now.toISOString(),
//       updated_at: now.toISOString(),
//     };
//     mockSupabase.from('meeting_room_pricing').insert.mockReturnThis();
//     mockSupabase.from('meeting_room_pricing').select.mockReturnThis();
//     mockSupabase.from('meeting_room_pricing').single.mockResolvedValueOnce({ data: mockInsertData, error: null });

//     const result = await createMeetingRoomPricing(request);

//     expect(result).toBeInstanceOf(MeetingRoomPricingModel);
//     expect(result.id).toBe('new-meeting-room-id');
//     expect(result.name).toBe('Standard Room');
//     expect(result.active).toBe(true);
//     expect(mockSupabase.from('meeting_room_pricing').insert).toHaveBeenCalledTimes(1);
//     expect(mockSupabase.from('meeting_room_pricing').insert).toHaveBeenCalledWith(
//       expect.objectContaining({ name: 'Standard Room', active: true })
//     );
//   });

//   it('should throw an error for negative prices or free hours', async () => {
//     const request = {
//       name: 'Standard Room',
//       effectiveDate: '2025-08-01',
//       pricePerHour: -50, // מחיר שלילי
//       pricePerDay: 400,
//       freeHoursKlikahCard: 2,
//     };
//     await expect(createMeetingRoomPricing(request)).rejects.toThrow('לא ניתן להזין מחירים שליליים');

//     const request2 = {
//       name: 'Standard Room',
//       effectiveDate: '2025-08-01',
//       pricePerHour: 50,
//       pricePerDay: 400,
//       freeHoursKlikahCard: -1, // שעות חינם שליליות
//     };
//     await expect(createMeetingRoomPricing(request2)).rejects.toThrow('לא ניתן להזין מחירים שליליים');
//   });

//   it('should throw an error if effectiveDate is in the past', async () => {
//     const request = {
//       name: 'Standard Room',
//       effectiveDate: '2024-01-01', // תאריך בעבר
//       pricePerHour: 50,
//       pricePerDay: 400,
//       freeHoursKlikahCard: 2,
//     };
//     await expect(createMeetingRoomPricing(request)).rejects.toThrow('תאריך התחולה חייב להיות היום או בעתיד.');
//   });
// });

// describe('updateMeetingRoomPricing', () => {
//   const existingId = 'existing-mr-pricing-id';
//   const existingMrPricing = {
//     id: existingId,
//     name: 'Existing Room',
//     effective_date: '2025-01-01',
//     price_per_hour: 50,
//     price_per_day: 400,
//     free_hours_klikah_card: 2,
//     active: true,
//     created_at: '2024-01-01T00:00:00.000Z',
//     updated_at: '2024-01-01T00:00:00.000Z',
//   };

//   it('should update an existing meeting room pricing tier', async () => {
//     // Mock אחזור הרשומה הקיימת
//     mockSupabase.from('meeting_room_pricing').select.mockReturnThis();
//     mockSupabase.from('meeting_room_pricing').eq.mockReturnThis();
//     mockSupabase.from('meeting_room_pricing').single.mockResolvedValueOnce({ data: existingMrPricing, error: null });

//     // Mock checkEffectiveDateConflict (no conflict)
//     mockSupabase.from('meeting_room_pricing').select.mockReturnThis();
//     mockSupabase.from('meeting_room_pricing').eq.mockReturnThis();
//     mockSupabase.from('meeting_room_pricing').neq.mockReturnThis();
//     mockSupabase.from('meeting_room_pricing').maybeSingle.mockResolvedValueOnce({ data: null, error: null });

//     // Mock update operation
//     const updatedData = { ...existingMrPricing, price_per_hour: 60 };
//     mockSupabase.from('meeting_room_pricing').update.mockReturnThis();
//     mockSupabase.from('meeting_room_pricing').eq.mockReturnThis();
//     mockSupabase.from('meeting_room_pricing').select.mockReturnThis();
//     mockSupabase.from('meeting_room_pricing').single.mockResolvedValueOnce({ data: updatedData, error: null });

//     const request = {
//       id: existingId,
//       pricePerHour: 60,
//       effectiveDate: '2025-01-01',
//     };

//     const result = await updateMeetingRoomPricing(request);
//     expect(result.id).toBe(existingId);
//     expect(result.pricePerHour).toBe(60);
//   });

//   it('should throw an error for negative prices/free hours in update', async () => {
//     // Mock אחזור הרשומה הקיימת
//     mockSupabase.from('meeting_room_pricing').select.mockReturnThis();
//     mockSupabase.from('meeting_room_pricing').eq.mockReturnThis();
//     mockSupabase.from('meeting_room_pricing').single.mockResolvedValueOnce({ data: existingMrPricing, error: null });

//     const request = {
//       id: existingId,
//       pricePerHour: -10,
//       effectiveDate: '2025-01-01',
//     };
//     await expect(updateMeetingRoomPricing(request)).rejects.toThrow('לא ניתן להזין מחירים שליליים');
//   });

//   it('should throw an error if effectiveDate is in the past for update', async () => {
//     // Mock אחזור הרשומה הקיימת
//     mockSupabase.from('meeting_room_pricing').select.mockReturnThis();
//     mockSupabase.from('meeting_room_pricing').eq.mockReturnThis();
//     mockSupabase.from('meeting_room_pricing').single.mockResolvedValueOnce({ data: existingMrPricing, error: null });

//     const request = {
//       id: existingId,
//       pricePerHour: 50,
//       effectiveDate: '2024-01-01', // תאריך בעבר
//     };
//     await expect(updateMeetingRoomPricing(request)).rejects.toThrow('תאריך התחולה חייב להיות היום או בעתיד.');
//   });
// });

// describe('getCurrentMeetingRoomPricing', () => {
//   it('should return the current active meeting room pricing', async () => {
//     const today = new Date().toISOString().split('T')[0];
//     const mockData = {
//       id: 'current-mr-id',
//       name: 'Standard Room',
//       effective_date: today,
//       price_per_hour: 50,
//       active: true,
//     };
//     mockSupabase.from('meeting_room_pricing').select.mockReturnThis();
//     mockSupabase.from('meeting_room_pricing').eq.mockReturnThis();
//     mockSupabase.from('meeting_room_pricing').lte.mockReturnThis();
//     mockSupabase.from('meeting_room_pricing').order.mockReturnThis();
//     mockSupabase.from('meeting_room_pricing').limit.mockReturnThis();
//     mockSupabase.from('meeting_room_pricing').single.mockResolvedValueOnce({ data: mockData, error: null });

//     const result = await getCurrentMeetingRoomPricing();
//     expect(result).toBeInstanceOf(MeetingRoomPricingModel);
//     expect(result.id).toBe('current-mr-id');
//   });

//   it('should return null if no current active meeting room pricing is found', async () => {
//     mockSupabase.from('meeting_room_pricing').select.mockReturnThis();
//     mockSupabase.from('meeting_room_pricing').eq.mockReturnThis();
//     mockSupabase.from('meeting_room_pricing').lte.mockReturnThis();
//     mockSupabase.from('meeting_room_pricing').order.mockReturnThis();
//     mockSupabase.from('meeting_room_pricing').limit.mockReturnThis();
//     mockSupabase.from('meeting_room_pricing').single.mockResolvedValueOnce({ data: null, error: { code: 'PGRST116', message: 'No rows found' } });

//     const result = await getCurrentMeetingRoomPricing();
//     expect(result).toBeNull();
//   });
// });

// describe('deleteMeetingRoomPricing', () => {
//   it('should delete a meeting room pricing tier successfully', async () => {
//     const mrId = 'mr-to-delete';
//     mockSupabase.from('meeting_room_pricing').delete.mockReturnThis();
//     mockSupabase.from('meeting_room_pricing').eq.mockReturnThis();
//     mockSupabase.from('meeting_room_pricing').single.mockResolvedValueOnce({ data: { id: mrId }, error: null });

//     await expect(deleteMeetingRoomPricing(mrId)).resolves.toBeUndefined();
//     expect(mockSupabase.from('meeting_room_pricing').delete).toHaveBeenCalledWith(); // Called with no args after eq
//     expect(mockSupabase.from('meeting_room_pricing').eq).toHaveBeenCalledWith('id', mrId);
//   });

//   it('should throw an error if meeting room pricing to delete is not found', async () => {
//     const mrId = 'non-existent-mr-id';
//     mockSupabase.from('meeting_room_pricing').delete.mockReturnThis();
//     mockSupabase.from('meeting_room_pricing').eq.mockReturnThis();
//     mockSupabase.from('meeting_room_pricing').single.mockResolvedValueOnce({ data: null, error: { code: 'PGRST116', message: 'No rows found' } });

//     await expect(deleteMeetingRoomPricing(mrId)).rejects.toThrow('תמחור חדר ישיבות למחיקה לא נמצא.');
//   });
// });

// describe('createLoungePricing', () => {
//   it('should create a new lounge pricing tier', async () => {
//     const now = new Date();
//     const request = {
//       name: 'Standard Lounge',
//       effectiveDate: now.toISOString().split('T')[0],
//       dayPassPrice: 100,
//       monthlyPrice: 500,
//       eveningRate: 70,
//       memberDiscountRate: 10, // Member discount less than evening rate
//     };

//     // Mock checkEffectiveDateConflict
//     mockSupabase.from('lounge_pricing').select.mockReturnThis();
//     mockSupabase.from('lounge_pricing').eq.mockReturnThis();
//     mockSupabase.from('lounge_pricing').maybeSingle.mockResolvedValueOnce({ data: null, error: null });

//     // Mock insert
//     const mockInsertData = {
//       id: 'new-lounge-id',
//       name: request.name,
//       effective_date: request.effectiveDate,
//       day_pass_price: request.dayPassPrice,
//       monthly_price: request.monthlyPrice,
//       evening_rate: request.eveningRate,
//       member_discount_rate: request.memberDiscountRate,
//       active: true,
//       created_at: now.toISOString(),
//       updated_at: now.toISOString(),
//     };
//     mockSupabase.from('lounge_pricing').insert.mockReturnThis();
//     mockSupabase.from('lounge_pricing').select.mockReturnThis();
//     mockSupabase.from('lounge_pricing').single.mockResolvedValueOnce({ data: mockInsertData, error: null });

//     const result = await createLoungePricing(request);

//     expect(result).toBeInstanceOf(LoungePricingModel);
//     expect(result.id).toBe('new-lounge-id');
//     expect(result.memberDiscountRate).toBe(10);
//   });

//   it('should throw an error if memberDiscountRate is greater than eveningRate', async () => {
//     const request = {
//       name: 'Standard Lounge',
//       effectiveDate: '2025-08-01',
//       dayPassPrice: 100,
//       monthlyPrice: 500,
//       eveningRate: 70,
//       memberDiscountRate: 80, // Greater than eveningRate
//     };
//     await expect(createLoungePricing(request)).rejects.toThrow('שיעור ההנחה לחבר (memberDiscountRate) אינו יכול להיות גבוה מתעריף הערב (eveningRate).');
//   });

//   it('should throw an error for negative prices in lounge pricing', async () => {
//     const request = {
//       name: 'Standard Lounge',
//       effectiveDate: '2025-08-01',
//       dayPassPrice: -10, // שלילי
//       monthlyPrice: 500,
//       eveningRate: 70,
//       memberDiscountRate: 10,
//     };
//     await expect(createLoungePricing(request)).rejects.toThrow('לא ניתן להזין מחירים שליליים');
//   });
// });

// describe('updateLoungePricing', () => {
//   const existingId = 'existing-lounge-pricing-id';
//   const existingLoungePricing = {
//     id: existingId,
//     name: 'Existing Lounge',
//     effective_date: '2025-01-01',
//     day_pass_price: 100,
//     monthly_price: 500,
//     evening_rate: 70,
//     member_discount_rate: 10,
//     active: true,
//     created_at: '2024-01-01T00:00:00.000Z',
//     updated_at: '2024-01-01T00:00:00.000Z',
//   };

//   it('should update an existing lounge pricing tier', async () => {
//     // Mock אחזור הרשומה הקיימת
//     mockSupabase.from('lounge_pricing').select.mockReturnThis();
//     mockSupabase.from('lounge_pricing').eq.mockReturnThis();
//     mockSupabase.from('lounge_pricing').single.mockResolvedValueOnce({ data: existingLoungePricing, error: null });

//     // Mock checkEffectiveDateConflict (no conflict)
//     mockSupabase.from('lounge_pricing').select.mockReturnThis();
//     mockSupabase.from('lounge_pricing').eq.mockReturnThis();
//     mockSupabase.from('lounge_pricing').neq.mockReturnThis();
//     mockSupabase.from('lounge_pricing').maybeSingle.mockResolvedValueOnce({ data: null, error: null });

//     // Mock update operation
//     const updatedData = { ...existingLoungePricing, day_pass_price: 120 };
//     mockSupabase.from('lounge_pricing').update.mockReturnThis();
//     mockSupabase.from('lounge_pricing').eq.mockReturnThis();
//     mockSupabase.from('lounge_pricing').select.mockReturnThis();
//     mockSupabase.from('lounge_pricing').single.mockResolvedValueOnce({ data: updatedData, error: null });

//     const request = {
//       id: existingId,
//       dayPassPrice: 120,
//       effectiveDate: '2025-01-01',
//     };

//     const result = await updateLoungePricing(request);
//     expect(result.id).toBe(existingId);
//     expect(result.dayPassPrice).toBe(120);
//   });

//   it('should throw an error if memberDiscountRate becomes greater than eveningRate after update', async () => {
//     // Mock אחזור הרשומה הקיימת
//     mockSupabase.from('lounge_pricing').select.mockReturnThis();
//     mockSupabase.from('lounge_pricing').eq.mockReturnThis();
//     mockSupabase.from('lounge_pricing').single.mockResolvedValueOnce({ data: existingLoungePricing, error: null });

//     const request = {
//       id: existingId,
//       memberDiscountRate: 80, // יגרום לשגיאה אם eveningRate נשאר 70
//       eveningRate: 70, // לוודא שנשלח גם eveningRate
//       effectiveDate: '2025-01-01',
//     };
//     await expect(updateLoungePricing(request)).rejects.toThrow('שיעור ההנחה לחבר (memberDiscountRate) אינו יכול להיות גבוה מתעריף הערב (eveningRate).');
//   });

//   it('should throw an error for negative prices in update request', async () => {
//     // Mock אחזור הרשומה הקיימת
//     mockSupabase.from('lounge_pricing').select.mockReturnThis();
//     mockSupabase.from('lounge_pricing').eq.mockReturnThis();
//     mockSupabase.from('lounge_pricing').single.mockResolvedValueOnce({ data: existingLoungePricing, error: null });

//     const request = {
//       id: existingId,
//       dayPassPrice: -10,
//       effectiveDate: '2025-01-01',
//     };
//     await expect(updateLoungePricing(request)).rejects.toThrow('לא ניתן להזין מחירים שליליים');
//   });
// });

// describe('getCurrentLoungePricing', () => {
//   it('should return the current active lounge pricing', async () => {
//     const today = new Date().toISOString().split('T')[0];
//     const mockData = {
//       id: 'current-lounge-id',
//       name: 'Standard Lounge',
//       effective_date: today,
//       day_pass_price: 100,
//       active: true,
//     };
//     mockSupabase.from('lounge_pricing').select.mockReturnThis();
//     mockSupabase.from('lounge_pricing').eq.mockReturnThis();
//     mockSupabase.from('lounge_pricing').lte.mockReturnThis();
//     mockSupabase.from('lounge_pricing').order.mockReturnThis();
//     mockSupabase.from('lounge_pricing').limit.mockReturnThis();
//     mockSupabase.from('lounge_pricing').single.mockResolvedValueOnce({ data: mockData, error: null });

//     const result = await getCurrentLoungePricing();
//     expect(result).toBeInstanceOf(LoungePricingModel);
//     expect(result.id).toBe('current-lounge-id');
//   });

//   it('should return null if no current active lounge pricing is found', async () => {
//     mockSupabase.from('lounge_pricing').select.mockReturnThis();
//     mockSupabase.from('lounge_pricing').eq.mockReturnThis();
//     mockSupabase.from('lounge_pricing').lte.mockReturnThis();
//     mockSupabase.from('lounge_pricing').order.mockReturnThis();
//     mockSupabase.from('lounge_pricing').limit.mockReturnThis();
//     mockSupabase.from('lounge_pricing').single.mockResolvedValueOnce({ data: null, error: { code: 'PGRST116', message: 'No rows found' } });

//     const result = await getCurrentLoungePricing();
//     expect(result).toBeNull();
//   });
// });

// describe('deleteLoungePricing', () => {
//   it('should delete a lounge pricing tier successfully', async () => {
//     const loungeId = 'lounge-to-delete';
//     mockSupabase.from('lounge_pricing').delete.mockReturnThis();
//     mockSupabase.from('lounge_pricing').eq.mockReturnThis();
//     mockSupabase.from('lounge_pricing').single.mockResolvedValueOnce({ data: { id: loungeId }, error: null });

//     await expect(deleteLoungePricing(loungeId)).resolves.toBeUndefined();
//     expect(mockSupabase.from('lounge_pricing').eq).toHaveBeenCalledWith('id', loungeId);
//   });

//   it('should throw an error if lounge pricing to delete is not found', async () => {
//     const loungeId = 'non-existent-lounge-id';
//     mockSupabase.from('lounge_pricing').delete.mockReturnThis();
//     mockSupabase.from('lounge_pricing').eq.mockReturnThis();
//     mockSupabase.from('lounge_pricing').single.mockResolvedValueOnce({ data: null, error: { code: 'PGRST116', message: 'No rows found' } });

//     await expect(deleteLoungePricing(loungeId)).rejects.toThrow('תמחור לאונג\' למחיקה לא נמצא.');
//   });
// });