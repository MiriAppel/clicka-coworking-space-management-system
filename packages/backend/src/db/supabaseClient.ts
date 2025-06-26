import { createClient } from "@supabase/supabase-js";
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_KEY|| ''; // שימי לב לשם המדויק


if (!supabaseUrl || !supabaseKey) {
  console.error("חסרים ערכים ל־SUPABASE_URL או SUPABASE_SERVICE_KEY בקובץ הסביבה");
}

export const supabase = createClient(supabaseUrl, supabaseKey);
