import dotenv from 'dotenv';
dotenv.config();

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;  // שים לב!! לא SUPABASE_KEY אלא SUPABASE_SERVICE_KEY
console.log('SUPABASE_URL:', supabaseUrl);
console.log('SUPABASE_SERVICE_KEY exists:', supabaseKey ? 'Yes' : 'No');
if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_KEY');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
