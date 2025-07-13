import {
  
  PricingTier,
  UpdatePricingTierRequest,
  MeetingRoomPricing,
  UpdateMeetingRoomPricingRequest,
  LoungePricing,
  UpdateLoungePricingRequest,
} from "shared-types";
import { WorkspaceType } from "shared-types";
import type { ID, PricingTierCreateRequest } from "shared-types";

import { supabase } from '../db/supabaseClient'; 
import {
    PricingTierModel,
    MeetingRoomPricingModel,
    LoungePricingModel
} from '../models/pricing.model';


// בדיקה שמחירים אינם שליליים - פונקציה זו נשארת ללא שינוי
function validatePrices(prices: number[]) {
  for (const price of prices) {
    if (price < 0) throw new Error("לא ניתן להזין מחירים שליליים");
  }
}
// בדיקה של חפיפות תאריכי התחולה בין שכבות פעילות באותה קטגוריה - מעודכנת לעבודה מול Supabase
async function checkEffectiveDateConflict(
  supabaseClient: typeof supabase, // קבלת לקוח Supabase כפרמטר
  tableName: string, // קבלת שם הטבלה כפרמטר
  newEffectiveDate: string,
  filterConditions: Record<string, any> = {}, // תנאים נוספים כמו workspace_type
  idToExclude?: ID // אופציונלי - עבור עדכון פריט קיים
) {
  const newDate = new Date(newEffectiveDate);

  let query = supabaseClient
    .from(tableName)
    .select('id, effective_date') // שליפת השדות הנחוצים בלבד
    .eq('active', true);

  // הוספת תנאי סינון נוספים (לדוגמה, workspace_type)
  for (const key in filterConditions) {
    query = query.eq(key, filterConditions[key]);
  }

  if (idToExclude) {
    query = query.neq('id', idToExclude); // אם יש ID להוציא מהבדיקה (בעדכון)
  }

  const { data: activeItems, error } = await query; // ביצוע שאילתה ל-DB

  if (error) {
    console.error(`Error checking effective date conflict in ${tableName}:`, error);
    throw new Error('Failed to check for effective date conflicts');
  }

  if (activeItems) {
    for (const item of activeItems) {
      // שימו לב: item.effective_date יגיע ב-snake_case מה-DB
      const existingDate = new Date(item.effective_date);
      if (existingDate.getTime() === newDate.getTime()) {
        throw new Error(
          `תאריך התחולה ${newEffectiveDate} מתנגש עם שכבה קיימת (id: ${item.id})`
        );
      }
    }
  }
}
// ========================
// סביבת עבודה - מעודכן לעבודה מול Supabase
// ========================

export async function createPricingTier(
  request: PricingTierCreateRequest,
  createdBy: ID // createdBy יכול לשמש לשדה created_by ב-DB
): Promise<PricingTier> {
  try {
    if (!request.workspaceType) throw new Error("חובה לבחור סוג סביבת עבודה");

    validatePrices([
      request.year1Price,
      request.year2Price,
      request.year3Price,
      request.year4Price,
    ]);

    const effectiveDate = new Date(request.effectiveDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (effectiveDate < today) {
      throw new Error("תאריך התחולה חייב להיות היום או בעתיד");
    }

    // בדיקת התנגשות תאריכים מול מסד הנתונים
    await checkEffectiveDateConflict(supabase, 'pricing_tiers', request.effectiveDate, { workspace_type: request.workspaceType });

    // יצירת מופע של המודל מהנתונים שהתקבלו בבקשה
    const newPricingTierModel = new PricingTierModel({
      workspaceType: request.workspaceType,
      year1Price: request.year1Price,
      year2Price: request.year2Price,
      year3Price: request.year3Price,
      year4Price: request.year4Price,
      effectiveDate: request.effectiveDate,
      active: true, // מוגדר כ-true עבור שכבה חדשה
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      // createdBy: createdBy, // הוסף אם קיים שדה created_by בטבלה
    });

    // שליחת הנתונים ל-Supabase
    const { data, error } = await supabase
      .from('pricing_tiers') // שם הטבלה במסד הנתונים
      .insert(newPricingTierModel.toDatabaseFormat()) // שימוש ב-toDatabaseFormat()
      .select() // חשוב: מבקש לקבל בחזרה את הרשומה שנוצרה
      .single(); // חשוב: מצפה לרשומה יחידה

    if (error) {
      console.error('Error creating pricing tier:', error);
      throw new Error('Failed to create pricing tier');
    }

    // מיפוי נתונים חזרה למודל CamelCase כדי להתאים ל-PricingTier
    return new PricingTierModel({
      id: data.id,
      workspaceType: data.workspace_type,
      year1Price: data.year1_price,
      year2Price: data.year2_price,
      year3Price: data.year3_price,
      year4Price: data.year4_price,
      effectiveDate: data.effective_date,
      active: data.active,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    });
  } catch (e) {
    console.error('Exception in createPricingTier:', e);
    throw e;
  }
}

export async function createPricingTierWithHistory(
  request: PricingTierCreateRequest,
  createdBy: ID
): Promise<PricingTier> {
  try {
    // השבתת שכבות פעילות קודמות עבור סוג סביבת העבודה הזה ב-DB
    const { error: updateError } = await supabase
      .from('pricing_tiers')
      .update({
        active: false,
        updated_at: new Date().toISOString(),
        // updated_by: createdBy, // הוסף אם קיים שדה updated_by בטבלה
      })
      .eq('workspace_type', request.workspaceType)
      .eq('active', true);

    if (updateError) {
      console.error('Error deactivating old pricing tiers:', updateError);
      throw new Error('Failed to deactivate old pricing tiers');
    }

    // יצירת שכבת תמחור חדשה
    return await createPricingTier(request, createdBy);
  } catch (e) {
    console.error('Exception in createPricingTierWithHistory:', e);
    throw e;
  }
}
export async function getPricingHistory(workspaceType: WorkspaceType): Promise<PricingTier[]> {
  try {
    console.log("📤 Sending request to Supabase with workspaceType:", workspaceType); // חשוב!

    const { data, error } = await supabase
      .from('pricing_tiers')
      .select('*')
      .eq('workspace_type', workspaceType)
      .order('effective_date', { ascending: false });

    if (error) {
      console.error('❌ Supabase returned an error:');
      console.error('🔸 Message:', error.message);
      console.error('🔹 Details:', error.details);
      console.error('💡 Hint:', error.hint);

      throw new Error(`Supabase error: ${error.message}`);
    }

    if (!data) {
      console.warn("⚠️ Supabase returned no data at all.");
      return [];
    }

    return data.map((item:any) => new PricingTierModel({
      id: item.id,
      workspaceType: item.workspace_type,
      year1Price: item.year1_price,
      year2Price: item.year2_price,
      year3Price: item.year3_price,
      year4Price: item.year4_price,
      effectiveDate: item.effective_date,
      active: item.active,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
    }));
  } catch (e) {
    console.error('🔥 Exception in getPricingHistory:', e);
    throw e;
  }
}

export async function getCurrentPricingTier(
  workspaceType: WorkspaceType
): Promise<PricingTier | null> {
  try {
    const { data, error } = await supabase
      .from('pricing_tiers')
      .select('*')
      .eq('workspace_type', workspaceType)
      .eq('active', true)
      .order('effective_date', { ascending: false }) // מחיר עדכני הוא זה עם תאריך התחולה החדש ביותר
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found (not an actual error)
      console.error('Error fetching current pricing tier:', error);
      throw new Error('Failed to fetch current pricing tier');
    }

    if (!data) return null;

    // מיפוי הנתונים מ-snake_case ל-CamelCase באמצעות המודל
    return new PricingTierModel({
      id: data.id,
      workspaceType: data.workspace_type,
      year1Price: data.year1_price,
      year2Price: data.year2_price,
      year3Price: data.year3_price,
      year4Price: data.year4_price,
      effectiveDate: data.effective_date,
      active: data.active,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    });
  } catch (e) {
    console.error('Exception in getCurrentPricingTier:', e);
    throw e;
  }
}

export async function updatePricingTier(
  id: ID,
  update: Partial<UpdatePricingTierRequest>,
  updatedBy?: ID // הוסף אם קיים שדה updated_by בטבלה
): Promise<PricingTier> {
  try {
    // שלב 1: שליפת הרשומה הקיימת כדי לקבל את כל השדות ולבצע ולידציות
    const { data: existingTier, error: fetchError } = await supabase
      .from('pricing_tiers')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !existingTier) {
      console.error('Error fetching existing pricing tier:', fetchError);
      throw new Error("שכבת תמחור לא נמצאה");
    }

    // חשוב: יש למפות את הנתונים הנכנסים מ-update (CamelCase)
    // ואת existingTier (snake_case) לאובייקט בודד שמתאים למודל
    const updatedTierModel = new PricingTierModel({
        id: existingTier.id,
        workspaceType: update.workspaceType !== undefined ? update.workspaceType : existingTier.workspace_type,
        year1Price: update.year1Price !== undefined ? update.year1Price : existingTier.year1_price,
        year2Price: update.year2Price !== undefined ? update.year2Price : existingTier.year2_price,
        year3Price: update.year3Price !== undefined ? update.year3Price : existingTier.year3_price,
        year4Price: update.year4Price !== undefined ? update.year4Price : existingTier.year4_price,
        effectiveDate: update.effectiveDate !== undefined ? update.effectiveDate : existingTier.effective_date,
        active: existingTier.active, // <-- תיקון כאן: תמיד לוקח את הערך מ-existingTier
        createdAt: existingTier.created_at, // לא משתנה
        updatedAt: new Date().toISOString(), // תאריך עדכון נוכחי
    });

    // ולידציות
    if (
      update.year1Price !== undefined ||
      update.year2Price !== undefined ||
      update.year3Price !== undefined ||
      update.year4Price !== undefined
    ) {
      validatePrices([
        update.year1Price ?? updatedTierModel.year1Price,
        update.year2Price ?? updatedTierModel.year2Price,
        update.year3Price ?? updatedTierModel.year3Price,
        update.year4Price ?? updatedTierModel.year4Price,
      ]);
    }

    if (update.effectiveDate) {
      await checkEffectiveDateConflict(supabase, 'pricing_tiers', update.effectiveDate, { workspace_type: updatedTierModel.workspaceType }, id);
    }

    // שלב 3: ביצוע העדכון במסד הנתונים
    const { data, error: updateError } = await supabase
      .from('pricing_tiers')
      .update(updatedTierModel.toDatabaseFormat()) // שימוש ב-toDatabaseFormat()
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating pricing tier:', updateError);
      throw new Error('Failed to update pricing tier');
    }

    // מיפוי נתונים חזרה למודל CamelCase
    return new PricingTierModel({
        id: data.id,
        workspaceType: data.workspace_type,
        year1Price: data.year1_price,
        year2Price: data.year2_price,
        year3Price: data.year3_price,
        year4Price: data.year4_price,
        effectiveDate: data.effective_date,
        active: data.active,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
    });

  } catch (e) {
    console.error('Exception in updatePricingTier:', e);
    throw e;
  }
}

export async function bulkUpdatePricingTiers(
  updates: Partial<UpdatePricingTierRequest>[],
  updatedBy: ID
): Promise<PricingTier[]> {
  try {
    const updatedTiersPromises: Promise<PricingTier>[] = [];

    for (const update of updates) {
      if (!update.workspaceType) {
        throw new Error("חובה לציין סוג סביבת עבודה לעדכון");
      }

      // שליפת שכבת התמחור הפעילה הרלוונטית מה-DB
      const { data: tier, error: fetchError } = await supabase
        .from('pricing_tiers')
        .select('id')
        .eq('workspace_type', update.workspaceType)
        .eq('active', true)
        .single();

      if (fetchError || !tier) {
        throw new Error(`לא נמצאה שכבת תמחור פעילה לסוג ${update.workspaceType}`);
      }

      // קריאה לפונקציית העדכון עבור כל שכבה
      updatedTiersPromises.push(updatePricingTier(tier.id, update, updatedBy));
    }

    return Promise.all(updatedTiersPromises);
  } catch (e) {
    console.error('Exception in bulkUpdatePricingTiers:', e);
    throw e;
  }
}

export async function deletePricingTier(id: ID): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('pricing_tiers')
      .update({ active: false, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      console.error('Error deleting pricing tier:', error);
      throw new Error("Failed to delete pricing tier");
    }

    console.log('Deleted pricing tier data:', data);
    return true;
  } catch (e) {
    console.error('Exception in deletePricingTier:', e);
    throw e;
  }
}

// ========================
// תמחור חדרי ישיבות - מעודכן לעבודה מול Supabase
// ========================

export async function createMeetingRoomPricingWithHistory(
  request: UpdateMeetingRoomPricingRequest
): Promise<MeetingRoomPricing> {
  try {
    // השבתת תמחורים פעילים קודמים ב-DB
    const { error: updateError } = await supabase
      .from('meeting_room_pricing')
      .update({
        active: false,
        updated_at: new Date().toISOString(),
        // updated_by: createdBy, // הוסף אם קיים שדה updated_by בטבלה
      })
      .eq('active', true);

    if (updateError) {
      console.error('Error deactivating old meeting room pricings:', updateError);
      throw new Error('Failed to deactivate old meeting room pricings');
    }

    // יצירת תמחור חדש
    return await createMeetingRoomPricing(request);
  } catch (e) {
    console.error('Exception in createMeetingRoomPricingWithHistory:', e);
    throw e;
  }
}

export async function createMeetingRoomPricing(
  request: UpdateMeetingRoomPricingRequest
): Promise<MeetingRoomPricing> {
  try {
    validatePrices([request.hourlyRate, request.discountedHourlyRate]);
    if (request.freeHoursKlikahCard < 0)
      throw new Error("freeHoursKlikahCard לא יכול להיות שלילי");

    await checkEffectiveDateConflict(supabase, 'meeting_room_pricing', request.effectiveDate);

    const newPricingModel = new MeetingRoomPricingModel({
      hourlyRate: request.hourlyRate,
      discountedHourlyRate: request.discountedHourlyRate,
      freeHoursKlikahCard: request.freeHoursKlikahCard,
      effectiveDate: request.effectiveDate,
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    const { data, error } = await supabase
      .from('meeting_room_pricing')
      .insert(newPricingModel.toDatabaseFormat())
      .select()
      .single();

    if (error) {
      console.error('Error creating meeting room pricing:', error);
      throw new Error('Failed to create meeting room pricing');
    }

    return new MeetingRoomPricingModel({
      id: data.id,
      hourlyRate: data.hourly_rate,
      discountedHourlyRate: data.discounted_hourly_rate,
      freeHoursKlikahCard: data.free_hours_klikah_card,
      effectiveDate: data.effective_date,
      active: data.active,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    });
  } catch (e) {
    console.error('Exception in createMeetingRoomPricing:', e);
    throw e;
  }
}

export async function getMeetingRoomPricingHistory(): Promise<MeetingRoomPricing[]> {
  try {
    const { data, error } = await supabase
      .from('meeting_room_pricing')
      .select('*')
      .order('effective_date', { ascending: false });

    if (error) {
      console.error('Error fetching meeting room pricing history:', error);
      throw new Error('Failed to fetch meeting room pricing history');
    }

    return data.map((item:any) => new MeetingRoomPricingModel({
      id: item.id,
      hourlyRate: item.hourly_rate,
      discountedHourlyRate: item.discounted_hourly_rate,
      freeHoursKlikahCard: item.free_hours_klikah_card,
      effectiveDate: item.effective_date,
      active: item.active,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
    }));
  } catch (e) {
    console.error('Exception in getMeetingRoomPricingHistory:', e);
    throw e;
  }
}

export async function getCurrentMeetingRoomPricing(): Promise<MeetingRoomPricing | null> {
  try {
    const { data, error } = await supabase
      .from('meeting_room_pricing')
      .select('*')
      .eq('active', true)
      .order('effective_date', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching current meeting room pricing:', error);
      throw new Error('Failed to fetch current meeting room pricing');
    }

    if (!data) return null;

    return new MeetingRoomPricingModel({
      id: data.id,
      hourlyRate: data.hourly_rate,
      discountedHourlyRate: data.discounted_hourly_rate,
      freeHoursKlikahCard: data.free_hours_klikah_card,
      effectiveDate: data.effective_date,
      active: data.active,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    });
  } catch (e) {
    console.error('Exception in getCurrentMeetingRoomPricing:', e);
    throw e;
  }
}

export async function updateMeetingRoomPricing(
  id: ID,
  update: Partial<UpdateMeetingRoomPricingRequest>,
  updatedBy?: ID
): Promise<MeetingRoomPricing> {
  try {
    const { data: existingPricing, error: fetchError } = await supabase
      .from('meeting_room_pricing')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !existingPricing) {
      console.error('Error fetching existing meeting room pricing:', fetchError);
      throw new Error("תמחור חדר ישיבות לא נמצא");
    }

    const updatedPricingModel = new MeetingRoomPricingModel({
        id: existingPricing.id,
        hourlyRate: update.hourlyRate !== undefined ? update.hourlyRate : existingPricing.hourly_rate,
        discountedHourlyRate: update.discountedHourlyRate !== undefined ? update.discountedHourlyRate : existingPricing.discounted_hourly_rate,
        freeHoursKlikahCard: update.freeHoursKlikahCard !== undefined ? update.freeHoursKlikahCard : existingPricing.free_hours_klikah_card,
        effectiveDate: update.effectiveDate !== undefined ? update.effectiveDate : existingPricing.effective_date,
        active: existingPricing.active, // <-- תיקון כאן
        createdAt: existingPricing.created_at,
        updatedAt: new Date().toISOString(),
    });

    if (
      update.hourlyRate !== undefined ||
      update.discountedHourlyRate !== undefined
    ) {
      validatePrices([
        update.hourlyRate ?? updatedPricingModel.hourlyRate,
        update.discountedHourlyRate ?? updatedPricingModel.discountedHourlyRate,
      ]);
    }

    if (updatedPricingModel.freeHoursKlikahCard < 0) {
      throw new Error("freeHoursKlikahCard לא יכול להיות שלילי");
    }

    if (update.effectiveDate) {
      await checkEffectiveDateConflict(supabase, 'meeting_room_pricing', update.effectiveDate, {}, id);
    }

    const { data, error: updateError } = await supabase
      .from('meeting_room_pricing')
      .update(updatedPricingModel.toDatabaseFormat())
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating meeting room pricing:', updateError);
      throw new Error('Failed to update meeting room pricing');
    }

    return new MeetingRoomPricingModel({
      id: data.id,
      hourlyRate: data.hourly_rate,
      discountedHourlyRate: data.discounted_hourly_rate,
      freeHoursKlikahCard: data.free_hours_klikah_card,
      effectiveDate: data.effective_date,
      active: data.active,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    });
  } catch (e) {
    console.error('Exception in updateMeetingRoomPricing:', e);
    throw e;
  }
}

export async function deleteMeetingRoomPricing(id: ID): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('meeting_room_pricing')
      .update({ active: false, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      console.error('Error deleting meeting room pricing:', error);
      throw new Error("Failed to delete meeting room pricing");
    }

    return true;
  } catch (e) {
    console.error('Exception in deleteMeetingRoomPricing:', e);
    throw e;
  }
}


// ========================
// תמחור לאונג' - מעודכן לעבודה מול Supabase
// ========================

export async function createLoungePricing(
  request: UpdateLoungePricingRequest
): Promise<LoungePricing> {
  try {
    validatePrices([request.eveningRate, request.memberDiscountRate]);

    if (request.eveningRate < request.memberDiscountRate) {
      throw new Error("ההנחה לחברים לא יכולה להיות גבוהה מהמחיר הרגיל");
    }

    await checkEffectiveDateConflict(supabase, 'lounge_pricing', request.effectiveDate);

    const newPricingModel = new LoungePricingModel({
      eveningRate: request.eveningRate,
      memberDiscountRate: request.memberDiscountRate,
      effectiveDate: request.effectiveDate,
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    const { data, error } = await supabase
      .from('lounge_pricing')
      .insert(newPricingModel.toDatabaseFormat())
      .select()
      .single();

    if (error) {
      console.error('Error creating lounge pricing:', error);
      throw new Error('Failed to create lounge pricing');
    }

    return new LoungePricingModel({
      id: data.id,
      eveningRate: data.evening_rate,
      memberDiscountRate: data.member_discount_rate,
      effectiveDate: data.effective_date,
      active: data.active,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    });
  } catch (e) {
    console.error('Exception in createLoungePricing:', e);
    throw e;
  }
}

export async function createLoungePricingWithHistory(
  request: UpdateLoungePricingRequest
): Promise<LoungePricing> {
  try {
    const { error: updateError } = await supabase
      .from('lounge_pricing')
      .update({
        active: false,
        updated_at: new Date().toISOString(),
        // updated_by: createdBy, // הוסף אם קיים שדה updated_by בטבלה
      })
      .eq('active', true);

    if (updateError) {
      console.error('Error deactivating old lounge pricings:', updateError);
      throw new Error('Failed to deactivate old lounge pricings');
    }

    return await createLoungePricing(request);
  } catch (e) {
    console.error('Exception in createLoungePricingWithHistory:', e);
    throw e;
  }
}

export async function getCurrentLoungePricing(): Promise<LoungePricing | null> {
  try {
    const { data, error } = await supabase
      .from('lounge_pricing')
      .select('*')
      .eq('active', true)
      .order('effective_date', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching current lounge pricing:', error);
      throw new Error('Failed to fetch current lounge pricing');
    }

    if (!data) return null;

    return new LoungePricingModel({
      id: data.id,
      eveningRate: data.evening_rate,
      memberDiscountRate: data.member_discount_rate,
      effectiveDate: data.effective_date,
      active: data.active,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    });
  } catch (e) {
    console.error('Exception in getCurrentLoungePricing:', e);
    throw e;
  }
}

export async function getLoungePricingHistory(): Promise<LoungePricing[]> {
  try {
    const { data, error } = await supabase
      .from('lounge_pricing')
      .select('*')
      .order('effective_date', { ascending: false });

    if (error) {
      console.error('Error fetching lounge pricing history:', error);
      throw new Error('Failed to fetch lounge pricing history');
    }

    return data.map((item:any) => new LoungePricingModel({
      id: item.id,
      eveningRate: item.evening_rate,
      memberDiscountRate: item.member_discount_rate,
      effectiveDate: item.effective_date,
      active: item.active,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
    }));
  } catch (e) {
    console.error('Exception in getLoungePricingHistory:', e);
    throw e;
  }
}

export async function updateLoungePricing(
  id: ID,
  update: Partial<UpdateLoungePricingRequest>,
  updatedBy?: ID
): Promise<LoungePricing> {
  try {
    const { data: existingPricing, error: fetchError } = await supabase
      .from('lounge_pricing')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !existingPricing) {
      console.error('Error fetching existing lounge pricing:', fetchError);
      throw new Error("תמחור לאונג' לא נמצא");
    }

    const updatedPricingModel = new LoungePricingModel({
        id: existingPricing.id,
        eveningRate: update.eveningRate !== undefined ? update.eveningRate : existingPricing.evening_rate,
        memberDiscountRate: update.memberDiscountRate !== undefined ? update.memberDiscountRate : existingPricing.member_discount_rate,
        effectiveDate: update.effectiveDate !== undefined ? update.effectiveDate : existingPricing.effective_date,
        active: existingPricing.active, // <-- תיקון כאן
        createdAt: existingPricing.created_at,
        updatedAt: new Date().toISOString(),
    });

    if (
      update.eveningRate !== undefined ||
      update.memberDiscountRate !== undefined
    ) {
      validatePrices([
        update.eveningRate ?? updatedPricingModel.eveningRate,
        update.memberDiscountRate ?? updatedPricingModel.memberDiscountRate,
      ]);

      if (
        (update.eveningRate !== undefined ? update.eveningRate : updatedPricingModel.eveningRate) <
        (update.memberDiscountRate !== undefined ? update.memberDiscountRate : updatedPricingModel.memberDiscountRate)
      ) {
        throw new Error("ההנחה לחברים לא יכולה להיות גבוהה מהמחיר הרגיל");
      }
    }

    if (update.effectiveDate) {
      await checkEffectiveDateConflict(supabase, 'lounge_pricing', update.effectiveDate, {}, id);
    }

    const { data, error: updateError } = await supabase
      .from('lounge_pricing')
      .update(updatedPricingModel.toDatabaseFormat())
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating lounge pricing:', updateError);
      throw new Error('Failed to update lounge pricing');
    }

    return new LoungePricingModel({
      id: data.id,
      eveningRate: data.evening_rate,
      memberDiscountRate: data.member_discount_rate,
      effectiveDate: data.effective_date,
      active: data.active,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    });
  } catch (e) {
    console.error('Exception in updateLoungePricing:', e);
    throw e;
  }
}

export async function deleteLoungePricing(id: ID): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('lounge_pricing')
      .update({ active: false, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      console.error('Error deleting lounge pricing:', error);
      throw new Error("Failed to delete lounge pricing");
    }

    return true;
  } catch (e) {
    console.error('Exception in deleteLoungePricing:', e);
    throw e;
  }
}